---
title: Jquery常用
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
  - Jquery
  - jquery
highlight_shrink: false
top_img: https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
katex: true
abbrlink: d049909f
date: 2022-11-22 13:03:58
post_copyright:
copyright_author: adguy
copyright_author_href: https://adguycn990.github.io
copyright_url: https://adguycn990.github.io/adguy/d049909f.html
copyright_info: 此文章版权归金晖の博客所有，如有转载，请註明来自原作者
---


# jQuery常用

## 选择器

`$(selector)$`，例如：

```javascript
$('div');
$('.big-div');
$('div > p');
let $DIV = $(`div`);
```

用法和CSS选择器差不多

## 事件

`$(selector).on(event, func)`绑定事件

```javascript
$('div').on('click', function (e) {
    console.log("click div");
})
```

`$(selector).off(event, func)`删除事件

```javascript
$('div').on('click', function (e) {
    console.log("click div");

    $('div').off('click');
});
```

当存在多个相同类型的事件触发函数时，可以通过 `click.name` 来区分，例如

```javascript
$('div').on('click.first', function (e) {
    console.log("click div");

    $('div').off('click.first');
});
```

在事件触发的函数中的 `return false` 等价于同时执行：

- `e.stopPropagation()`：阻止事件向上传递
- `e.preventDefault()`：阻止事件的默认行为

## 元素的隐藏和展现

- `$A.hide()`：隐藏，可以添加参数，表示消失时间
- `$A.show()`：展现，可以添加参数，表示出现时间
- `$A.fadeOut()`：慢慢消失，可以添加参数，表示消失时间
- `$A.fadeIn()`：慢慢出现，可以添加参数，表示出现时间

## 元素的添加和删除

- `$('<div class="mydiv"><span>Hello World</span></div>')`：构造一个jQuery对象
- `$A.append($B)`：将B添加到A的末尾
- `$A.prepend($B)`：将B添加到A的开头
- `$A.remove()`：删除元素A
- `$A.empty()`：清空元素A的所有儿子

## 对类的操作

- `$A.addClass(class_name)`：添加某个类

- `$A.removeClass(class_name)`：删除某个类
- `$A.hasClass(class_name)`：判断某个类是否存在

## 对CSS的操作

- `$("div").css("background-color")`：获取某个CSS的属性
- `$("div").css("background-color","yellow")`：设置某个CSS的属性
- 同时设置多个CSS的属性：

```javascript
$('div').css({
    width: "200px",
    height: "200px",
    "background-color": "orange",
});
```

## 对标签属性的操作

- `$('div').attr('id')`：获取属性
- `$('div').attr('id', 'ID')`：设置属性

## 对HTML内容、文本的操作

- `$A.html()`：获取、修改HTML内容
- `$A.text()`：获取、修改文本信息
- `$A.val()`：获取、修改文本的值

## 查找

- `$(selector).parent(filter)`：查找父元素
- `$(selector).parents(filter)`：查找所有祖先元素
- `$(selector).children(filter)`：在所有子元素中查找
- `$(selector).find(filter)`：在所有后代元素中查找

## ajax

GET方法：

```javascript
$.ajax({
    url: url,
    type: "GET",
    data: {
    },
    dataType: "json",
    success: function (resp) {

    },
});
```

POST方法：

```javascript
$.ajax({
    url: url,
    type: "POST",
    data: {
    },
    dataType: "json",
    success: function (resp) {

    },
});
```



