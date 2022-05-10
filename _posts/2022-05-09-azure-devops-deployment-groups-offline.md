---
layout: post
title:  "Azure DevOps - Deployment Groups Offline"
date:   2022-05-09
excerpt: "Azure DevOps have disabled communications over TLS 1.0 and 1.1. Is your Deployment Group offline? Here's one quick fix for this."
tagline: "Your server may support TLS 1.2. But does it also support the cipher suite required for DevOps to work?"
description: "A quick fix to check if you have the right TLS protocol and cipher suite enabled."
image: "/images/2022-05-09-1.jpg"
---

## Azure DevOps and TLS 1.x
As of May 2022, Azure DevOp have disabled communications over TLS 1.0 and 1.1. For deployments and pipelines to work your server needs to not just support TLS 1.2 but also have the right cipher suites enabled.

## A quick fix if Azure DevOps Deployment Groups go offline due to TLS 1.x
1. [Download IIS Crypto](https://www.nartac.com/Products/IISCrypto/Download) from the Nartac Software portal
2. Run the IIS Crypto tool
3. In the "Schannel" tab, ensure that the TLS 1.2 option is checked under Server and Client protocols.
4. In the "Cipher Suites" tab check if one of the below suites are supported. Source: [MS Dev Blogs](https://devblogs.microsoft.com/devops/deprecating-weak-cryptographic-standards-tls-1-0-and-1-1-in-azure-devops-services/) - 
    - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
    - TLS_DHE_RSA_WITH_AES_256_GCM_SHA384 (*)
    - TLS_DHE_RSA_WITH_AES_128_GCM_SHA256 (*)
5. If none of the above are checked, pick one (preferably one of the 256 suites).
6. Reboot to apply changes
    
Your Deployment groups should be back online after the reboot (if the issue was TLS 1.x relted!)


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
