---
title: static用法
abbrlink: c59009c7
date: 2022-12-01 17:28:18
tags: [大学作业, C++]
categories: [大学作业, C++] 
keywords: [C++]
top_img: https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
highlight_shrink: false # 代码框是否展开, false表示展开
katex: false
description: 
post_copyright:
copyright_author: adguy的某个队友
copyright_author_href: https://adguy.top
copyright_url: https://adguy.top/adguy/c59009c7.html
copyright_info: 此文章版权归金晖のBlog所有，如有转载，请注明来自原作者
---

{% tip %}非常感激我队友大爹给我的复习资料{% endtip %}

## 静态局部变量

在局部变量前, 加上关键字static，该变量就被定义成一个静态局部变量。

通常，在函数体内定义了一个变量，每当程序运行到该语句时都会给该局部变量分配栈内存, 但随着程序退出函数体,系统就会收回栈内存, 局部变量也相应失效，但有时我们需要在两次调用之间对变量的值进行保存。通常的想法是定义一个全局变量来实现。但这样一来，变量已经不再属于函数本身了，不再仅受函数的控制，给程序维护带来不便。

静态局部变量正好可以解决这个问题。静态局部变量保存在全局数据区，而不是保存在栈中，每次的值保持到下一次调用直到下次重新赋值。

```cpp
void fn(){
    static int n = 10;
    cout << n << endl;
    n++;
}

fn();
fn();
fn();
/*
========
输出结果:
10
11
12
========
*/
```

### 特点

静态局部变量具有以下特点：

- 该变量在全局数据区分配内存
- 静态局部变量在程序执行到该对象的声明处时被首次初始化, 即以后的函数调用不再进行初始化
- 静态局部变量一般在声明处初始化, 如果没有显式初始化，会被程序自动初始化为0
- 它始终驻留在全局数据区, 直到程序运行结束, 但其作用域为局部作用域, 当定义它的函数或语句块结束时,其作用域随之结束

## 静态成员变量

static修饰类的成员变量，也叫静态成员变量。静态成员变量具有以下特点：

- 静态成员变量是先于类的对象而存在
- 这个类的所有对象共用一个静态成员
- 如果静态成员是public, 那么可以直接通过类名调用
- 静态成员数据在声明的时候类外初始化

定义如下类

```cpp
class Data{
    private:
        int d;
    public:
        static int num;   // 静态数据在声明的时候类外初始化
        Data(){}
        ~Data(){}
        void showD(){
            cout << this->d << ": " << num << endl;
        }
        // 先于类的对象而存在
        static void showNum(){
            // 这个方法调用的时候不包含this指针
            cout << " " << num << endl;
        }
};
```

### 静态成员变量类外初始化

```cpp
//int Data::num; 静态成员初始化, 不然会报错
int Data::num = 0;
```

### 静态成员变量先于类的对象而存在

```cpp
Data::showNum();  // 通过类名直接调用。此时还未创建类的对象，不是通过具体对象调用
//输出0
```

### 通过类名直接调用静态成员变量

```cpp
Data::num = 100;  // 通过类名直接调用
Data dt;
dt.showD(); //输出100
```

## 静态成员方法

static修饰类的成员函数，也叫做静态成员函数（方法）。静态成员方法有以下特点：

- 静态成员函数是先于类的对象而存在
- 可用类名直接调用(公有)
- 在静态成员函数中没有this指针, 所以不能使用非静态成员

### 静态成员方法没有this指针

在下面这个静态成员方法中，如果使用了非静态成员变量，程序就会报错。

```cpp
static void showNum(){
    // 这个方法调用的时候不包含this指针
    cout << " " << num << endl;
    //cout << " " << d << endl; 这句话就会报错
}
```

### 调用

通过类名调用：`Data::showNum();`

通过对象调用：`Data td; td.showNum();`

以上两种方式都可以。

### 先于对象而存在

```cpp
Data::showNum(); //先于对象
Data::num = 100; //先于对象
Data dt;
```

## 源码

```cpp
#include <iostream>
using namespace std;

void fn(){
    static int n = 10;
    cout << n << endl;
    n++;
}

class Data{
    private:
        int d;
    public:
        static int num;   // 静态数据在声明的时候类外初始化
        Data(){}
        ~Data(){}
        void showD(){
            cout << this->d << ": " << num << endl;
        }
        // 先于类的对象而存在
        static void showNum(){
            // 这个方法调用的时候不包含this指针
            cout << " " << num << endl;
            //cout << " " << d << endl; 这句话就会报错
        }
};

//int Data::num; 静态成员初始化, 不然会报错
int Data::num = 0;

int main(void){
    // test 静态局部变量n
    fn();
    fn();
    fn();

    // test 类的静态成员变量
    Data::showNum();  // 通过类名直接调用
    Data::num = 100;  // 通过类名直接调用
    Data dt;
    dt.showD();
    dt.showNum();     // 通过对象调用
    cout << "A little Tired QAQ " << endl;
    return 0;
}
```

