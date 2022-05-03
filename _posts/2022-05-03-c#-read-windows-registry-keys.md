---
layout: post
title:  "C# - Read Windows registry keys"
date:   2022-05-03
excerpt: "Reading Windows registry keys using C# should be straight forward. Or is it?"
tagline: "How to read Windows registry keys using C# for 32-bit and 64-bit applications."
description: "There are some gotchas when trying to read registry keys in a 64-bit OS. While the Microsoft.Win32 librares are useful you still need to know where to look."
image: "/images/2022-05-03.jpg"
---

## How to read Windows registry keys using C#
While you can use Microsoft.Win32.Registry to read and write keys, sometimes you can get caught out. When a 32-bit application runs on a 64-bit OS, it will by default look at HKEY_LOCAL_MACHINE\Software\Wow6432Node. 

### Wow6432Node Registry Key
The below section is courtesy of the [Advanced Installer website](https://www.advancedinstaller.com/user-guide/registry-wow6432-node.html)

> The Wow6432Node registry entry indicates that you are running a 64-bit Windows version.  
>
> The operating system uses this key to display a separate view of HKEY_LOCAL_MACHINE\SOFTWARE for 32-bit applications that run on 64-bit Windows versions. When a 32-bit application writes or reads a value under the HKEY_LOCAL_MACHINE\SOFTWARE\<company>\<product> subkey, the application reads from the HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\<company>\<product> subkey.  
>
> A registry reflector copies certain values between the 32-bit and 64-bit registry views (mainly for COM registration) and resolves any conflicts using a "last-writer-wins" approach.

### Examples
Let's look at a couple of examples to clarify this.

Let's say you have a registry subkey HKEY_LOCAL_MACHINE\Software\MyCustomApp with key MyCustomKey, type REG_SZ, value=TRUE. In this case, the code you would normally use to read this subkey is: 

```
var subKey = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SOFTWARE\MyCustomApp1");
```

However, if it is a 32-bit application running in a 64-bit OS, var subKey will return null. Instead you will need to append the path to the below.

```
var subKey = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SOFTWARE\WOW6432Node\MyCustomApp1");
```

Alternatively, in the below code you can specify either RegistryView.Registry32 (for 32-bit) or RegistryView.Registry64 (for 64-bit) as the second parameter to get the right value .

```
using (Microsoft.Win32.RegistryKey hklm32 = 
    Microsoft.Win32.RegistryKey.OpenBaseKey(Microsoft.Win32.RegistryHive.LocalMachine, 
    Microsoft.Win32.RegistryView.Registry32))
{
    using (var subKey = hklm32.OpenSubKey(@"SOFTWARE\MyCustomApp"))
    {
        if (subKey != null)
        {
            var keyValue = subKey.GetValue("MyCustomKey");
        }
    }
}
```

If you use RegistryView.Registry64 you will be reading from HKEY_LOCAL_MACHINE\Software\MyCustomApp mentioned in the first example.

<!-- ## Features
### Auto-Generating Sitemap
The sitemap is auto generated! Just simply change the front matter of each site. It looks like so...
```
sitemap:
    priority: 0.7
    lastmod: 2017-11-02
    changefreq: weekly
```
### Formspring integration
The contact form below each page on the footer actually collects information! Just change your email address in the ```_config.yml``` file! -->
