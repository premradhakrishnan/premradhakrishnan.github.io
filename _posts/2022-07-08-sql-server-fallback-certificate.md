---
layout: post
title:  "Certificates in SQL Server - DNS certificates and Fallback certificates"
date:   2022-07-08
excerpt: "TLS certificates for SQL Server will soon become increasingly common once developers start using newer Microsoft libraries. Here's how you can configure one for your SQL Server."
tagline: "Steps to configure TLS certificates for your SQL Server"
description: "A quick fix to check if you have the right TLS protocol and cipher suite enabled."
image: "/images/2022-05-10-1.jpg"
---

### Why does SQL Server need an SSL or TLS certificate?
SQL Server uses certificates for encryption. So much so that if one is not provided by us, SQL Server will create it's own self-signed certificate on start up. If we check the SQL Server logs on start up we will see a message similar to "A self-generated certificate was successfully loaded for encryption." 

### How to generate a certificate to assign to SQL Server
The options available for a trusted certificate are many depending on the environment. 3 such options are:

Option A - Based on the server name in the connection string to connect to SQL Server, get a public DNS certificate from GoDaddy or Digicert and use this. Having a publicly trusted cert will mean that any client connecting to the server will implicitly trust the certificate.

Option B - If the server and client are hosted within a trusted AD environment, the IS team might already have trusted root certficates enabled and then we can just assign this to SQL Server. These certificates will only be trusted within the AD environment and a client from outside of it will have to either import this cert into their trusted store or set the "TrustServerCertifcate" flag to true (dangerous in prod!)

Option C - In dev we can always create a self-signed certificate and import this into trusted store. [This article](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine?view=sql-server-ver15#certificate-requirements) lists all the parameters needed for the certificate.

Once we have the right certificate -

1. On SQL Server import this certificate into the cert store. 
2. Ensure the SQL Server account that starts up the SQL Instance has read permissions for this certificate. Right-click on <cert name> | All Tasks | Manage Private keys to do this.

### How to assign the certificate to SQL Server
There are 2 options to do this. 

- Option A - Use the SQL Server Configuration Manager UI. Open Configuration Manager and right-click Properties on the Protocols option for your SQL Instance. In the "Certificate" tab, under the certificate dropdown you should see the certificate you generated in the earlier step above. Select this and restart your SQL Server Instance.

- Option B - Find your certificate's thumbprint and update the following Windows registry key with the thumbprint value and restart the SQL Server instance. By default, the certificate is located in the registry, at:
`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL.x\MSSQLServer\SuperSocketNetLib`

### Done
Once the above steps are completed, SQL Server will start using this certificate for any encryption requirements. 

### System.Data.SqlClient vs Microsoft.Data.SqlClient
A breaking change that happens when switching to the newer `Microsoft.Data.SqlClient` library is that the `Encrypt` flag in the connection string is set to `true` by default. This means that client connecting to SQL Server will ask for an encrypted connection by default and if at that point the client does't trust the certificate that SQL Server offers, the connection will break. Once this happens we have 2 alternatives - either set a valid cert as per above or set `TrustServerCertificate=true` which is not recommended in a prod environment. Therefore the only viable alternative is to add a valid cert to SQL Server. 

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
