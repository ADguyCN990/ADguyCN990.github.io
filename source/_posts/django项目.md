---
title: django项目
tags:
  - 工程
  - django
  - acwing
categories:
  - 工程
keywords:
  - 工程
  - django
  - acwing
highlight_shrink: false
top_img: https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
katex: false
abbrlink: fcae1915
date: 2022-11-22 11:43:35
post_copyright:
copyright_author: adguy
copyright_author_href: https://adguycn990.github.io
copyright_url: https://adguy.top/adguy/fcae1915.html
copyright_info: 此文章版权归金晖の博客所有，如有转载，请註明来自原作者
---

### 项目描述

此项目是一款基于 Django 的在线对抗游戏，支持联机对战并可依据玩家段位分数进行匹配

### 应用技术

Python、Django、Thrift、Js、Css、WebSocket、radius

### 项目功能

- 自主研发的游戏引擎以实现游戏界面的动态渲染功能
- 单人模式下支持 NPC 随机移动并计算概率以定时向其它 NPC 或用户发射炮弹
- 多人模式下支持联机对战，使用 thrift 在多线程下实现的消息队列、阈值扩大、匹配策略以及匹配成功后的处理方式
- 多人模式下使用 Django 自带的 websocket 通信实现对战中的同步机制如聊天功能
- 系统支持多端登录使用，既支持网页端，也支持 Acapp 端的使用（类似小程序），其信息也是保持同步的
- 使用 shell 脚本对代码打包并利用代码压缩工具防止程序被破解

### 项目成果

独立开发出一款竞技游戏。联机对战与匹配系统增加了游戏的竞技性、实时渲染与粒子效果粉饰了游戏的画面感、 聊天机制与被动技能也提高了游戏的互动性。

### 项目可改进:

- 暂时还没办法显示天梯分，可以完善天梯榜单功能
- 提供用户上传头像的界面
- 优化对战平台的界面美化
- 允许玩家自定义挑战难度
- 允许玩家自定义匹配人数，如3人匹配，4人匹配
- 多样化技能，例如“护盾”技能
- ...

### 项目展示：

[点击进入](https://app2796.acapp.acwing.com.cn/)

### 项目源码:

[访问github仓库](https://github.com/ADguyCN990/acwing-django-lesson)
