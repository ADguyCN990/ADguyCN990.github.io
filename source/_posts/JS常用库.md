---
title: JS常用库
tags:
  - 工程
  - web前端
  - js
categories:
  - 工程
  - web前端
keywords:
  - 工程
  - web前端
  - js
  - javascript
highlight_shrink: false
top_img: https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
katex: true
abbrlink: 1476c83a
date: 2022-11-22 13:05:22
post_copyright:
copyright_author: adguy
copyright_author_href: https://adguycn990.github.io
copyright_url: https://adguycn990.github.io/adguy/1476c83a.html
copyright_info: 此文章版权归金晖の博客所有，如有转载，请註明来自原作者
---

# js常用库

## 计时器

### `setTimeout(func, delay)`

`delay`毫秒后，执行函数`func`

### `clearTimeout()`

关闭计时器，例如：

```javascript
let timeout_id = setTimeout(() => {
    console.log("Hello World!")
}, 2000);  // 2秒后在控制台输出"Hello World"

clearTimeout(timeout_id);  // 清除定时器
```

### `setInterval(func, delay)`

每隔`delay`毫秒，执行一次函数`func`

### `clearInterval()`

```javascript
let interval_id = setInterval(() => {
    console.log("Hello World!")
}, 2000);  // 每隔2秒，输出一次"Hello World"

clearInterval(interval_id);  // 清除周期执行的函数
```

### `requestAnimationFrame(func)`

该函数会在下次浏览器刷新页面之前执行一次，通常会用递归写法使其每秒执行 60 次 `func` 函数。调用时会传入一个参数，表示函数执行的时间戳，单位为毫秒。

```javascript
function print() {
        $div.append($(`<span>我爱白玫瑰</span>`));
        requestAnimationFrame(print());
    }

    $show.on('click', function(e) {
        requestAnimationFrame(print());

    })
```

这样每秒就会执行60次打印“我爱白玫瑰”。这个函数经常被用来做动画。

- requestAnimationFrame 渲染动画的效果更好，性能更加。
  该函数可以保证每两次调用之间的时间间隔相同，但 setTimeout 与 setInterval 不能保证这点。
- 当页面在后台时，因为页面不再渲染，因此 requestAnimationFrame 不再执行。但 setTimeout 与 setInterval 函数会继续执行。

## 数据结构类

### Map类

- 用`for...of`或者`forEach`可以按插入顺序遍历
- 键值可以为任意值

用法：

- `set(key, value)`：插入键值对，如果 key 已存在，则会覆盖原有的 value
- `get(key)`：查找关键字，如果不存在，返回 undefined
- `size`：返回键值对数量
- `has(key)`：返回是否包含关键字 key
- `delete(key)`：删除关键字 key
- `clear()`：删除所有元素

### Set类

Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。

- 用`for...of`或者`forEach`可以按插入顺序遍历

用法：

- `add()`：添加元素
- `has()`：返回是否包含某个元素
- `size`：返回元素数量
- `delete()`：删除某个元素
- `clear()`：删除所有元素

### localStorage

可以在用户的浏览器上存储键值对。这样数据在刷新的时候就不会消失。

- `setItem(key, value)`：插入
- `getItem(key)`：查找
- `removeItem(key)`：删除
- `clear()`：清空

## 杂项

### JSON

将对象(字典)和字符串互相转化的一种函数

- `JSON.parse()`：将字符串解析成对象
- `JSON.stringify()`：将对象转化成字符串

### 时间

返回值为整数的 API，数值为 1970-1-1 00:00:00 UTC（世界标准时间）到某个时刻所经过的毫秒数：

- `Date.now()`：返回现在时刻
- `Date.parse("2022-04-15T15:30:00.000+08:00")`：返回北京时间 2022 年 4 月 15 日 15:30:00 的时刻。

与Date对象的实例相关的API：

- `new Date()`：返回现在时刻
- `new Date("2022-04-15T15:30:00.000+08:00")`：返回北京时间 2022 年 4 月 15 日 15:30:00 的时刻
- 两个Date对象实例的差值为毫秒数
- `getDay()`：返回星期，0表示星期日
- `getDate()`：返回日，数值为1~31
- `getMonth()`：返回月，数值为0~11
- `getFullYear()`：返回年份
- `getHours()`：返回小时
- `getMinutes()`：返回分钟
- `getSeconds()`：返回秒
- `getMilliseconds()`：返回毫秒

### WebSocket

- `new WebSocket('ws://localhost:8080')` 建立ws连接
- `send()`：向服务器端发送一个字符串。一般用 JSON 将传入的对象序列化为字符串。
- `onopen`：类似于`onclick`，当连接建立时触发
- `onmessage`：当从服务器端接收到消息时触发
- `close()`：关闭连接
- `onclose`：当连接关闭后触发

### window

- `window.open("https://www.acwing.com")`：在新标签栏中打开界面
- `location.reload()`：刷新页面
- `location.href = "https://www.acwing.com"`：在当前标签栏中打开界面

### canvas

[canvas教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)