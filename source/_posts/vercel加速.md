---
title: vercel加速
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
copyright_url: 'https://adguy.top/adguy/dfda7e3d.html'
copyright_info: 此文章版权归金晖のBlog所有，如有转载，请注明来自原作者
abbrlink: dfda7e3d
date: 2022-11-24 23:46:31
description:
post_copyright:
---

## 写在前面

githubpages的访问速度非常慢，这里提供一种免费的加速方法，那就是vercel。vercel是类似于githubpages的一个托管平台，但它要更好更快。本站评论区的加速也是用vercel来做的。

**强烈建议拥有自己的域名后再操作**

## 域名加速

进入[vercel官网](vercel.com)，使用你的github账号注册。注册完后把你的博客仓库导入进来。

<img src="https://cdn.jsdelivr.net/gh/laffitto/Pic_bed/20200828214315.png">

导入的过程一路默认即可。

最后点击`deploy`即可完成部署。

## 绑定域名

加速是完成了，但是vercel提供的域名比github还长还难用，所以再进行一步操作：把自己的域名绑定上去。

点击`Domains`，去设置域名绑定。

导入两个域名：`www.自定义域名`和`自定义域名`。

~~然后就会发现报错了~~。不要慌张。

### 修改DNS

Vercel会提示你加两条解析，并且把方法都告诉你了。

进入自己的域名控制台。记得原先添加了两条解析吗，这次咱们新增一条解析，修改一条解析。

- IP地址那条解析，原先的IP地址改成Vercel给你提供的IP地址。
- 新增一条记录类型为`CNAME`，主机记录为`www`，记录值为`cname.vercel-dns.com`的记录。

如果设置正确的话，大概等待十分钟就能让DNS生效，访问网站的速度也大幅度提升！

## 效果

未开梯子的效果。

![image-20221125000254949](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211250004083.png)

![image-20221125000325305](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211250004306.png)

可以看到提升还是很明显的。

{% tip %}[参考文章](https://laffitto.xyz/archives/githubpages%E5%9F%9F%E5%90%8D%E6%9B%B4%E6%8D%A2%E5%92%8Cvercel%E5%8D%9A%E5%AE%A2%E5%8A%A0%E9%80%9F){% endtip %}

