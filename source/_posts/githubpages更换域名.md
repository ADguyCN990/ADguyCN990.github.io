---
title: githubpages更换域名
tags:
  - 工程
  - web前端
  - 环境配置
  - hexo
categories:
  - 工程
  - web前端
keywords:
  - 工程
  - web前端
  - 环境配置
  - hexo
  - githubpages
  - 域名
  - 域名解析
top_img: >-
  https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
highlight_shrink: false
katex: false
copyright_author: adguy
copyright_author_href: 'https://adguy.top'
copyright_url: 'https://adguy.top/adguy/d0e61922.html'
copyright_info: 此文章版权归金晖のBlog所有，如有转载，请注明来自原作者
abbrlink: d0e61922
date: 2022-11-24 22:43:46
description:
post_copyright:
---

## 写在开头

使用githubpages部署博客的网址是`xxxx.github.io`，太捞了，想换个域名很正常。本文章就基于这个介绍，githubpages换成自定义域名的教程。

## 购买域名

由于服务器是放在github上的，也就是国外服务器，所以买域名是不用备案的。

（如果要使用国内厂商的cdn加速的话还是要备案的）。

总之，买一个自己的专属域名，本章不重点介绍。后缀选啥应该都没什么区别，博主用的`top`，逼格高又便宜。

## 域名解析

买完域名后，进入域名控制台，在操作一栏中点击`解析`。我们要在这里添加两条记录。

### 记录1

打开自己的cmd终端，输入命令`ping yourname.github.io`获取ip地址，大概长这样：xxxx.xxxx.xxxx.xxx

返回域名控制台，点击添加记录，选择

- 记录类型：A
- 主机记录：@
- 记录值：刚才得到的IP地址

### 记录2

返回域名控制台，点击添加记录，选择

- 记录类型：CNAME
- 主机记录：www
- 记录值：yourname.github.io

添加以上两条记录完毕后，如果状态都显示正常，说明就成功了。

## Github设置

进入github管理静态博客页面的那个仓库，点开`setting\pages`，在`custom domain`里写入你的自定义域名，再点击save保存。大概等一会，颁发安全证书，然后勾选上下面的`Enforce HTTPS`（强制使用HTTP）。

## 本地

在HEXO博客的`root/source`文件夹下，新建一个`CNAME`文件（无后缀名）。

将`www.自定义域名`和`自定义域名`写入文件。以站主为例，写入了`adguy.top`和`www.adguy.top`。

## 效果

输入以下三行命令

`hexo clean`

`hexo g`

`hexo d`

如一切正常顺利，过两三分钟即可看到自己的自定义域名能够使用啦！

