---
title: boomlab [1-5]
tags:
  - csapp
  - boomlab
  - 反汇编
categories:
  - csapp
keywords:
  - csapp
  - boomlab
  - 反汇编
highlight_shrink: false
top_img: https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
katex: false
copyright_author: adguy
copyright_author_href: 'https://adguycn990.github.io'
copyright_url: 'https://adguycn990.github.io/adguy/278f748a.html'
copyright_info: 此文章版权归金晖の博客所有，如有转载，请注明来自原作者
abbrlink: 278f748a
date: 2022-11-22 18:26:08
post_copyright:
---




## 第一题

开胃小菜，直接翻译成C代码吧。

```assembly
esi = *(0x402400);
eax = strings_not_equal(rdi, rsi);
if (eax)
	return;
else
	explode_bomb;
```

其中`strings_not_equal`是接受两个字符串并进行比较，如果不同则输出0.

因此，这个函数是与预设字符串比较，如不同则炸弹爆炸。

利用gdb调试工具，输入命令`x/s 0x2400`得到内存中存放的字符串输入即可拆解第一个炸弹。

## 第二题

先翻译成Clike

```assembly
rsi = rsp;
read_six_numbers;
if (*rsp == 1) {
	goto 400f30;
}
explode_bomb;
goto 400f30;
.400f17:
	eax = *(rbx - 4);
	eax = eax + eax;
	if (*rbx == eax) {
		goto 400f25;
	}
	explode_bomb;
.400f25:
	rbx = rbx + 4;
	if (rbx != rbx) {
		goto 400f17;
	}
	goto 400f3c;
.400f30
	rbx = rsp + 4;
	rbp = rsp + 0x18;
	goto 400f17;
.400f3c:
	return;
```

`read_six_numbers`为读入六个数据并放到rsp。

进一步可翻译成

```cpp
int a[6];
read();
if (a[1] != 1) {
    explode_bomb;
}
for (int i = 1; i < 6; i++) {
    int tmp = a[i - 1] * 2;
    if (a[i] != tmp) {
        explode_bomb;
    }
}
```

- 第一个数必须为1
- 一共有6个数
- 每个数为前面一个数的一倍

因此，答案为`1 2 4 8 16 32`

## 第三题

先翻译成CLIKE

```assembly
rcx = rsp + 0xc;
rdx = rsp + 0x8;
esi = *0x4025cf; //"%d %d"
eax = 0;
eax = sscanf();
if (eax > 1)
    goto 400f6a;
explode_bomb;
.400f6a:
	if (*(rsp + 8) > 7 || *(rsp + 8) < 0)
		explode_bomb;
	eax = *(rsp + 8);
	goto 跳转表;
400f7c：
	eax = 0xcf;
	goto 400fbe;
400f83：
	eax = 0x2c3;
	goto 400fbe;
400f8a:
	eax = 0x100;
	goto 400fbe;
400f91:
	eax = 0x185;
	goto 400fbe;
400f98:
	eax = 0xce;
	goto 400fbe;
400f9f:
	eax = 0x2aa;
	goto 400fbe;
400fa6:
	eax = 0x147;
	goto 400fbe;
.400fbe:
	if (eax == rsp + 12)
		return;
	explode_bomb;
```

可以大概判断出这是一个switch语句。地址0x4025cf处存放的字符串为"%d %d"，可以看出是输入两个数字。

利用gdb调试查看跳转表内容

![image-20221116135450882](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/image-20221116135450882.png)

根据跳转表上的地址就可以给switch的case语句标号了。

```cpp
void phase_3(char* output)
{
    int x, y;
    if(sscanf(output, "%d %d", &x, &y) <= 1)
        explode_bomb();
    if(x > 7)
        explode_bomb();
    int num;
    switch(x) {
    case 0:
        num = 207;
    	break;
    case 1:
        num = 311;
        break;
    case 2:
        num = 707;
        break;
    case 3:
        num = 256;
        break;
    case 4:
        num = 389;
        break;
    case 5:
        num = 206;
        break;
    case 6:
        num = 682;
		break;
    case 7:
        num = 327;
    }
    if (num != y)
        explode_bomb();
    return;
}
```

## 第四题

首先看主函数

```assembly
rcx = rsp + 0xc;
rdx = rsp + 0x8;
esi = *0x4025cf;
eax = 0;
eax = sscanf(input, "%d %d", rdx, rcx);
if (eax != 2)
	explode_bomb;
if (rdx <= 14 && rdx >= 0)
	goto 40103a;
.40103a:
	edx = 14;
	esi = 0;
	edi = *(rsp + 8);
	eax = func4(edi, esi, edx);
	if (eax != 0)
		explode_bomb;
	if (*(rsp + 0xc) == 0)
		return;
```

大体思路比较简单，直接翻译成C代码。

```cpp
void phase_4(char* input) {
    int x, y;
    int ret = sscanf(input, "%d %d", &x, &y);
	if (ret != 2 || x > 14 || x < 0) {
		explode_bomb();
	}
    else {
        int ret = func4(x, 0, 14);
        if (ret != 0 || y != 0) {
            explode_bomb();
        }
	}
	return;
}
```

限制了一下输入条件，输入两个整数，第一个整数范围规定在[0,14]，第二个整数必须为0。

调用了func4函数，主要还是看这个函数

```assembly
func4(rdi, rsi, rdx) {
	eax = edx;
	eax -= esi;
	ecx = eax;
	ecx >>= 31;
	eax += ecx;
	eax >>= 1;				# 对eax一顿操作
	ecx = rax + rsi;		# 对ecx一顿操作
	if (ecx <= edi) {
		goto 400ff2;
	}
	edx = rcx - 1;
	goto func4;				# 递归
	eax += eax;
	goto 401007;
400ff2:
	eax = 0;
	if (ecx >= edi) {		# 递归基
		goto 401007;
	}
	esi = rcx + 1;
	goto func4;				# 递归
	eax = rax + rax + 1;
401007:
	return;
}
```

```cpp
func4(edi, esi, edx) {
	eax = edx - esi;
	eax = (eax + eax >> 31) >> 1;
	ecx = rax + rsi;
	if (ecx <= edi) {
		eax = 0;
        if (ecx >= edi) {
            return;
        }
        esi = rcx + 1;
        rax = func4(edi, esi, edx);
        eax = 2 * rax + 1;
	}
	else {
        edx = rcx - 1;
        rax = func4(edi, esi, edx);
        eax = 2 * rax;	
	}
	retq;
}
```

这不是二分函数吗。

```cpp
int func4(int x, int a, int b): //[0, 14]二分一直在左边, 即0,1,3,7
    int ans = b - a;
    ans = (ans + (ans >> 31)) >> 1;
    c = (a + b) / 2;
    if (c < x)
        return 2 * func4(x, c + 1, b) + 1;
    else if  (c > x)
        return 2 * func4(x, a, c - 1);
    else
        return 0;
```

返回主函数，看到最后return的值必须为0，也就是必须一直保证二分的mid值要一直大于x。所以x只能取0,1,3,7.

## 第五题

CLIKE

```assembly
phase_5(rdx)
{
	rbx = rdi;
	rax = fs:0x28;				# 金丝雀
	*(rsp+0x18) = rax;
	eax = eax ^ eax;			# 清0
	callq string_length;		# 计算字符串长度
	if (eax == 6) {
		goto 4010d2;
	}
	else callq explode_bomb;
	goto 4010d2;
40108b:
	ecx = rbx + rax;
	*rsp = cl;
	rdx = *rsp;
	edx = edx & 0xf;
	edx = rdx + 0x4024b0;
	*(rsp+rax+0x10) = dl;	# 数组操作
	rax += 1;				# 自增
	if (rax != 6)			# 循环退出条件
		goto 40108b;
	*(rsp + 0x16) = 0;
	esi = 0x40245e;
	rdi = rsp + 10;
	callq strings_not_equal;
	if (eax == 0)
		callq explode_bomb;
	nopl
	goto 4010d9;
4010d2:
	eax = 0;				# init
	goto 40108b;			# 循环
4010d9:
	rax = *(rsp + 0x18);
	rax = rax ^ fs:0x28;
	if (rax == 0)			# 栈是否被破坏
		goto 4010ee;
	else
		callq __stack_chk_fail@plt;
4010ee:
	retq;
}
```

可以看出中间有一个循环代码，总共循环6次。

```cpp
phase_5(rdi) {
	rbx = rdi;
	eax = eax ^ eax;
	eax = string_length(rdi);
	if (eax == 6) {
		goto 4010d2;
	}
	else explode_bomb();
	for (eax = 0; eax != 6; eax++) {
        ecx = rbx + rax;
        *rsp = cl;
        rdx = *rsp;
        edx = edx & 0xf;
        edx = *(rdx + 0x4024b0);
        *(rsp+rax+0x10) = dl;
	}
    *(rsp + 0x16) = 0;
    esi = 0x40245e;
    rdi = rsp + 10;
    strings_not_equal(rdi, rsi);
    if (eax != 0) {
    	explode_bomb();
    }
}
```

最后esi要和我们处理出来的字符串进行比对，因此先看看地址0x40245e上放了啥。

利用gdb可以发现字符串是"flyers"。

这样就是说我们构造出来的字符串要和"flyers"相等。

观察这两行：

```cpp
edx = edx & 0xf;
edx = *(rdx + 0x4024b0);
```

与`1111`进行与运算后最多不能超过15，也就是说最多只能取到前16个字符。

利用gdb提取前16个字符：`maduiersnfotvbyl`

也就是六次循环结果分别为：` 9 15 14 5 6 7`

令x为我们输入的一个字符，要求按顺序x&15=上面的六个数字。

查ascii表后四位就可以得到答案（不分大小写）。

```
I,Y
O
N
E,U
F,V
G,W
```



