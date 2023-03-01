---
title: 配置Mysql与Spring Security模块
tags:
  - Springboot
categories:
  - 工程
  - Springboot
  - kob
keywords:
  - Springboot
top_img: >-
  https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
highlight_shrink: true
katex: false
copyright_author: adguy
copyright_author_href: 'https://adguy.top'
copyright_url: 'https://adguy.top/adguy/31e76a34.html'
copyright_info: 此文章版权归金晖のBlog所有，如有转载，请注明来自原作者
abbrlink: 31e76a34
date: 2022-12-21 18:56:05
description:
post_copyright:
---

## 思维导图

![整体框架](https://img-blog.csdnimg.cn/3ccb01484a814e03a0b63127ab2033b6.png#pic_center)

应用模型：
SpringBoot 的角色是用来处理用户请求，client 端向 spring Boot 发送请求，然后向数据库请求数据，数据库返回数据给前端。

## 配置Mysql

1. 下载并安装Mysql
2. 配置环境变量
3. 连接IDEA

mysql服务默认开机自动启动，如果向手动操作，可以参考如下命令：

- 关闭：`net stop mysql80`
- 启动：`net start mysql80`

### Mysql常用命令

- 连接用户名为root，密码为`xxxxxx`的数据库服务：`mysql -u root -p xxxxxx`
- 列出所有数据库：`show databases;`
- 创建数据库：`create database kob;`
- 删除数据库：`drop database kob;`
- 使用数据库“kob”：`use kob;`
- 列出当前数据库的所有表：`show tables;`
- 创建名称为 user 的表，表中包含 id 和 username 两个属性：`create table user(id int, username varchar(100));`
- 删除表：`drop table user;`
- 在表中插入数据：`insert into user values(1, 'adguy');`
- 查询表中所有数据：`select * from user;`
- 删除某行数据：`delete from user where id = 2;`

## 配置SpringBoot模块

为了在IDE中方便对数据库进行操作，需要配置一下IDEA。

1. 添加依赖。在`pom.xml`中添加以下依赖，可以在[Maven仓库](https://mvnrepository.com/)中寻找。
   1. `Spring Boot Starter JDBC`
   2. `Project Lombok`
   3. `MySQL Connector/J`
   4. `mybatis-plus-boot-starter`
   5. `mybatis-plus-generator`
2. 在`application.properities`中添加数据库配置

```java
//输入你自己的用户和密码
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.url=jdbc:mysql://localhost:3306/kob?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

## 后端数据处理概念

后端职责可以粗浅的理解为处理各种数据，那么处理数据就可以从下面几个方面考虑：

- 数据来源
- 数据形式
- 数据操作
- 数据交互

### 数据来源

想要持久化存储数据，需要将数据存入数据库。

想要对数据进行各种丰富的处理，需要将数据存放进 Java 的各种数据结构中（List、Map…）。

还有一个来源就是用户在前端的输入。

#### 数据库

- 数据形式：关系型数据库里面的存储可以见到的组织形式就是表。
- 数据操作：SQL语言

#### JAVA后端

- 数据形式：类，数据结构
- 数据操作：方法调用

#### 前端

- 数据形式：字符串，JSON
- 数据操作：JavaScript

### 数据交互

数据的来源有三个，一般都是以 Java 后端作为中间桥梁。我们一对一对的看。数据交互要达到的效果就是统一形式、互相操作。

#### 数据库和JAVA后端

数据库一般只是用来提供数据，所以交互的任务就落到了 Java 后端的身上。

数据库里面数据组织的形式是表，Java 里面是类，因为我们要把数据拿到 Java 里面去操作。一个很自然的想法就是，将表直接映射成 Java 里面的类，由于类只是一个结构，我们具体操作的是类的对象。所以我们更多地会说成将表映射成对象。由于这里的表特指关系型数据库的表，所以这种映射被称为 Object–relational mapping，即对象关系映射，简称 ORM.

那么表能变成对象吗？我们发现是可以的。因为表里的各个属性可以映射到对象的属性上来，每一条表的记录都可以映射成一个对象的各个属性。

理论上是可行的，那实际操作呢？所以为了方便 Java 程序员操作数据库，JDK 和数据库厂商就一起提供了一套 API，供大家使用。既然是一套 API，那么就有规定的一套流程。由于数据库厂商的不同，细节可能不一样，但是流程是大体相同的。以下流程来自 Oracle 官网：

1. 创建连接，加载驱动
2. 声明一个用于执行数据操作的对象 statement
3. 通过 SQL 执行查询等操作
4. 处理得到的结果对象 ResultSet
5.  关闭连接

当我们的数据库不发生变化的时候，我们的 1、2、5 等操作可能是不变的，我们在写代码时，不希望总关注这些机械的操作。我们可能更关心的是 3 和 4，3 是和数据库相关的查询等操作，4 是对表记录对应对象的操作，这就刚好对应了我们的关注点，将表记录转换成对象。

所以在这种情况下，Java 程序员甚至不需要懂 SQL，就完成了和数据库的交互。可以概括如下：

- 定义实体类
- 写接口
- 调用接口

但是默认的这些方法所能够拥有的功能是有限的。那有没有一种框架，在简单时，直接调用方法，复杂时，可以自定义 SQL 呢？有啊，它就是 MyBatis Plus. 它在 MyBatis 的基础上增加了一些常用的接口和功能。

### 后端对数据的处理

不管你是用什么方式从数据库拿到的数据，在 Java 里面就是一个个对象，这时候就可以拿 Java 语言对数据进行各种操作咯。那么处理完成以后，你还需要返回给前端。

### 前后端数据交互

既然要返回给前端，那么数据形式仍然要统一。前端可以认识的形式就是 JSON，所以我们需要把 Java 对象转换成 JSON，数据格式如果统一的话，那么我们还要想的就是前后端如何通信。

前端每一个请求都对应一个 URL，我们将 URL 和 Java 的方法建立映射，一旦在前端访问到 URL，我们就执行相应的后端方法处理相应的请求。

而这些工作在 Spring Boot 里面都有了很好的支持，我们通常使用注解来进行实现。

当然前端也可以发送 JSON 格式的数据给后端，后端转换为 Java 对象，再通过 ORM 框架完成存入数据库的操作。

### 后端分层的依据

我们可以看到，Java 后端承载着太多的使命：

- 数据库访问
- 数据处理
- 前后端交互

那么将每一项使命放在不同的包里，就对应的变成了 dao 层、service 层和 controller 层。

## SpringBoot实现简单的CRUD

承接上文，这块介绍SpringBoot框架如何对后端的使命进行处理。

- pojo层：将数据库中的表对应成 Java 中的 Class
- mapper层（也叫Dao层）：将 pojo 层的 class 中的操作，映射成 sql 语句
- service层：写具体的业务逻辑，组合使用 mapper 中的操作
- controller层：负责请求转发，接受页面过来的参数，传给 Service 处理，接到返回值，再传给页面

![个人理解.png](https://cdn.acwing.com/media/article/image/2022/07/31/2686_dbebc0f310-%E4%B8%AA%E4%BA%BA%E7%90%86%E8%A7%A3.png)

### 注解

使用注解可以帮助我们不在需要配置繁杂的 xml 文件，以前最基本的 web 项目是需要写 xml 配置的，需要标注你的哪个页面和哪个 servlet 是对应的，注解可以帮助我们减少这方面的麻烦。

- `@Controller`：用于定义控制器类，在 spring 项目中由控制器负责将用户发来的 URL 请求转发到对应的服务接口（service 层），一般这个注解在类中，通常方法需要配合注解 @RequestMapping。
- `@RequestMapping`：提供路由信息，负责 URL 到 Controller 中的具体函数的映射。
- `@AutoWired`：自动导入依赖的 bean。byType 方式。把配置好的 Bean 拿来用，完成属性、方法的组装，它可以对类成员变量、方法及构造函数进行标注，完成自动装配的工作。当加上（required=false）时，就算找不到 bean 也不报错。
- `@Service`：一般用于修饰 service 层的组件。
- `@Bean`：用 @Bean 标注方法等价于 XML 中配置的 bean。

### 示例

在本项目中，假设我们要实现一个表，表中存放id，username，password三个内容，下面给出具体实现示例。

#### pojo层

在这里我们要实现Java类和数据库表的转化。在根目录下创建`pojo`包，创建一个类User，将数据库中的表 User 转化为 Java 中的 User.class。

```java
package com.example.backend.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {
    private Integer id;
    private String username;
    private String password;
}
```

#### mapper层

在根目录创建 mapper 包，创建一个 Java 类的接口 UserMapper

在这里我们要实现Java方法和SQL语言的映射。实际上这并不需要我们实现，只需要继承已有的类即可。

```java
package com.example.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.backend.pojo.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {

}

```

#### Service和Controller

实现具体的业务逻辑和前后端交互。由于逻辑比较简单，所以暂时将两个合并在一起写。

在根目录的 controller 下创建 user 包然后创建 UserController.

写入以下代码后，通过在前端访问指定的url，后端就能知道前端的意图并对数据库进行相对应的操作。

```java
package com.example.backend.controller.user;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.backend.mapper.UserMapper;
import com.example.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.embedded.jetty.JettyServletWebServerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    UserMapper userMapper;

    //查询所有用户
    @GetMapping("/user/all")
    public List<User> getAll() {
        return userMapper.selectList(null);
    }

    //根据ID查找用户
    @GetMapping("/user/{userid}")
    public User getUser(@PathVariable int userid) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", userid);

        // 范围遍历
        // public List<User> getUser(int userId)
        // queryWrapper.ge("id", 2).le("id", 3);
        // return userMapper.selectList(queryWrapper);
        return userMapper.selectOne(queryWrapper);
    }

    //添加用户
    @GetMapping("/user/{userid}/{username}/{password}")
    public String addUser(@PathVariable int userid,
                          @PathVariable String username,
                          @PathVariable String password) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(userid, username, encodedPassword);
        userMapper.insert(user);
        return "添加成功！";
    }

    //删除用户
    @GetMapping("/user/delete/{userid}")
    public String deleteUser(@PathVariable int userid) {
        userMapper.deleteById(userid);
        return "删除成功！";
    }

}
```

## 配置Spring Security

是用户认证操作 – 一种授权机制，目的是安全。

之前实现了一些API，用于前后端交互。很明显，这些API不能够被随意调用，比如张三可以通过调用API删除李四的账号。这样用户数据的安全性不能够得到保障。

因此要实现一种认证机制，确保各个API的调用是有权限（开发者决定）的。

1. 添加依赖`spring-boot-starter-security`

默认的username是user，密码自动生成。

2. 与数据库对接

在根目录的service 创建 impl 包，新建 UserDetailsServiceImpl 类。
实现 service.impl.UserDetailsServiceImpl 类，实现了 UserDetailsService 接口，用来接入数据库信息。

```java
package com.example.backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.backend.mapper.UserMapper;
import com.example.backend.pojo.User;
import com.example.backend.service.impl.utils.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        User user = userMapper.selectOne(queryWrapper);
        if (user == null) {
            throw new RuntimeException("该用户不存在！");
        }
        return new UserDetailsImpl(user);
    }
}
```

在 backend 的 service 包的 impl 包下创建 utils 包 新建 UserDetailsImpl。这是一个辅助类。

```java
package com.example.backend.service.impl.utils;

import com.example.backend.pojo.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

```

### 设置密文编码

用户在前端输入的密码是明文，而数据库中存放的都是密文。明文根据一定的规则可以很轻松的转化成密文，但密文是不可逆的。

为了实现明文和密文的对应关系，需要提供一个编码器。

在`config`下新建`SecurityConfig`，实现`SecurityConfig`类，用来表示用户密码的编码器。

```Java
package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

然后修改下CRUD中的实现逻辑，把用户从前端输入的明文转化成密文后，再存入数据库。

```java
@GetMapping("/user/{userid}/{username}/{password}")
    public String addUser(@PathVariable int userid,
                          @PathVariable String username,
                          @PathVariable String password) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(userid, username, encodedPassword);
        userMapper.insert(user);
        return "添加成功！";
    }
```

至此，用户从前端输入的明文就可以自动转化成密文存入数据库了。

~~当然，也可以在数据库的密码的前缀写入{noop}，这样数据库中存放的就是明文了。~~
