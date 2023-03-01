---
title: datalab
tags:
  - csapp
  - datalab
categories:
  - csapp
keywords:
  - csapp
  - datalab
highlight_shrink: false
top_img: https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
katex: true
copyright_author: adguy
copyright_author_href: 'https://adguycn990.github.io'
copyright_url: 'https://adguycn990.github.io/adguy/3062d5c8.html'
copyright_info: 此文章版权归金晖の博客所有，如有转载，请註明来自原作者
abbrlink: 3062d5c8
date: 2022-11-22 18:18:10
post_copyright:
---

CSAPP著名实验：DATALAB

内容是关于计算机信息的表示，主要是位操作、整数题和浮点数相关的题。

## 实验满分截图

![image-20221101154551716](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/typora-img/202211011545964.png)

## bitXor

只用~和&运算符实现异或操作。

```cpp
int bitXor(int x, int y) {
    return ~(~(x & ~y) & ~(~x & y));
}
```

## tmin

返回INT_MIN

```cpp
int tmin(void) {
    return 1 << 31;
}
```

## isTmax

不使用移位运算符，计算是否是补码最大值。

```cpp
int isTmax(int x) {
    int i = x + 1; //0x10000000
    int j = i + x; //0x11111111
    i = !i; //0x7fffffff = 0,0xFFFFFFFF = 1 
    return !(~j) & !(i);
}
```

思路是假设当前x为Tmax，然后将其往`0x0`转化。但是需要注意，对于-1此时值也为0.`0xFFFFFFFF` $\rightarrow$ `0x0` $\rightarrow$ ~`0xFFFFFFFF` 。此时 i = 0，可以利用这个特性把-1给特判掉。

## addOddBits

判断所有奇数位是否都为1。

```cpp
int allOddBits(int x) {
    //0xAAAAAAAA is the answer
    int a = 0xA;
    int b = (a << 4) + a;
    int c = (b << 8) + b;
    int d = (c << 16) + c;
    int e = x & d;
    return !(e ^ d);
}
```

利用掩码。构造方式是把奇数位设成全1，偶数位设成全0。首先将掩码与x进行与运算，得到y。此时y再与掩码进行异或运算，当且仅当异或结果为0时，才返回true。

## negate

给出x，求出-x的补码

```cpp
int negate(int x) {
    return ~x + 1;
}
```

属于常识了。

## isAsciiDigit

计算输入值是否是数字 0-9 的 `ASCII` 值。

```cpp
int isAsciiDigit(int x) {
    int a = !((x + (~0x30) + 1) >> 31 & 1);
    int b = !((0x39 + (~x) + 1) >> 31 & 1);
    return a & b;
}
```

非常神奇的思想。将 $0x30 \leq x \leq 0x39$ 转化为 $x - 0x30 \geq 0, 0x39-x \geq 0$ ，减法运算可以通过加上负数的补码实现，大于等于0可以通过判断符号位来实现

## conditional

使用位级运算实现C语言中的 `x?y:z`三目运算符。

```cpp
int conditional(int x, int y, int z) {
    int pos_flag = !!x;
    int neg_flag = !x;
    int pos_bias = ~pos_flag + 1; //if (x != 0) bias = 0x11111111 else bias = 0x00000000
    int neg_bias = ~neg_flag + 1; //if (x == 0) bias = 0x11111111 else bias = 0x00000000
    return (pos_bias & y) | (neg_bias & z);
}
```

应该从答案倒推，首先要想到答案应当是一个或的形式，即`答案1|0`或者`0|答案2`。这是要再想到掩码，`0xFFFFFFFF`和`0x0`这两个掩码能够满足本题的需求。正好，`0xFFFFFFFF`等于-1，也就是1的负数。那么此时情况就很明朗了。

- 如果条件为true，那么答案1应该与-1进行与运算，答案2应该与0进行与运算
- 如果条件为false，那么答案1应该与0进行与运算，答案2应该与-1进行运算

本题十分重要，后面许多程序都依赖于该函数。

## isLessOrEqual

通过位运算实现比较两个数的大小。

```cpp
int isLessOrEqual(int x, int y) {
    // if(one pos one neg)
    int x_pos = x >> 31 & 1;
    int y_pos = y >> 31 & 1;
    int pos_flag = x_pos ^ y_pos;
    int neg_flag = !pos_flag;
    int pos_bias = ~pos_flag + 1;
    int neg_bias = ~neg_flag + 1;
    int ans1 = x_pos;
    int ans2 = !((y + (~x + 1)) >> 31 & 1);
    return (pos_bias & ans1) | (neg_bias & ans2);
}
```

与ASCII那道题不同，直接相减可能会有溢出的情况发生。再仔细想想，发现溢出的情况只有可能是符号不同。所以就先把符号不同特判掉就好了。刚刚写过的conditional函数活学活用。

## logicalNeg

判断一个数是否为0。

```cpp
int logicalNeg(int x) {
    int pos = x >> 31 & 1;
    int neg = (~x + 1) >> 31 & 1;
    return (~(pos | neg)) + 2;
}
```

在补码中，只有0和INT_MIN的取反加一后的结果为本身。但是0的符号位为0，INT_MIN的符号位为1。也就是说，只有0满足两个符号位的或运算结果为0。通过这个性质就可以写出答案。

## howManyBits

求值：一个数用补码表示最少需要几位？

```cpp
int howManyBits(int x) {
    int pos, neg, pos_bias, neg_bias, a, b_16, b_8, b_4, b_2, b_1, b_0;
    pos = x >> 31 & 1;
    neg = !pos;
    pos_bias = ~pos + 1;
    neg_bias = ~neg + 1;
    a = (pos_bias & (~x)) | (neg_bias & x);
    b_16 = (!!(a >> 16)) << 4;
    a = a >> b_16;
    b_8 = (!!(a >> 8)) << 3;
    a = a >> b_8;
    b_4 = (!!(a >> 4)) << 2;
    a = a >> b_4;
    b_2 = (!!(a >> 2)) << 1;
    a = a >> b_2;
    b_1 = (!!(a >> 1)) << 0;
    a = a >> b_1;
    b_0 = a;
    return 1 + b_16 + b_8 + b_4 + b_2 + b_1 + b_0;
}
```

这题我想了好久好久好久。。。

用类似树状数组的思想求解~~(不太认同这是二分)~~。

![image-20220717201103223](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/typora-img/202211011650220.png)

首先需要对负数进行处理，因为负数补码高位用1填充，我更倾向于用0填充。一是方便理解二是不用特判。然后无视开头的符号位0，最后算贡献的时候再把这一位加上。

先看高16位的结果是否为0：

是0？往更低位找。

不是0？至少需要低16位，算上低位的贡献。通过右移运算淘汰掉低位，在更高位上找答案。

#### 以12`0x0000000C`为例

第一次，右移16位，未找到。

第二次，右移8位，未找到。

第三次，右移4位，未找到。

第四次，右移2位，找到了。算上贡献2。`0x00...011`。

第五次，右移1位，找到了。算上贡献1。`0x00...01`。

第六次，右移0位，找到了。算上贡献1。

最后的答案就是2+1+1=5。

#### 以298`0x0000012A`为例

第一次，右移16位，未找到。

第二次，右移8位，找到了。算上贡献8，舍弃低位后变成`0x000001`

。。。

第六次，右移0位，找到了。算上贡献1.

最后的答案就是8+1+1=10。

## floatScale2

给一个浮点数，返回浮点数 $\times$ 2的值。

```cpp
unsigned floatScale2(unsigned uf) {
    unsigned int pos = uf & 0x80000000;
    unsigned int exp = uf >> 23 & 0xFF;
    unsigned int frac = uf & 0x007FFFFF;
    unsigned int INF = pos | 0x7F800000;

    if (exp == 0xFF) {
        if (frac == 0x00000000) { //wu qiong da
            return uf;
        }
        else { //nan
            return uf;
        }
    }
    else if (exp == 0x0) { //fei gui ge hua
        //(frac+exp)<<1
        return (uf << 1) | pos;
    }
    else { //gui ge hua
        //exp + 1
        if (exp == 0x000000FE) { //yi chu
            return INF;
        }
        else {
            exp++;
            return ((uf & 0x807FFFFF) | (exp << 23));
        }
    }
}
```

代码的分类讨论已经很清楚了。如果是无穷大或者nan，那么依然是无穷大和nan。如果是非规格化，就是小数部分左移一位，溢出没关系这说明规格化了。如果是规格化，就是阶码+1，此时特判溢出的情况。

## floatFloatToInt

将一个浮点数转化为整数。

首先特判0的情况，比较特殊。

如果阶码小于0，说明这个数字小于1，那么会被整形舍入，也返回0。

整形能表示的范围远小于浮点数，要根据阶码判断一下是否溢出。

最后就是根据尾数和阶码进行移位操作得到答案。由于阶码是无符号数，所以要根据浮点数的符号位决定返回正数还是负数。

```cpp
int floatFloat2Int(unsigned uf) {
    int INF = 0x80000000u;
    int pos = uf >> 31;
    int exp = (uf >> 23 & 0xFF) - 127; //IEEE754
    int frac = (uf & 0x007FFFFF) | 0x00800000; //1.xxxxx in IEEE754, so need to add 1.
    if (!(uf & 0x7FFFFFFF)) { //uf = 0
        return 0;
    }

    //[-2^31, 2^31 - 1]
    if (exp < 0) { //0.xxxxx sheru
        return 0;
    }

    if (exp > 31) {
        return INF; //out of range
    }

    // ti qu frac de zheng shu bu fen
    if (exp > 23) {
        frac = frac << (exp - 23);
    }
    else {
        frac = frac >> (23 - exp);
    }

    if (pos) {
        return (~frac) + 1; //frac is an unsigned number
    }
    else {
        return frac;
    }
}
```

## floatPower2

返回与 $2.0^x$ 等效的位级别。

```cpp
unsigned floatPower2(int x) {
    if (x < -149) { //jing du bu gou
        return 0;
    }
    else if (x >= -149 && x < -126) { //fei gui ge hua
        int bias = x + 149;
        return 0x1 << bias;
    }
    else if (x >= -126 && x < 128) { //gui ge hua
        int dx = x + 127;
        int exp = dx << 23;
        return exp;
    }
    return 0x7F800000; //infinity large
}
```

分四种情况分类讨论。

非规格化exp恒定为$1-(2^n-1)$，float为-126。frac共有23位。理论上非规格化单精度浮点数最多能表示$2^{-149}$的精度。

第一种情况，精度不够，直接返回0。

第二种情况，非规格化，看看这个数比-149大了多少。

第三种情况，规格化，逆推出阶码的大小后，右移23位即可。

第四种情况，溢出，返回无穷大。

## 总结

虽然实验过程很坎坷~~偷看了别人代码~~，但是所有代码都搞懂了，以后有机会再二刷吧。本次实验的基础收获当然是关于信息的位级表示相关的内容了，对一些位级运算符更加熟悉了一些。