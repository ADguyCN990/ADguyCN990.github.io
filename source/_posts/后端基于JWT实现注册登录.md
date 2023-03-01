---
title: 后端基于JWT实现注册登录
tags:
  - Springboot
categories:
  - 工程
  - Springboot
  - kob
keywords:
  - Springboot
  - JWT
  - 注册
  - 登录
top_img: >-
  https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
highlight_shrink: true
katex: false
copyright_author: adguy
copyright_author_href: 'https://adguy.top'
copyright_url: 'https://adguy.top/adguy/e6fba690.html'
copyright_info: 此文章版权归金晖のBlog所有，如有转载，请注明来自原作者
abbrlink: e6fba690
date: 2022-12-22 17:40:38
description:
post_copyright:
---

## 思维导图

![4.2 实现注册与登录模块](https://img-blog.csdnimg.cn/3da321496911427fb32903b0b1bfdf28.png#pic_center)

## 登录原理

### session

session是传统方法。

把一个网站所有的页面大致分为两类：

- 公开页面（未公开可以）login 页面 —— 与数据库一致，给用户发一个 sessionID，用户存到 cookie 中，每次请求访问时，将 cookie 中的 session 发给服务器
- 授权页面（登录后部分用户可见）—— 提取 cookie 中的 sessionID，判断是否有效，如果有效，则提取对应的用户信息到上下文中（一个 url 对应一个 Controller）

![传统登录验证的模式](https://cdn.acwing.com/media/article/image/2022/07/27/191198_24c347dc0d-image_MG4B98E-eN.png)

缺点：多端，跨域，多服务器分布式端，sessionID不好用。

### JWT验证

具体可以参考[这篇文章](https://blog.csdn.net/HD243608836/article/details/115732104)

JWT解决了session的缺点。

使用基于 Token 的身份验证方法，在服务端不需要存储用户的登录记录。大概的流程是这样的：

- 客户端使用用户名跟密码请求登录
- 服务端收到请求，去验证用户名与密码
- 验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端
- 客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里
- 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token
- 服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据

特点：

- 三部分组成，每一部分都进行字符串的转化
- **解密的时候没有使用数据库，仅仅使用的是 secret 进行解密（减小服务器资源压力）**
- Jwt 使用的 secret 千万不能丢失

![现在的验证方式](https://cdn.acwing.com/media/article/image/2022/07/27/191198_3f9c4aac0d-image_wj8DnGk9ke.png)

## 前置工作

添加依赖，在Maven仓库中寻找以下依赖：

- `jjwt::api`
- `jjwt-impl`
- `jjwt-jackson`

添加辅助类。

实现`utils.JwtUtil`类，用于创建、解析JwtToken

```java
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {
    public static final long JWT_TTL = 60 * 60 * 1000L * 24 * 14;  // 有效期14天
    public static final String JWT_KEY = "SDFGjhdsfalshdfHFdsjkdsfds121232131afasdfac";

    public static String getUUID() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

    public static String createJWT(String subject) {
        JwtBuilder builder = getJwtBuilder(subject, null, getUUID());
        return builder.compact();
    }

    private static JwtBuilder getJwtBuilder(String subject, Long ttlMillis, String uuid) {
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        SecretKey secretKey = generalKey();
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        if (ttlMillis == null) {
            ttlMillis = JwtUtil.JWT_TTL;
        }

        long expMillis = nowMillis + ttlMillis;
        Date expDate = new Date(expMillis);
        return Jwts.builder()
                .setId(uuid)
                .setSubject(subject)
                .setIssuer("sg")
                .setIssuedAt(now)
                .signWith(signatureAlgorithm, secretKey)
                .setExpiration(expDate);
    }

    public static SecretKey generalKey() {
        byte[] encodeKey = Base64.getDecoder().decode(JwtUtil.JWT_KEY);
        return new SecretKeySpec(encodeKey, 0, encodeKey.length, "HmacSHA256");
    }

    public static Claims parseJWT(String jwt) throws Exception {
        SecretKey secretKey = generalKey();
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }
}
```

实现`config.filter.JwtAuthenticationTokenFilter`类，用来验证JwtToken。如果验证成功，则将user信息注入到上下文中

```java
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
    @Autowired
    private UserMapper userMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull FilterChain filterChain) throws ServletException, IOException {
        String token = request.getHeader("Authorization");

        if (!StringUtils.hasText(token) || !token.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        token = token.substring(7);

        String userid;
        try {
            Claims claims = JwtUtil.parseJWT(token);
            userid = claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        User user = userMapper.selectById(Integer.parseInt(userid));

        if (user == null) {
            throw new RuntimeException("用户名未登录");
        }

        UserDetailsImpl loginUser = new UserDetailsImpl(user);
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginUser, null, null);

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        filterChain.doFilter(request, response);
    }
}
```

配置`config.SecurityConfig`类，放行登录、注册等接口。

```java
import com.kob.backend.config.filter.JwtAuthenticationTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/user/account/token/", "/user/account/register/").permitAll()
                .antMatchers(HttpMethod.OPTIONS).permitAll()
                .anyRequest().authenticated();

        http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
```

## 后端实现API

- 实现`/user/account/token`：登录界面，验证用户名密码，验证成功后返回JwtToken。
- 实现`/user/account/info/`：根据令牌返回用户信息
- 实现`/user/account/register`：注册账号。若合法，则将该用户添加进数据库

为了实现这些API，需要写3个类

- 在Service层中定义接口
- 在Service中实现接口
- 在Controller中实现url和API之间的映射

## 登录API

在`/service/user/account`中声明一个接口`LoginService`

```java
package com.example.backend.service.user.account;

import java.util.Map;

public interface LoginService {
    public Map<String, String> getToken(String username, String password);
}
```

在`/service/impl/user/account`中定义`LoginServiceImpl`类实现该接口（写具体的业务逻辑）。其中返回的Map类，就是前端收到的`resp`。

```java
package com.example.backend.service.impl.user.account;

import com.example.backend.pojo.User;
import com.example.backend.service.impl.utils.UserDetailsImpl;
import com.example.backend.service.user.account.LoginService;
import com.example.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Map<String, String> getToken(String username, String password) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);

        Authentication authenticate = authenticationManager.authenticate(authenticationToken); //若登录失败，会自动处理
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticate.getPrincipal();
        User user = loginUser.getUser();
        String jwt = JwtUtil.createJWT(user.getId().toString());

        Map<String, String> map = new HashMap<>();
        map.put("error_message", "success"); //登录成功，返回账号信息和jwt字符串
        map.put("token", jwt);

        return map;
    }
}
```

在`/controller/user/account`里声明一个类`LoginController`，用于实现url和API的映射。这样就能实现前后端交互了。

```java
package com.example.backend.controller.user.account;

import com.example.backend.service.user.account.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping("/user/account/token/")

    public Map<String, String> getToken(@RequestParam Map<String, String> map) {
        String username = map.get("username");
        String password = map.get("password");
        return loginService.getToken(username, password);
    }

}
```

注意这里的注解`@RequestParam`，之前用的是`@Path...`，这俩是有区别的。

1、@RequestParam 注解作用:

  获取 URL 中携带的请求参数的值既 URL 中 “?” 后携带的参数，传递参数的格式是:key=value

  如: https://localhost/requestParam/test?key1=value1&key2=value2...

2、@PathVariable 注解作用:

  用于获取 URL 中路径的参数值，参数名由 RequestMapping 注解请求路径时指定，常用于 restful 风格的 api 中，传递参数格式：直接在 url 后添加需要传递的值即可

  如: https://localhost/pathVariable/test/value1/value2...

## 根据令牌返回用户信息API

在`/service/user/account`声明一个接口`InfoService`

```java
package com.example.backend.service.user.account;

import java.util.Map;

public interface InfoService {
    //根据token返回用户信息
    public Map<String, String> getInfo();
}
```

在`/service/impl/user/account`中，实现一个类`InfoServiceImpl`，实现上面的接口（写具体业务逻辑）。其中返回的Map类，就是前端收到的`resp`。

```java
package com.example.backend.service.impl.user.account;

import com.example.backend.pojo.User;
import com.example.backend.service.impl.utils.UserDetailsImpl;
import com.example.backend.service.user.account.InfoService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class InfoServiceImpl implements InfoService {


    //根据token返回用户信息
    @Override
    public Map<String, String> getInfo() {
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        UserDetailsImpl loginUser = (UserDetailsImpl) authentication.getPrincipal();
        User user = loginUser.getUser();

        Map<String, String> map = new HashMap<>();
        map.put("error_message", "success");
        map.put("id", user.getId().toString());
        map.put("username", user.getUsername());
        map.put("photo", user.getPhoto());
        return map;
    }
}
```

在`/controller/user/account`中实现`InfoController`类，完成url到API的映射。

```java
package com.example.backend.controller.user.account;

import com.example.backend.service.user.account.InfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class InfoController {
    @Autowired
    private InfoService infoService;

    @GetMapping("/user/account/info/")
    public Map<String, String> getInfo() {
        return infoService.getInfo();
    }
}
```

## 注册API

在`/service/user/account`中声明一个接口`RegisterService`

```java
package com.example.backend.service.user.account;

import java.util.Map;

public interface RegisterService {
    public Map<String, String> register(String username, String password, String confirmedPassword);
}
```

在`/service/impl/user/account`中实现一个类`RegisterServiceImpl`，实现上面定义的接口。（写具体的业务逻辑）。其中返回的Map类，就是前端收到的`resp`。

```java
package com.example.backend.service.impl.user.account;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.backend.mapper.UserMapper;
import com.example.backend.pojo.User;
import com.example.backend.service.user.account.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RegisterServiceImpl implements RegisterService {
    @Autowired
    private UserMapper userMapper; //对数据库进行增删改查

    @Autowired
    private PasswordEncoder passwordEncoder; //加密明文

    @Override
    public Map<String, String> register(String username, String password, String confirmedPassword) {
        Map<String, String> map = new HashMap<>();
        if (username == null) {
            map.put("error_message", "用户名不能为空");
            return map;
        }
        if (password == null || confirmedPassword == null) {
            map.put("error_message", "密码不能为空");
            return map;
        }
        //删除首尾的空白字符
        username = username.trim();
        if (username.length() == 0) {
            map.put("error_message", "用户名不能为空");
            return map;
        }
        if (password.length() == 0 || confirmedPassword.length() == 0) {
            map.put("error_message", "密码不能为空");
            return map;
        }
        //限制在规定长度内
        if (username.length() > 100) {
            map.put("error_message", "用户名长度不能大于100");
            return map;
        }
        if (password.length() > 100 || confirmedPassword.length() > 100) {
            map.put("error_message", "密码长度不能大于100");
            return map;
        }
        //两次输入密码不一致
        if (!password.equals(confirmedPassword)) {
            map.put("error_message", "两次输入的密码不一致");
            return map;
        }
        //查询用户名是否重复
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        List<User> users = userMapper.selectList(queryWrapper);
        if (!users.isEmpty()) {
            map.put("error_message", "用户名已存在");
            return map;
        }


        //用户名密码无问题，则添加一个新用户
        String encodedPassword = passwordEncoder.encode(password);
        String photo = "https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202212072159086.webp";
        User user = new User(null, username, encodedPassword, photo);
        userMapper.insert(user);
        map.put("error_message", "success");
        return map;

    }
}
```

在`/controller/user/account`中实现`RegisterController`类，完成url到API的映射。

```java
package com.example.backend.controller.user.account;

import com.example.backend.service.user.account.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RegisterController {
    @Autowired
    private RegisterService registerService;

    @PostMapping("/user/account/register/")
    public Map<String, String> register(@RequestParam Map<String, String> map) {
        String username = map.get("username");
        String password = map.get("password");
        String confirmedPassword = map.get("confirmedPassword");
        return registerService.register(username, password, confirmedPassword);
    }

}
```

## 调试

显而易见，账号密码等信息不能以明文的形式存放在url中，所以不能通过输入url的方法进行调试了。只能通过前后端交互的方法。

在前端中输入以下代码用于测试。

```javascript
$.ajax({
      url: "http://127.0.0.1:3000/user/account/token/",
      type: "post",
      data: {
        username: '你的账号',
        password: '你的密码',
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp); 
      }
    });
    // 测试InfoService
    $.ajax({
      url: "http://127.0.0.1:3000/user/account/info/",
      type: "get",
      headers: {
        Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4MjliMjQzYjg4YmM0NjdjYmRkMDAwMmNiMzYwZDJiMyIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTY1OTU3ODUyMiwiZXhwIjoxNjYwNzg4MTIyfQ.s5nd3RgtDKkPBDDm4P87ET8biZk8H79VMII1p_O9OsA",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }
    });
    // 测试RegisterService
    $.ajax({
      url: "http://127.0.0.1:3000/user/account/register/",
      type: "post",
      data: {
        username: "你的账号",
        password: "你的密码",
        confirmedPassword: "你的密码",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }
    })
  }
```

通过前端框架的调试窗口打开网页，并打开浏览器的控制台。若能看到控制台输出了三个“success”，便说明后端代码编写成功。此外，也可以去数据库中看看。若是注册界面成功了，数据库应当会有新增的用户。

![测试成功](https://img-blog.csdnimg.cn/3f1eeac9f5a9472384f3a72decb45ff8.png#pic_center)

