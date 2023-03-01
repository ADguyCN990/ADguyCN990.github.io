---
title: JS常用语法
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
abbrlink: 8a708213
date: 2022-11-22 13:02:24
post_copyright:
copyright_author: adguy
copyright_author_href: https://adguycn990.github.io
copyright_url: https://adguycn990.github.io/adguy/8a708213.html
copyright_info: 此文章版权归金晖の博客所有，如有转载，请註明来自原作者
---

# JavaScript常用语法

### JS的调用方式

1. 直接在`<script type="module"></script>`标签内些JS代码
2. 引入文件`<script type="module" src="/static/js/index.js"></script>`
3. 将所需的代码通过`import`关键字引入到当前作用域

示例:

```javascript
let name = "acwing";

function print() {
    console.log("Hello World!");
}

export {
    name,
    print
}
```

```html
<script type="module">
    import { name, print } from "/static/js/index.js";

    console.log(name);
    print();
</script>
```

### 变量类型

- let 用来定义变量
- const用来定义常量

类似于Python，js中的变量类型可以动态变化

### 循环语句

```javascript
for (let i = 0; i < 10; i++) {
    console.log(i);
}
```

- `for-in`循环，可以枚举数组中的下标，以及对象中的key

```javascript
let a = [1, 2, 3, 4, 5];
for (let i in a) {
    console.log(a[i]);
}
```

- `for-of`循环，可以枚举数组中的值，以及对象中的value

```javascript
let a = [1, 2, 3, 4, 5];
for (let i of a) {
    console.log(a);
}
```

### 对象

英文名称：Object。类似于C++中的`map`，由`key:value`对构成。

示例：

```javascript
let person = {
    name: "yxc",
    age: 18,
    money: 0,
    add_money: function (x) {
        this.money += x;
    }
}
```

调用方式：

- person.name
- person.add_money()
- person["name"]
- person\["add_money"]()

### 数组

数组中的元素可以是变量、数组、对象、函数

```javascript
let a = [1, 2, "a", "yxc"];

let b = [
    1,  // 变量
    "yxc",  // 变量
    ['a', 'b', 3],  // 数组
    function () {  // 函数
        console.log("Hello World");
    },
    { name: "jinhui", age: 20 }  // 对象
];
```

通过下标访问数组中的元素

数组的常用属性和函数：

- length:返回数组长度
- push():向数组末尾添加元素
- pop():删除数组末尾的元素
- splice(a, b):删除从`a`开始的`b`个元素

```javascript
let  a = [1,2,5,4,2];
a.sort(function (a,b) {return b - a;}); // 从大到小排序
a.sort(function (a,b) {return a - b;}); // 从小到大排序
console.log(a);
```

### 函数

定义方式：

```javascript
function add(a, b) {
    return a + b;
}

let add = function (a, b) {
    return a + b;
}

let add = (a, b) => {
    return a + b;
}
```

如果未定义返回值，则返回`undefined`

### 类

定义：

```javascript
class Point {
    constructor(x, y) {  // 构造函数
        this.x = x;  // 成员变量
        this.y = y;

        this.init();
    }

    init() {
        this.sum = this.x + this.y;  // 成员变量可以在任意的成员函数中定义
    }

    toString() {  // 成员函数
        return '(' + this.x + ', ' + this.y + ')';
    }
}

let p = new Point(3, 4);
console.log(p.toString());
```

继承：

```javascript
class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y); // 这里的super表示父类的构造函数
        this.color = color;
    }

    toString() {
        return this.color + ' ' + super.toString(); // 调用父类的toString();
    }
}
```

- super作为函数调用时，代表父类的构造函数，且只能用在子类的构造函数中
- super作为对象时，指向父类的原型对象
- 在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字
- 成员重名是，子类的成员会覆盖父类的成员。类似于多态。

静态方法：

在成员函数添加`static`关键字即可。静态方法不会被类的实例继承，只能通过类来调用。

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }

    static print_class_name() {
        console.log("Point");
    }
}

let p = new Point(1, 2);
Point.print_class_name();
p.print_class_name();  // 会报错
```

静态变量：在一个实例被创建时，该变量不会被初始化。换句话说就是，静态变量相当于一个对象产生的所有实例中的一个**全局变量**

### 事件

JS的代码一般通过事件触发。

可以通过`addEventListener`函数为元素绑定事件的触发函数。

鼠标：

- click: 左键点击
- dblclick: 左键双击
- contextmenu: 右键点击
- mousedown: 鼠标按下
  - event.button: 0左键，1中键，2右键
- mouseup: 鼠标弹起
  - event.button: 0左键，1中键，2右键

键盘：

- keydown: 某个键是否被按住，事件会连续触发
  - event.key: 返回按的是哪个键
  - event.altKey,event.ctrlKey,event.shiftKey: 是否同时按下了alt,ctrl,shift键
- keyup: 某个按键是否被释放
  - event常用属性同上
- keypress: 紧跟在`keydown`事件后触发，只有按下字符键触发。适用于判定用户输入的字符
  - event常用属性同上

表单：

- focus: 聚焦某个元素
- blur: 取消聚焦某个元素
- change: 某个元素的内容发生了改变

窗口：

- resize: 当窗口大小发生变化
- scroll: 滚动指定的元素
- load: 当元素被加载完成



