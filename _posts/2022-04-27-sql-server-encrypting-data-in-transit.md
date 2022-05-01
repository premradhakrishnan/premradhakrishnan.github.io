---
layout: post
title:  "SQL Server - Encrypting data in transit"
date:   2022-04-27
excerpt: "Data in transit from SQL Server to client is not encrypted by default. Let's see how we can fix this."
image: "/images/2022-04-27-1.jpg"
---

## How to encrypt SQL Server data in transit
1. Set a publicly trusted certificate on the SQL Server Instance
2. Choose either Option A or Option B below
    - Option A (Recommended)
        - Set Force Encryption to No in SQL Server Configuration Manager and restart the instance
        - Update client connections to use the "Encrypt=true" flag
    - Option B
        - Set Force Encryption to Yes in SQL Server Configuration Manager and restart the instance. No other steps required.

### Why is Option A recommended?
Option B is the most convenient option. Once you set "Force Encryption" to yes on the server, all future connections will be encrypted. This is true even if the client doesn't request an encrypted connection. However, this leaves us open to session hijacks via a Man-in-the-Middle-Attack. Refer to this great blog post for further info on this: [Advanced SQL Server Man-in-the-Middle-Attacks](http://blog.blindspotsecurity.com/2017/12/advanced-sql-server-mitm-attacks.html)

Option A puts the responsibility on the client to ask for an encrypted connection. Therefore sql connection strings in applications need to specify "encrypt=true;". Client applications like SSMS, Azure Data Studio, etc need to select the "Encrypt connection" checkbox before connecting. This is obviously more cumbersome as each and every client connecting to the server needs to do this but it's the only way to be really secure.

An advantage of Option A is that you can have queries or extended events to report which users are not using an encrypted connection. If required, you can even have login triggers to stop users from connecting if they don't request an encrypted connection.

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
