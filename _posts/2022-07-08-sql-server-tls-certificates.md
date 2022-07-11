---
layout: post
title:  "Certificates in SQL Server - DNS and Fallback certificates"
date:   2022-07-08
excerpt: "TLS certificates for SQL Server will soon become increasingly common once developers start using newer Microsoft libraries. Here's how and why you should configure one."
tagline: "Steps to configure TLS certificates for your SQL Server"
description: "A slightly longer post than I would like but I think it was warranted. Let's look at how and why we should be using certificates in SQL Server."
image: "/images/2022-05-10-1.jpg"
---

### System.Data.SqlClient vs Microsoft.Data.SqlClient
Before we jump in to how we do it, a quick minute to see why we need to. One reason is, a breaking change that happens when switching from `System.Data.SqlClient` to the newer `Microsoft.Data.SqlClient`. A not very well known fact is, by default communications between SQL Server and client applications are not encrypted. If you would like to encrypt this you need to specify additional flags in your connection strings to do this. Advanced Sql Server Management Studio (SSMS) users, will remember seeing the `Encrypt connection` option in the `Login | Options` section.

In the `System.Data.SqlClient` library, this `Encrypt` flag in the connection string is set to `false` by default but this has switched to `true` in `Microsoft.Data.SqlClient`. This means that any client connecting to SQL Server will ask for an encrypted connection by default. At this point, SQL Server will present to the client the certificate it will be using for the TLS connection. If the client doesn't trust this certificate that is presented, the connection will be terminated. To fix this we have 3 alternatives - 

- Option A (recommended) - Set a valid cert on the SQL Server instance. How to instructions are covered further below.
- Option B - Set the `Encrypt` flag back to false. This obviously has the same effect as using the older library but I guess it forces us to acknowledge that we realise the communication is not encrypted.
- Option C - (not recommended) - Leave the `Encrypt` flag as is and add a `TrustServerCertificate=true` flag to the connection string. 

Option C is not recommended in a prod environment as it means that any certificate presented to the client (including self-signed ones) will be trusted by the client. Therefore if we want to encrypt communications between SQL Server and client, the only viable alternative is to add a valid cert to SQL Server. I have covered other options to consider in [another post earlier](https://premradhakrishnan.github.io/blog/sql-server-encrypting-data-in-transit/).

So that's the why addressed. Let's look at how we do this.


### Why does SQL Server need an SSL or TLS certificate?
SQL Server uses certificates for encryption. So much so that if one is not provided by us, SQL Server will create it's own self-signed certificate on start up. If we check the SQL Server logs on start up we will see a message similar to "A self-generated certificate was successfully loaded for encryption." if it's a self generated one. If we have assigned a certificate, the log entry will show that a certificate with thumbprint `xyz..` was loaded.

### How to generate a valid certificate to assign to SQL Server
The options available for a trusted certificate are many depending on the environment. 3 such options are:

Option A - Get a public SSL/TLS DNS certificate from GoDaddy or DigicertBased like you would normally. The name for the cert will be the server name in the connection string we use to connect to SQL Server. Having a publicly trusted cert will mean that any client connecting to the server will implicitly trust the certificate.

Option B - If the server and client are hosted within a trusted AD environment, the IS team might already have trusted root certficates enabled and then we can just assign this to SQL Server. These certificates will only be trusted within the AD environment and non-domain joined client apps trying to connect will have to either import this cert into their trusted store or set the "TrustServerCertifcate" flag to true (not recommended as covered above)

Option C - In dev we can create a self-signed certificate and import this into our trusted store. [This article](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine?view=sql-server-ver15#certificate-requirements) lists all the parameters needed us to generate a valid certificate.

### Once we have the right certificate

1. On SQL Server import this certificate into the cert store. 
2. Ensure the SQL Server account that starts up the SQL Instance has read permissions for this certificate. Right-click on <cert name> | All Tasks | Manage Private keys to do this.

### How to assign the certificate to SQL Server
There are 2 options to do this. 

- Option A - Use the SQL Server Configuration Manager UI. Open Configuration Manager and right-click Properties on the Protocols option for your SQL Instance. In the "Certificate" tab, under the certificate dropdown you should see the certificate you generated in the earlier step above. Select this and restart your SQL Server Instance.

- Option B - Find your certificate's thumbprint and update the following Windows registry key with the thumbprint value and restart the SQL Server instance. By default, the certificate is located in the registry, at:
`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL.x\MSSQLServer\SuperSocketNetLib`

### Done
Once the above steps are completed and the instance restarted, SQL Server will use this certificate to encrypt TLS connections. We can verify that the certificate is working by connecting via SSMS and checking the "Encrypt connection" option and then using the below query:

```
SELECT	c.local_tcp_port, c.session_id, e.login_name, c.encrypt_option,e.program_name, e.host_name, e.login_time, c.client_net_address 
FROM	sys.dm_exec_connections c
INNER JOIN	sys.dm_exec_sessions e ON c.session_id = e.session_id
```

### Common Errors
2 common error messages when using encrypted connections are - 

1. "The target principal name is incorrect." - Check that your DNS certificate name matches your server name in this case.
2. "The certificate chain was issued by an authority that is not trusted." - Windows doesn't trust the certificate that has been presented. Check that the certificate has been installed in the right place and that the chain of trust and the certificate authority hierarchy are preserved.

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
