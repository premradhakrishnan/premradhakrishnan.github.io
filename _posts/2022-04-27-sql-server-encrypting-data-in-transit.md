---
layout: post
title:  "SQL Server - Encrypting data in transit"
date:   2022-04-27
excerpt: "Data in transit from SQL Server to client is not encrypted by default. Let's see how we can fix this."
image: "/images/pic02.jpg"
---

## How to encrypt SQL Server data in transit
1. Set a publicly trusted certificate on the SQL Server Instance
2. Choose either Option A or Option B below
    - Option A (Recommended)
        - Set Force Encryption to No in SQL Server Configuration Manager
        - Update client connections to use the "Encrypt=true" flag
    - Option B
        - Set Force Encryption to Yes in SQL Server Configuration Manager. No other steps required.

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
