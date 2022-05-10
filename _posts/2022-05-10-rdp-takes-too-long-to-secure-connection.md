---
layout: post
title:  "RDP taking too long to secure remote connection?"
date:   2022-05-10
excerpt: "Weird and wonderful fix that worked for me!"
tagline: "Are your RDP connections taking too long to secure a connection? Try out this simple fix and let me know if it helped!"
description: "A quick fix to speed up your RDP connections."
image: "/images/2022-05-10-1.jpg"
---

## RDP connections takes too long to secure remote connection
I usually connect to a lot of machines using RDP - especially now that I am working from home. One thing I noticed and was very unproductive was that at some point my RDP sessions started taking extremely long at the "Secure remote connection" phase. Searching online and trying out different things didn't help. Here's something that did work for me.

## Remove your old RDP entries
1. In your Windows registry look for the key `HKEY_CURRENT_USER\Software\Microsoft\Terminal Server Client\Default`. 
2. Your RDP machine names appear as MRU<number> entries. Delete the MRU<number> entries that you don't need.
3. I also had to delete the entries under `HKEY_CURRENT_USER\Software\Microsoft\Terminal Server Client\Servers` as otherwise the entries in the earlier key re-appeared.
4. Once deleted, the connections sped right up.

Would love to know if this fix worked for anyone else. Good luck!

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
