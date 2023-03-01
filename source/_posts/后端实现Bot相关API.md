---
title: 后端实现Bot相关API
abbrlink: 65f016f3
date: 2022-12-23 18:56:11
tags: [Springboot]
categories: [工程, Springboot, kob] 
keywords: [Springboot]
top_img: https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
highlight_shrink: false # 代码框是否展开, false表示展开
katex: false
description: 
post_copyright:
copyright_author: adguy
copyright_author_href: https://adguy.top
copyright_url: https://adguy.top/adguy/65f016f3.html
copyright_info: 此文章版权归金晖のBlog所有，如有转载，请注明来自原作者
---

## 思维导图

![在这里插入图片描述](https://img-blog.csdnimg.cn/b7f863e7df34486faf4cdd75eac5a6bb.png#pic_center)

## 写在前面

这块是要实现，在项目中添加一个类Bot。和之前添加user的过程几乎一模一样，所以会写得非常精简。在[这篇文章](https://www.adguy.top/adguy/31e76a34.html)非常详细地介绍了Springboot关于后端数据处理的部分。

## 新建表bot

在数据库中新建表`bot`。

表中包含的列有：

- `id: int`：非空、自动增加、唯一、主键
- `user_id: int`：非空，用于存放创建该bot的用户。
  注意：在 pojo 中需要定义成 userId，在 queryWrapper 中的名称仍然为 user_id
- `title: varchar(100)`：用于存放bot名称。
- `description: varchar(300)`：用于存放bot的描述。
- `content：varchar(10000)`：用于存放bot的执行代码。
- `rating: int`：默认值为 1500：用于存放该bot的天梯分。
- `createtime: datetime`：用于存放该bot的创建时间
- `modifytime: datetime`：用于存放该bot的最近修改时间

## 实现pojo层

在`pojo`包下新建一个类`Bot`，用于映射bot的数据表

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bot {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId; //pojo里要用驼峰命名法和数据库的下划线对应
    private String title;
    private String description;
    private String content;
    private Integer rating;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createtime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date modifytime;
}
```

## 实现mapper层

在`mapper`包下新建一个接口继承自`BaseMapper`，用于映射Java方法和SQL语言。

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {

}
```

## 实现Add的API

在`service/user/bot/`下新建`AddService`接口

```java
public interface AddService { //添加一个Bot
    public Map<String, String> add(Map<String, String> data);
}
```

在`service/impl/user/bot/`下新建`AddServiceImpl`实现上面定义的接口

```java
package com.example.backend.service.impl.user.bot;

import com.example.backend.mapper.BotMapper;
import com.example.backend.pojo.Bot;
import com.example.backend.pojo.User;
import com.example.backend.service.impl.utils.UserDetailsImpl;
import com.example.backend.service.user.bot.AddService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AddServiceImpl implements AddService {
    @Autowired
    private BotMapper botMapper;

    @Override
    public Map<String, String> add(Map<String, String> data) {
        Map<String, String> map = new HashMap<>();
        String title = data.get("title");
        String description = data.get("description");
        String content = data.get("content");

        //一些非法情况
        if (title == null || title.length() == 0) {
            map.put("error_message", "Bot名称不能为空");
            return map;
        }
        if (title.length() > 100) {
            map.put("error_message", "Bot名称不能超过100个字符");
            return map;
        }
        if (description == null || description.length() == 0) {
            description = "这个用户很懒，什么也没有留下~";
        }
        if (description.length() > 300) {
            map.put("error_message", "Bot简介不能超过300个字符");
            return map;
        }
        if (content == null || content.length() == 0) {
            map.put("error_message", "Bot代码不能为空");
            return map;
        }
        if (content.length() > 10000) {
            map.put("error_message", "Bot代码不能超过10k个字符");
            return map;
        }

        //格式合法，该Bot加入到数据库中
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();
        Date now = new Date();
        Bot bot = new Bot(null, user.getId(), title, description, content, 1500, now, now);
        botMapper.insert(bot);
        map.put("error_message", "ADD BOT success");
        return map;
    }
}
```

在`controller/user/bot`下新建`AddController`类，用于实现url和API的交互

```java
package com.example.backend.controller.user.bot;

import com.example.backend.service.user.bot.AddService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AddController {
    @Autowired
    AddService addService;

    @PostMapping("/user/bot/add/")
    public Map<String, String> add(@RequestParam Map<String, String> data) {
        return addService.add(data);
    }
}

```

## 实现Remove的API

在`service/user/bot/`下新建一个接口`RemoveService`

```java
package com.example.backend.service.user.bot;

import java.util.Map;

public interface RemoveService {
    public Map<String, String> remove(Map<String, String> data);
}
```

在`service/impl/user/bot/`下新建一个`RemoveServiceImpl`类，实现上面定义的接口

```java
package com.example.backend.service.impl.user.bot;

import com.example.backend.mapper.BotMapper;
import com.example.backend.pojo.Bot;
import com.example.backend.pojo.User;
import com.example.backend.service.impl.utils.UserDetailsImpl;
import com.example.backend.service.user.bot.RemoveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RemoveServiceImpl implements RemoveService {

    @Autowired
    private BotMapper botMapper;
    @Override
    public Map<String, String> remove(Map<String, String> data) {
        Map<String, String> map = new HashMap<>();

        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        int bot_id = Integer.parseInt(data.get("bot_id"));
        Bot bot = botMapper.selectById(bot_id);
        //一些非法情况
        if (bot == null) {
            map.put("error_message", "Bot不存在或已被删除");
            return map;
        }
        if (!bot.getUserId().equals(user.getId())) {
            map.put("error_message", "没有权限删除该Bot");
            return map;
        }

        //若操作合法，则从数据库中删除该Bot
        botMapper.deleteById(bot_id);
        map.put("error_message", "delete success");

        return map;
    }
}
```

在`controller/user/bot/`下新建一个`RemoveController`类，用于实现url和API的交互

```java
package com.example.backend.controller.user.bot;

import com.example.backend.service.user.bot.RemoveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RemoveController {

    @Autowired
    RemoveService removeService;

    @PostMapping("/user/bot/remove/")
    public Map<String, String> remove(@RequestParam Map<String, String> data) {
        return removeService.remove(data);
    }
}
```

## 实现update的API

在`service/user/bot/`下新建一个接口`UpdateService`

```java
package com.example.backend.service.user.bot;

import java.util.Map;

public interface RemoveService {
    public Map<String, String> remove(Map<String, String> data);
}

```

在`service/impl/user/bot/`下新建一个`UpdateServiceImpl`类，实现上面定义的接口

```java
package com.example.backend.service.impl.user.bot;

import com.example.backend.mapper.BotMapper;
import com.example.backend.pojo.Bot;
import com.example.backend.pojo.User;
import com.example.backend.service.impl.utils.UserDetailsImpl;
import com.example.backend.service.user.bot.RemoveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RemoveServiceImpl implements RemoveService {

    @Autowired
    private BotMapper botMapper;
    @Override
    public Map<String, String> remove(Map<String, String> data) {
        Map<String, String> map = new HashMap<>();

        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        int bot_id = Integer.parseInt(data.get("bot_id"));
        Bot bot = botMapper.selectById(bot_id);
        //一些非法情况
        if (bot == null) {
            map.put("error_message", "Bot不存在或已被删除");
            return map;
        }
        if (!bot.getUserId().equals(user.getId())) {
            map.put("error_message", "没有权限删除该Bot");
            return map;
        }

        //若操作合法，则从数据库中删除该Bot
        botMapper.deleteById(bot_id);
        map.put("error_message", "delete success");

        return map;
    }
}

```

在`controller/user/bot/`下新建一个`UpdateController`类，用于实现url和API的交互

```java
package com.example.backend.controller.user.bot;

import com.example.backend.service.user.bot.RemoveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RemoveController {

    @Autowired
    RemoveService removeService;

    @PostMapping("/user/bot/remove/")
    public Map<String, String> remove(@RequestParam Map<String, String> data) {
        return removeService.remove(data);
    }
}
```

## 实现getlist的API

在`service/user/bot/`下新建一个接口`RemoveService`

```java
package com.example.backend.service.user.bot;

import java.util.Map;

public interface UpdateService {
    public Map<String, String> update(Map<String, String> data);
}

```

在`service/impl/user/bot/`下新建一个`RemoveServiceImpl`类，实现上面定义的接口

```java
package com.example.backend.service.impl.user.bot;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.backend.mapper.BotMapper;
import com.example.backend.pojo.Bot;
import com.example.backend.pojo.User;
import com.example.backend.service.impl.utils.UserDetailsImpl;
import com.example.backend.service.user.bot.GetListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetListServiceImpl implements GetListService {

    @Autowired
    private BotMapper botMapper;

    @Override
    public List<Bot> getList() {
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();
        QueryWrapper<Bot> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", user.getId());
        return botMapper.selectList(queryWrapper);
    }
}

```

在`controller/user/bot/`下新建一个`RemoveController`类，用于实现url和API的交互

```java
package com.example.backend.controller.user.bot;

import com.example.backend.pojo.Bot;
import com.example.backend.service.user.bot.GetListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GetListController {
    @Autowired
    private GetListService getListService;

    @GetMapping("/user/bot/getlist/")
    public List<Bot> getList() {
        return getListService.getList();
    }
}

```

## 调试代码

在前端界面写入以下js代码：

```javascript
const jwt_token = localStorage.getItem("jwt_token");
    $.ajax({
      url: "http://127.0.0.1:3000/user/bot/add/",
      type: "post",
      data: {
        title: "bot的名称",
        description: "bot的描述",
        content: "bot的内容",
      },
      headers: {
        Authorization: "Bearer " + jwt_token,
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }

    })

    const jwt_token = localStorage.getItem("jwt_token");
    console.log(jwt_token);
    $.ajax({
      url: "http://127.0.0.1:3000/user/bot/remove/",
      type: "post",
      data: {
        bot_id: 23,
      },
      headers: {
        Authorization: "Bearer " + jwt_token,
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }

    })

    const jwt_token = localStorage.getItem("jwt_token");
    $.ajax({
      url: "http://127.0.0.1:3000/user/bot/update/",
      type: "post",
      data: {
        bot_id: 100,
        title: "不告诉你",
        description: "不告诉你",
        content: "不告诉你",
      },
      headers: {
        Authorization: "Bearer " + jwt_token,
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }

    })

    const jwt_token = localStorage.getItem("jwt_token");
    $.ajax({
      url: "http://127.0.0.1:3000/user/bot/getlist/",
      type: "get",
      headers: {
        Authorization: "Bearer " + jwt_token,
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }

    })
```

关于jwt_token。我本来想用`vue3`里面的store来获取，但不知道为什么，根据调试的结果来看，界面一刷新，`store`里面的`token`就被清空掉了！如果此时再想用store的话，就会报跨域的错，改了半天也不知道怎么改。于是就是用了`LocalStorage`的方法。

