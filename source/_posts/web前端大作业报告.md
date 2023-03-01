---
title: web前端大作业报告
tags:
  - 工程
  - web前端
  - 大学作业
  - vue3
categories:
  - - 大学作业
  - - 工程
    - web前端
keywords:
  - 工程
  - web前端
  - 大学作业
  - vue3
  - html5
  - css
  - javascript
  - bootstrap
top_img: >-
  https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
highlight_shrink: false
katex: false
copyright_author: adguy
copyright_author_href: 'https://adguy.top'
copyright_url: 'https://adguy.top/adguy/cb9c59d6.html'
copyright_info: 此文章版权归金晖のBlog所有，如有转载，请注明来自原作者
abbrlink: cb9c59d6
date: 2022-11-25 10:14:33
description:
post_copyright:
---



## 准备工作

### 环境配置

1. 安装git，用于维护工程代码，方便回滚
2. 安装nodejs，这是vue必备的开发环境
3. 安装@vue/cli脚手架，输入以下命令`npm i -g @vue/cli`
4. 启动vue自带的图形化项目管理界面，输入以下命令`vue ui`

### 关于vue脚手架

![](https://cdn.acwing.com/media/article/image/2022/08/08/109718_732fc8c416-QQ%E6%88%AA%E5%9B%BE20220808105422.png)

- 页面上方有一个 vue 项目管理器，在那里进行创建，创建可以指定路径，如：打算在 E 盘 vue 文件夹创建，输入：`E:\vue\`。

- 预设选择vue3

- 对于插件，router 插件与 vuex 插件 (实现多个组件之间维护同一组数据，类似于 redux)，两个都有安装按钮

- 对于依赖，安装bootstrap，用于方便的使用css代码。（也可以了解下element-plus这段插件）

### vue框架的结构

- views: 写各种页面

- router: 初始状态下有两个路由，/,about

- components: 存储组件

- main.js 入口，整个组件挂载到 app 元素上

注：后端渲染与前端渲染
后端渲染：每打开一个页面，服务器发送请求并且返回回来
前端渲染；只有在第一次打开（无论是什么页面），服务器将所有元素返回，同时打包在 js 文件中，当打开第二个或第三个等页面后，用返回的 js 文件直接将新页面渲染出来

### vue的基本概念

1. vue 的文件组成部分 html js css

2. vue的特点

   - 将所有东西全部放在一起，同一个页面会包含所有东西
     css 可以加 scope 特性：添加此特性，每个选择器在返回给前端的时候会有一个随机值，每个组件的随机值是不一样的，这样不同组件之间的 css 选择器就不会影响到
   - 组件化框架。一个页面可能会有不同的部分，每一个部分都可以用一个单独的组件来实现。引入方式就像使用正常的html标签一样，比如封装了`navbar`组件，使用方法就是`<navbar> </navbar>`

## 项目概述

整个页面及组件结构如下图所示：

![](https://cdn.acwing.com/media/article/image/2022/08/08/109718_1f0a2ed417-QQ%E5%9B%BE%E7%89%8720220808215047.jpg)

<img src="https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211251013377.webp" alt="image-20221125082601910" style="zoom:25%;" />

### 导航栏编写

与 react 一样，通过引入 bootstrap，在 bootstrap 中找合适的导航栏样式并配置即可
但使用时需要安装依赖:@popperjs/core

由于每一个页面都有一个导航栏，因此需要引入到根组件中导出。

```vue
export default {
    name:"App",
    components:{
      NavBar,
    }
}
```

在根文件中导入

```vue
export default{
    name:"App"
    component:{
        NavBar,
    }
}
```

## 创建六个初始页面

对于页面，先暂时将页面内容用卡片括起来，以保持美观
整体定义在 ContentBase.vue 组件中，方便整体修改

1. 在某个组件引入另一个组件，如果组件之间有子元素，子元素如何获取？

- 方法：在被引入组件中通过 slot 属性，将所有子元素渲染进去。

### 创建路由

引入在 index.js 中，具体引入格式为（以引入用户列表页面为例)：

```vue
import UserListView from '../views/UserListView.vue'
{
    path: '/userList/',
    name: 'userlist',
    component: UserListView
},
```

对于任意不存在，输出的是 404，使用以下代码：

```vue
path:'/:catchAll(.*)',
redirect:'/404/',
```

### 导航栏点击切换页面

对于点击切换页面功能，如果按照最普通的 <a> 链接写法，每次点开都会刷新一下，向服务器请求数据，
此非前端渲染，在这里建议使用前端渲染，页面流量会大大降低

`<router-link class="nav-link" :to="{name:'userlist',params{}}">用户列表</router-link>`

## 实现用户动态页面

![](https://cdn.acwing.com/media/article/image/2022/08/09/109718_b6cec03417-QQ%E5%9B%BE%E7%89%8720220809110217.jpg)

一般一个正常的社交平台在发帖之后，帖子传到信息区，并且按照队列的顺序依次排列。为实现这种效果，定义几个 vue 文件:UserProfileInfo, UserProfilePosts, UserProfileWirte。

### 用户信息框

实现的最终效果如下图所示

![](https://cdn.acwing.com/media/article/image/2022/08/09/109718_3af718e517-QQ%E6%88%AA%E5%9B%BE20220809110607.png)

所运用的方法是简单的的 css。先将用户区与帖子列表区按照 3:9 的比例分开，可以用简化写法:

`div.row .(div.col-3+div.col-9)`

对于头像，需要圆形，且是自适应大小，可以用如下写法：

`img-fluid:图片自适应大小
border-radius:设为圆形`

### 数据交互

对于不同的用户而言，其头像、粉丝数、是否关注等等数据，不同的用户数据之间不一样，所以最好是定义成参数
存储参数的函数:setup()
一般来说，定义变量可以有两种方式：
ref: 当变量一般需要重新复制时用
reactive：ref 比 reactive 运行效率低一些，尽量还是用 reactive
定义变量名为 user，存储下当前静态用户的一些信息，由于镜头用户不会变，因此可以用 reactive
注：由于后续引入 ajax 的 api，因此以上的内容在后续改成动态页面后不会使用

如何在不同组件之间传信息（父 - 子）
类似于 react，但语法不同，下面是 react 的传递信息的基本原理

![](https://cdn.acwing.com/media/article/image/2022/08/09/109718_6737bb5017-QQ%E5%9B%BE%E7%89%8720220809121146.jpg)

vue 原理与之类似，只是说语法不同：比如，在 UserProfileView 中绑定属性

`<USerProfileInfo :user="user"/>`

想要在子组件 USerProfileInfo 接收到父组件传来的 user, 在 export 中定义 props 接收来的参数

```vue
props: {
    user: {
        type:Object, # Object记得大写
        required:true,
    },
},
```

注：绑定属性时，: 是 v-bind 的缩写
如何希望数值能够实现动态计算，使用 computed 属性(当调用 api 后，则就不再需要此属性)，具体用法为：

```vue
setup(props){
   last fullName=computed(()=>props.user.lastName+' '+props.user.firstName);
   return {
       fullName；
   }
}
```

#### 实现关注按钮

关注按钮的功能，即为当如果关注时，显示取消关注，当未关注时，显示关注
实现此效果需要用到 v-if 来做判断
具体代码为:

```vue
<button v-if="!user.is_followed" >+关注</button> # 显示+关注/未关注
<button  v-if="user.is_followed" >取消关注</button> # 取消关注
```

当关注状态修改之后需要更新状态，用 v-on:click 来绑定函数
可以简写为：`@click="follow"`
由于状态是传过来的，关注状态存储在父组件中，因此子组件不能够直接被修改。
需要子组件 - 父组件传递信息
触发父组件绑定函数`cotext.emit();`

#### 帖子列表

首先先按照上述的步骤做法设置好
当用 {{post.posts}} 取值时，发现出现传过来的都是对象，没有转化成一条条列表，如果需要转化成 content 需要用到循环，在 vue 中，循环的写法与普通的 for 循环写法一致，在 `UserProfilePosts` 中写

```vue
v-for
# 语句如下：
<div v-for "post in posts"></div>
```

通过以上语句的写法，可以让 post 里的任意 posts，都有对应的 div
注：在写循环时出现保存，加上:key=item 即可，以保证 key 是唯一的（vue 的内部属性）

#### 发帖模块

同样的，按照上述方法，涉设置基本样式并配置组件、引入等操作
vue 获取 textarea 中的内容
同样的，需要用到 setup() 变量，来获取 content 的值
用到属性 v-model: 让某个标签内容和 context 内容相绑定
然后通过触发函数，将内容生成帖子，由于帖子值存储在父组件中，因此需要子组件向父组件传递信息
最新的帖子排在最前面
用以下代码:

```vue
post.posts.unshift({
	id:
	UserId:
	content:
})
```

然后再用 context.emit() 触发父组件
整个实现的逻辑如下：

![](https://cdn.acwing.com/media/article/image/2022/08/09/109718_1a494fd617-QQ%E5%9B%BE%E7%89%8720220809180022.jpg)

## 登录

### 写在前面

动态获取用户名和密码，需要对两个变量 username 和 password 进行双向绑定，需要用到 v-model。同时，发出错误信息也需要响应式变量 (但不需要双向绑定)。
作为一个表单，需要手写一下提交操作：

```vue
const login =()=>{
console.log(username.value,password.value);
```

注意在访问变量值时，需要加.value
当提交在页面曾输出时，会闪过又刷新一下信息：原因在于表单只绑定了一个提交前的事件，执行完之后依旧要执行提交后的事件，阻止方式: `@submit.prevent`

### 实现

以上这些登录只是伪登录，前端页面的登录，实现真正的登录也就是和后端进行全局交互才可。由于很多页面都需要使用的用户信息，因此需要使用全局变量。
在上半部分，了解了父组件与子组件之间传递信息的方式，但是如果两个同级组件之间传递信息，一般方式如下图所示：
![](https://cdn.acwing.com/media/article/image/2022/08/09/109718_010002e117-QQ%E5%9B%BE%E7%89%8720220809194703.jpg)
vue 提供了一种机制 vuex
vuex 类似于 redux，维护一个 state，当两个组件想要交互，只需要向全局数据进行交互即可
由于登录信息在不同组件之间都需要你使用，因此将登录信息存在 vuex 中
vuex 位于 store文件夹的index.js文件中，其中有几项，在此介绍如下：
state: 存储所有数据
getter: 当向获取 state 里面内容时，且需要计算才能获取 (不能改)
action: 定义对 state 的各种操作
在 action 里面是不能直接对 state 进行修改的
mutations: 所有对 state 进行直接修改的操作一定要在 mutations 执行，但是在 vue 里，限制不能执行异步操作
modules: 为了对 state 进行分割，当 state 中内容过多，实现分割，方便阅读
若提取访问 user 的用户名，可用：`store.state.user.username`

#### JWT验证

传统的登录方式如下图所示：
![](https://cdn.acwing.com/media/article/image/2022/08/09/109718_6839e7d317-QQ%E5%9B%BE%E7%89%8720220809200417.jpg)
当 server 接收到请求，从请求取出 seeson_id 在数据库中查看是否存在，若存在，从数据库中查到对应用户。
如何判断登录:sesson_id，一般存在 cookie,js 不能访问到，当跨域访问时，很难维护登录状态。新的登录方式如下图:
![](https://cdn.acwing.com/media/article/image/2022/08/09/109718_cd78171f17-QQ%E5%9B%BE%E7%89%8720220809200705.jpg)
此为 JWT 方法，全名又称 JSON Web token
JWT 不会存在服务器中，但是可以验证，用户信息存在 JWT 里，里面有项内容为 userId。验证方法为：
![](https://cdn.acwing.com/media/article/image/2022/08/09/109718_37867ce117-QQ%E5%9B%BE%E7%89%8720220809200938.jpg)
在这对这张图做出一下解释：客户端传回来公钥，服务器在后面补上私钥，用同样的哈希函数去求下加密值是多少，求出来的与传回来的是否一样，如果一样，信息合法。这样保证了加密是安全的。

#### 验证的实现

使用 JWT 验证，有两个返回值：
refresh: 获取新令牌，post 方法在 http body，更加安全
access: 令牌 JWT，直接获取认证
在 user.js 写下登录的 action, 是一个 ajax
当外部要去调用文件中 action 的某个名字，需要用到 dispatch
获取用户名，以实现 JWT 验证
在 access 中获取 user_id, 解码出来，运用 jwt_decode 进行装包，导入包的方式如下: `import jwt_decode from 'jwt-decode'`
获取到用户名之后，需要将信息更新到 state 里面，action 不能直接更新，需要在 mutations 下更新，当 mutations 创建完，用 context.commit 调用，access 由于每 5min 过期，因此需要定期刷新。
成功后，跳转到首页（在 LoginView 中）LoginView 部分代码最终如下:

```vue
 const login =()=>{
      error_message.value="";
      //console.log(username.value,password.value);
      store.dispatch("login",{
        username:username.value,
        password:password.value,
        success(){
          //console.log("success");
          router.push({name:'userlist'});
        },error(){
          //console.log("failed");
          error_message.value="用户名或密码错误";
        }
      });
    };
```

登录之后，将自己的用户名放在左上角
需要实现一个效果，当点击用户名，进入个人页面，当点击退出，进入登录界面
状态栏的变化，需要用 v-if 做一下登录判断，如果是伪未登录，则为初始的状态栏，如果登陆了则为新的状态栏
改变部分如下：

```vue
<ul class="navbar-nav" v-if="!$store.state.user.is_login">
                <li class="nav-item">
                    <router-link class="nav-link" :to="{name: 'login'}">登录</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{name: 'register'}">注册</router-link>
                </li>
            </ul>

            <ul class="navbar-nav" v-else>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{name: 'userprofile', params: {userId: $store.state.user.id}}">
                        {{ $store.state.user.username }}
                    </router-link>
                </li>
                <li class="nav-item">
                    <a class="nav-link" style="cursor: pointer" @click="logout">退出</a>
                </li>    
            </ul>
```

#### 退出

删除 JWT 即可，在组件中直接调用 mutation 的 API, 引入 useStore,action 中设为 `dispatch’。

## 注册

类似于登录功能，调用 api，此 api 会返回如下信息：

```
success
用户名不能为空
两个密码不一致
用户名已存在
密码不存在
```

输入状态语句:

```
error_message=resp
或
error_message.value=""
```

将这几个语句放进 success 里的原因是，当向 api 发送请求成功，触发 success 属性，无论此账号是否已经注册，该代码只是来判断请求发送成功即触发.
进一步优化：成功之后直接登录
如同 login 逻辑，调用 store 的 dispatch 即可

```vue
username:username.value,
 	password:password.value,
 	success(){
 		//console.log("success");
 		router.push({name:'userlist'});
 	},error(){
 error_message.value="系统异常，请稍后重试";
```

## 云端API重构动态页面

通过 GET 方法获取 API，访问 JSON 信息，，用 REST Framework 与 JWT 验证进行后端验证
用 ajax 实现数据的获取，首先先装上 jquery，引入 $ 对象。输入以下命令：`npm i jQuery` 

### 用户列表

列表中每一项的设计都是如下的格式

![](https://cdn.acwing.com/media/article/image/2022/08/09/109718_51f113a917-QQ%E6%88%AA%E5%9B%BE20220809181617.png)

每一个用户都是一个卡片的形式

css代码：

```css
cursor:pointer;
box-shadow: 2px 2px 10px lightgrey; # 鼠标加上阴影
transition: 500ms;
```

点击一个用户之后，链接后面加上 ID：修改路由改成以下格式：

```vue
path: '/userprofile/:userId/',
name: 'userprofile',
component: UserProfileView
```

个人用户列表的个人判断，只有当登录之后，才能打开该页面。通过下面语句，来决定登录：`const userId =ParseInt(route.params.userId)`

无论是个人还是用户的页面，默认当个人用户登录才能点开，如果没有则直接跳转到登录页面。
在 UserListView 中写入参数 open_user_profile，对于登录与不登录的两种情况，进行分别的判断与跳转
注：由于 vue 在后台可以直接判断逻辑，对函数进行封装，来分辨是定义还是函数，因此函数传参数，直接加括号即可：`open_user_profile(user,id)`

### 云端拉取信息

在前面写静态页面时，当前页面是写死的，因此目前无论如何点击任何用户都只会显示自己，现在要显示全部的用户的全部的页面信息，需要从云端拉下来，拉取得信息包括：用户信息 , 历史帖子
在 UserPorfileView 的文件中，用 ajax 获取 api

```vue
user.id=resp.id;
user.username=resp.username;
user.photo=resp.photo;
user.followerCount=resp.followerCount;
user.is_followed=resp.is_followed;//指的是当前登录的用户是否关注当前正在看的用户
```

获取每个用户发过的文章：

```vue
posts.count=resp.length;
posts.posts=resp;
```

### 发布帖子

一定是只有自己的页面才可以添加，需要判断登录页面与当前页面是否是自己。

```vue
const is_me=computed(()=>userId===store.state.user.id)
<UserProfileWrite v-if="is_me" @post_a_post="post_a_post"/>
```

用 v-if 判断即可，记得注意数据类型，应强制转换成 int。

#### 添加操作

引入一个 api，加 headers 进行验证
更新有两种操作：
在后端返回结果之后，再在前端更新，也可以直接在前端更新
后者可以让用户操作更加流畅，但是如果提交有 bug, 可能会有数据不一致发生

#### 删除帖子

众所周知，删除不是所有时候都能删除，比如删除别人的内容，也就是说，删除和修改只有在自己页面才可以操作。修改在 UserProfilePosts 中，加上辅助计算属性 is_me, 同时，判断是不是自己，需要找到当前用户是谁。

删除事件由于存在父组件，因此在父组件操作函数，即 UserProfileViews。主要是根据 post_id，将某个 post 进行删除。判断当`posts.id!=post_id`时，此时应该保留子组件再通过 context.emit 函数引入。

调用api，通过ajax进行后端操作：

```vue
if (resp.result==="success") {                   context.emit('delete_a_post',post_id);
}  
```

#### 关注功能

服务器的 api 并没有区分取消关注还是添加关注，而是一个变换，双向的变换：
关注→取消
取消→关注
同样的也是调用 api，用 authorication 进行授权，授权完成后，前端页面渲染关注操作，展示关注成功的渲染代码

```vue
success(resp){
	if(resp.result==="success"){
        //授权成功之后则在前端渲染
      	context.emit("follow");
	}
}
```

取消关注与之同理。

## 剩下页面

剩下的所有页面就是单纯的网页设计，没有任何理解上的逻辑难度，也几乎没有调用vue的任何特性。于是乎只是简单地给出页面设计图。

### 首页

![image-20221125092428854](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211251012220.webp)

### 个人信息

![image-20221125092643717](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211251012571.webp)

### 兴趣爱好

![image-20221125092849037](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211251012911.webp)

### 获奖和项目

布局和兴趣爱好一样，不再赘述，只是css文件设置的不同。兴趣爱好设置为扁而宽的，而这个页面的盒子是正常的弹性盒子。

### 家乡景点

![image-20221125093243203](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211251013121.webp)

### 家乡美食

![image-20221125093604584](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211251013488.webp)

## 结语

至此，web前端开发课程大作业介绍结束。

通过本次大作业，我学习到了用html5, css, javascript, bootstrap库, jquery库以及vue3框架等知识以及这些知识的使用，收获颇丰。

{% note simple %}[参考文章1](https://www.acwing.com/blog/content/20724/){% endnote %}

{% note simple %}[参考文章2](https://www.acwing.com/solution/content/130898/){% endnote %}
