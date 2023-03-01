---
title: boomlab-6
tags:
  - csapp
  - boomlab
categories:
  - csapp
keywords:
  - csapp
  - boomlab
  - 反汇编
highlight_shrink: false
top_img: https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
katex: true
copyright_author: adguy
copyright_author_href: 'https://adguycn990.github.io'
copyright_url: 'https://adguycn990.github.io/adguy/7991beee.html'
copyright_info: 此文章版权归金晖の博客所有，如有转载，请注明来自原作者
abbrlink: 7991beee
date: 2022-11-22 18:30:15
post_copyright:
---

首先翻译成Clike

```assembly
def phase_6:
    r13 = rsp
    rsi = rsp
    read_six_numbers
    r14 = rsp
    r12 = 0
    .401114:
        rbp = r13
        eax = *(r13)
        eax = eax - 1
        if eax <= 5:
            goto 401128
        explode_bomb
    .401128:
        r12 = r12 + 1;
        if r12 == 6:
            goto 401153
        ebx = r12
    .401135:
        rax = ebx
        eax = *(rsp + rax * 4)
        if *rbp != eax:
            goto 401145
        explode_bomb
    .401145:
        ebx = ebx + 1;
        if ebx <= 5:
            goto 401135
        r13 = r13 + 4
        goto 401114

    .401153:
        rsi = rsp + 0x18
        rax = r14
        ecx = 7
    .401160:
        edx = ecx
        edx = edx - *rax
        *rax = edx
        rax = rax + 4
        if rax != rsi:
            goto 401160
        esi = 0
        goto 401197

    .401176:
        rdx = *(rdx + 8)
        eax = eax + 1
        if eax != ecx:
            goto 401176
        else:
            goto 401188
    .401183:
        edx = 0x6032d0
    .401188:
        *(rsi * 2 + rsp + 0x20) = rdx
        rsi = rsi + 4
        if rsi == 0x18:
            goto 4011ab
    .401197:
        ecx = *(rsi + rsp)
        if ecx <= 1:
            goto 401183
        eax = 1
        edx = 0x6032d0
        goto 401176
        
    .4011ab:
        rbx = *(rsp + 0x20)
        rax = rsp + 0x28
        rsi = rsp + 0x50
        rcx = rbx
    .4011bd:
        rdx = *rax
        *(rcx + 8) = rdx
        rax = rax + 8
        if rax == rsi:
            goto 4011d2
        rcx = rdx
        goto 4011bd
        
    .4011d2:
        *(rdx + 8) = 0
        ebp = 5
    .4011df:
        rax = *(rbx + 8)
        eax = *rax
        if *rbx >= eax
            goto 4011ee
        explode_bomb
    .4014ee:
        rbx = *(rbx + 8)
        ebp = ebp - 1
        if ebp != 0:
            goto 4011df
```

像一坨臭狗屎。

仔细端详一下这坨狗屎，第一段和第三段的结构有点像双重循环。试着继续翻译。

其中第一段里面，`r12`就相当于i，`ebx`就相当于j，`r13`就表示数组a[i]的地址，这段的翻译较为简单

```cpp
for (int i = 0; i < 6; i++) {
    if (a[i] > 6 || a[i] < 1)
        explode_bomb;
    for (int j = i + 1; j < 6; j++) {
        if (a[i] == a[j]) 
            explode_bomb;
    }
}
```

这段代码保证所有元素互不相同，且范围是[1,6]

第二段是最简单翻译的，就是令所有的$a[i]=7-a[i]$

```cpp
int *ed = a + 0x18;
int *st = a;
do {
    *st = 7 - *st;
}while(st != ed) 
```

第三段又是一个双重循环，初步翻译后长这样：

```cpp
for (rsi = 0; rsi != 0x18; rsi += 4) {
    int ecx = a[i];
    if (a[i] <= 1) {
        edx = 0x6032d0;
        *(rsi * 2 + rsp + 0x20) = rdx
    }
    else {
        eax = 1;
        edx = 0x6032d0;
        for (eax = 2; eax != a[i]; eax++)
            rdx = *(rdx + 8);
        *(rsi * 2 + rsp + 0x20) = rdx
    }
}
```

进一步化简为：

```cpp
for (rsi = 0; rsi != 0x18; rsi += 4) {
    int ecx = a[i];
    edx = 0x6032d0;
    for (eax = 2; eax < a[i]; eax++) {
        rdx = *(rdx + 8);
    }
    *(rsi * 2 + rsp + 0x20) = rdx
}
```

一开始的节点规定为`0x6032d0`，即node1的地址，然后是不断地找当前节点的next节点（next的次数为数组的值），找到后放在新分配的`sp+0x20`内存中。也就是相当于根据数组值，给6个node节点重新排列，并放于其实地址为`sp+0x20`的`指针数组list[6]`中。

![image-20221114123823678](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/image-20221114123823678.png)

![image-20221114121354974](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/image-20221114121354974.png)

第四段代码在理解第三段代码后意思就很明朗了，就是将各个链表串在一起

```cpp
for (int i = 1; i != 6; i++) {
    list[i - 1].next = list[i];
}
```

这个链表结构大概就长这个样子

![image-20221114125044674](https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/image-20221114125044674.png)

真正理解上面这个图后，最后一段代码豁然开朗

```cpp
for (int i = 5; i != 0; i--) {
    rax = rbx.next;
    rax = rbx.next.val;
    if (rbx.val < rbx.next.val) {
        explode_bomb;
    }
    rbx = rbx.next;
}
```

链表节点中的val在排序后必须非递增。

节点大小排序：3,4,5,6,1,2。同时这也是他们在链表中的顺序。

链表中的顺序由数组中的数字一样，但是做了一些修改，所以实际上的输入等于$7-a[i]$

最终答案为：`4 3 2 1 6 5`
