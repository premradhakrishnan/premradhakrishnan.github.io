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
While you can use Microsoft.Win32.Registry to read and write keys, sometimes you can get caught out. When a 32-bit application runs on a 64-bit OS, it will by default look at HKEY_LOCAL_MACHINE\Software\Wow6432Node. Let's look at a couple of examples to clarify this.

Let's say you have a registry subkey HKEY_LOCAL_MACHINE\Software\MyCustomApp which has a key MyCustomKey of type REG_DWORD with a value of 1. In this case, You can use the below to read the subkey.

`Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SOFTWARE\MyCustomApp1")`

Now in another example, let's say the registry key is instead under HKEY_LOCAL_MACHINE\Software\Wow6432Node\MyCustomApp. In this case, you will have to specify the RegistryView.Registry32 to get the value.

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
