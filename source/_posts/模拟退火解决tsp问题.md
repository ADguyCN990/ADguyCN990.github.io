---
title: 模拟退火解决tsp问题
tags:
  - 大学作业
  - 人工智能
  - tsp
categories:
  - 大学作业
  - 人工智能
keywords:
  - 大学作业
  - 人工智能
  - tsp
  - 模拟退火
  - 旅行商
highlight_shrink: false
top_img: https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211232358703.webp
katex: true
abbrlink: dea04667
date: 2022-11-22 12:03:24
post_copyright:
copyright_author: adguy
copyright_author_href: https://adguycn990.github.io
copyright_url: https://adguycn990.github.io/adguy/dea04667.html
copyright_info: 此文章版权归金晖の博客所有，如有转载，请註明来自原作者
---




# 模拟退火

规定函数$f(x)$为所求问题所需的成本代价函数，选取合适的x使得成本代价尽可能小。

一般来说，函数图像具有一定的连续性。对于某一个局部区域，左右邻域的值相对于当前选取的方案来说不会差距太大。可以利用该性质，优化一下搜索的方法。

## 概念

- 温度T：相当于步长，区间范围的这么一个概念。温度越大，对于当前选择的点来说，考虑的邻域的范围就越大。温度是一个不断降低的过程，每次随机的区间都会不断缩小。最终，温度会收敛到一个最低值，所选的点也就固定住了。
  - 初始温度$T_0$：一开始的温度
   - 终止温度$T_E$：最后的温度。下降到该温度后程序结束。
   - 衰减系数$k$：$T_{}'=T \times k$ 。衰减系数k可以规定温度衰减的形式，可以是线性衰减，也可以是指数衰减。范围一般取(0,1)。衰减系数越接近于1，温度衰减的越慢，找到最优解的可能性就越大。

## 过程

以下内容摘抄于[oi-wiki](https://oiwiki.org/misc/simulated-annealing/)

> Quote / 参考
>
> 模拟退火时我们有三个参数：初始温度 $T_{0}$，降温系数 d，终止温度 $T_{k}$。其中$T_{0}$是一个比较大的数，d是一个非常接近1但是小于1的数，$T_{k}$是一个接近0的正数。
>
> 首先让温度$T=T_{0}$，然后按照上述步骤进行一次转移尝试，再让$T = d \times T$。当$T<T_{k}$时模拟退火过程结束，当前最优解即为最终的最优解。
>
> 注意为了使得解更为精确，我们通常不直接取当前解作为答案，而是在退火过程中维护遇到的所有解的最优值。
>
> 引用一张 [Wiki - Simulated annealing](https://en.wikipedia.org/wiki/Simulated_annealing) 的图片（随着温度的降低，跳跃越来越不随机，最优解也越来越稳定）。
>
> <img src="https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211221015146.gif">

### 个人理解：

每一次迭代会在当前的解空间范围内随机一个点，求一下该点的函数值，计算一下该点的函数值，规定 $\triangle E=f(new) - f(now)$ 。假设求全局最小值的话

- $\triangle E < 0$，说明当前解法必然不是全局最优。将当前点跳到新点
- $\triangle E > 0$，由于函数通常情况下有多个极小值点，为了不收敛于局部最优解中，也需要有一定的概率跳出当前点。
  - 显然，$\triangle E$ 越小，跳出该点的概率就应该越大。一般将这个经验函数取为 $e^{-\frac{\triangle E}{T}}$ 

随着迭代的进行，温度会不断降低，这样每次取得的解相较于全局最优解的偏移量就会越来越小。当温度降到给定的终止温度的时候，迭代就结束了。

### 尽可能避免随机化产生的影响

通过上述的分析，很容易看出一次模拟退火不一定能求出全局最优解。可以对一个问题多次进行模拟退火算法求解，然后对所有结果取最小值。亦或者是把整个定义域分成几段，每段跑一遍模拟退火，然后再取全局的最优解。

### 流程图

<img src="https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211221015131.png" >

## 参数控制

模拟退火算法的应用很广泛，可以求解 NP 完全问题，但其参数难以控制，其主要问题有以下三点：

1. 温度 T 的初始值设置问题。 温度 T 的初始值设置是影响模拟退火算法全局搜索性能的重要因素之一、初始温度高，则搜索到全局最优解的可能性大，但因此要花费大量的计算时间；反之，则可节约计算时间，但全局搜索性能可能受到影响。实际应用过程中，初始温度一般需要依据实验结果进行若干次调整。
2. 退火速度问题。 模拟退火算法的全局搜索性能也与退火速度密切相关。一般来说，同一温度下的 “充分” 搜索 (退火) 是相当必要的，但这需要计算时间。实际应用中，要针对具体问题的性质和特征设置合理的退火平衡条件。
3. 温度管理问题。 温度管理问题也是模拟退火算法难以处理的问题之一。实际应用中，由于必须考虑计算复杂度的切实可行性等问题，常采用如下所示的降温方式：式中 k 为正的略小于 1.00 的常数，t 为降温的次数。 

## 可改进的地方

- 设计合适的状态产生函数，使其根据搜索进程的需要表现出状态的全空间分散性或局部区域性
- 设计高效的降温策略
- 记忆化搜索，进行冗余剪枝，防止状态的冗余计算
- 为避免陷入局部极小，改进对温度的控制方式
- 选择合适的初始温度和终止温度
- 使用合适的迭代次数
- 合理调整概率p的生成函数

## 解决实际问题

### 问题背景：二维平面费马点

二维平面上有n个点。试找出一个点，使得该点到这n个点的距离之和最小。换言之，求一个二维平面上的费马点。

数据范围：

$1 \leq n \leq 100$

$0 \leq x_i,y_i \leq 10000$

### 问题分析

1. 该问题具有连续性。显然，两个位置相距很近的点，最后所得到的函数大小是差不多大的。
2. 该问题的区间范围非常明显，就是随机数的上界和下界
3. 每一次求解函数的时间复杂度为 $O(n)$，由于每次退火乘上了一个衰减系数，退火的时间复杂度为 $O(logt)$ 。多次模拟退火取最优值，设该常数为k，总的时间复杂度应是 $O(k\times nlogt)$

### 代码：

```cpp
#include<bits/stdc++.h>
using namespace std;
#define MAXN 105
typedef pair<double, double> pdd;
pdd point[MAXN];
double ans = 0x3f3f3f3f;
int n;

double get_rand(double l, double r) { //返回(l,r)的一个随机数
    return (double) rand() / RAND_MAX * (r - l) + l;
}

double get_dis(pdd a, pdd b) { //求出二维平面两点的距离
    double dx = a.first - b.first;
    double dy = a.second - b.second;
    return sqrt(dx * dx + dy * dy);
}

double calc(pdd p) { //计算代价函数
    double res = 0;
    for (int i = 1; i <= n; i++) {
        res += get_dis(p, point[i]);
    }
    return res;
}

double SA(int l, int r) { //模拟退火
    pdd now_point = make_pair(get_rand(l, r), get_rand(l, r));
    for (double t = r - l + 1; t >= 1e-4; t *= 0.99) { //规定初始温度，终止温度和衰减系数
        pdd new_point;
        new_point.first = get_rand(now_point.first - t, now_point.first + t);
        new_point.second = get_rand(now_point.second - t, now_point.second + t);
        //在范围内随机生成一个新点
        double delta_E = calc(new_point) - calc(now_point);
        if (exp(-delta_E / t) > get_rand(0, 1)) { //根据经验函数随机决定是否替换now_point
            now_point = new_point;
        }
    }
    return calc(now_point);
}

void solve() {
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        scanf("%lf%lf", &point[i].first, &point[i].second);
    }
    for (int i = 0; i < 100; i++) {
        double tmp = SA(0, 10000);
        ans = min(ans, tmp); //多次模拟退火取最小值
    }
    for (int i = 0, j = i + 100; i < 10000; i += 100) {
        double tmp = SA(i, j);
        ans = min(ans, tmp); //分块模拟退火取最小值
    }
    printf("%.0f\n", ans);

}

int main() {
    solve();
    return 0;
}
```

这里着重解释一下关于经验函数的这段代码：

```cpp
if (exp(-delta_E / t) > get_rand(0, 1)) { //根据经验函数随机决定是否替换now_point
    now_point = new_point;
}
```

`exp(-delta_E / t)`表达的意思就是 $e^{-\frac{\triangle E}{T}}$  。分情况讨论

- $\triangle E < 0$ 时，经验函数大于1，一定会替换当前的点。符合最开始的分析
- $\triangle E >0$ 时，$e^{-\frac{\triangle E}{T}} $ 的范围必定属于(0, 1)，可以通过基本数学性质得到。
  - 若 $\triangle E$ 越大，$e^{-\frac{\triangle E}{T}} $ 就越小 ，那么该经验函数大于(0, 1)之间的一个随机数的概率就越低，当前点被替换的可能就越小。换言之，该经验函数的大小与当前点被替换概率的大小呈负相关。符合最开始的分析。

以下随机生成了三组数据，然后利用MATLAB对模拟退火算法的流程进行了绘图。

<img src="https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211221015580.jpg">

<img src="https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211221213803.jpg">

<img src="https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211221015260.jpg">



### 问题背景：保龄球计分求最优解

一场保龄球比赛一共有 N 个轮次，每一轮都会有 10 个木瓶放置在木板道的另一端。

每一轮中，选手都有两次投球的机会来尝试击倒全部的 10 个木瓶。

对于每一次投球机会，选手投球的得分等于这一次投球所击倒的木瓶数量。

选手每一轮的得分是他两次机会击倒全部木瓶的数量。

对于每一个轮次，有如下三种情况：

1. “全中”：如果选手第一次尝试就击倒了全部 10 个木瓶，那么这一轮就称为 “全中”。在一个 “全中” 轮中，由于所有木瓶在第一次尝试中都已经被击倒，所以选手不需要再进行第二次投球尝试。同时，在计算总分时，选手在下一轮的得分将会被乘 2 计入总分。
2. “补中”：如果选手使用两次尝试击倒了 10 个木瓶，那么这一轮就称为 “补中”。同时，在计算总分时，选手在下一轮中的第一次尝试的得分将会被乘以 2 计入总分。
3. “失误”：如果选手未能通过两次尝试击倒全部的木瓶，那么这一轮就被称为 “失误”。同时，在计算总分时，选手在下一轮的得分会被计入总分，没有分数被翻倍。

此外，如果第 N 轮是 “全中”，那么选手可以进行一次附加轮：也就是，如果第 N 轮是 “全中”，那么选手将一共进行 N+1 轮比赛。

显然，在这种情况下，第 N+1 轮的分数一定会被加倍。

N+1轮的成绩并不会使其他轮的分数翻倍。

选手的总得分就是附加轮规则执行过，并且分数按上述规则加倍后的每一轮分数之和。

----

JYY 刚刚进行了一场 N 个轮次的保龄球比赛，但是，JYY 非常不满意他的得分。

JYY 想出了一个办法：他可以把记分表上，他所打出的所有轮次的顺序重新排列，这样重新排列之后，由于翻倍规则的存在，JYY 就可以得到更高的分数了！

当然了，JYY 不希望做的太假，他希望保证重新排列之后，所需要进行的轮数和重排前所进行的轮数是一致的：

比如如果重排前 JYY 在第 N 轮打出了 “全中”，那么重排之后，第 N 轮还得是 “全中” 以保证比赛一共进行 N+1 轮；同样的，如果 JYY 第 N 轮没有打出 “全中”，那么重排过后第 N 轮也不能是全中。

请你帮助 JYY 计算一下，他可以得到的最高的分数。

### 问题分析：

该问题不同于上面的几何问题，几何问题中解空间是连续的，且范围的边界非常明确。

而该问题的解空间代表某种方案，如何在“相邻”的范围内寻找某种解，以及对区间“范围”的划分成为了亟待解决的问题。

对于这种方案的排列问题，通常以随机交换某两位置来进行“相邻”解的寻找。区间范围此时就不太具有实际意义了，相当于一个限制迭代次数的条件。这样即可利用模拟退火算法求解。

需要注意的是，该问题求解最大值，因将经验函数符号取反，应该为$e^{\frac{\triangle E}{T}}$ 

 ### 代码：

```cpp
#include<bits/stdc++.h>
using namespace std;
#define MAXN 105
typedef pair<int, int> pii;
int n;
int m; //值为n+1或n，表示实际需要进行的轮数
pii a[MAXN]; //每次的成绩
int ans = 0; //全局最优解

int calc() {
    int res = 0;
    for (int i = 1; i <= m; i++) {
        res += a[i].first + a[i].second;
        if (i == m) continue;
        if (a[i].first == 10) {
            res += a[i + 1].first + a[i + 1].second;
        }
        else if (a[i].first + a[i].second == 10) {
            res += a[i + 1].first;
        }
    }
    return res;
}

int SA() {
    for (double t = 10000; t > 1e-4; t *= 0.99) {
        int now_goal = calc();
        int pos_a = rand() % m + 1, pos_b = rand() % m + 1;
        swap(a[pos_a], a[pos_b]); // 随机交换两个位置
        if (n + (a[n].first == 10) != m) { //新的方案必须满足题目限制
            swap(a[pos_a], a[pos_b]);
            continue;
        }
        int new_goal = calc();
        int delta = new_goal - now_goal;
        if (exp(delta / t) < (double)rand() / RAND_MAX) {
            //若新方案不如原方案，则换回原方案
            swap(a[pos_a], a[pos_b]);
        }
    }
    return calc();
}

void solve() {
    scanf("%d", &n);
    m = n;
    for (int i = 1; i <= n; i++) {
        scanf("%d%d", &a[i].first, &a[i].second);
    }
    if (a[n].first == 10) {
        m++;
        scanf("%d%d", &a[m].first, &a[m].second);
    }
    for (int i = 0; i < 100; i++) {
        int tmp = SA();
        ans = max(ans, tmp); //多次模拟退火求最优解
    }
    printf("%d\n", ans);
}

int main() {
    solve();
    return 0;
}
```

以下图片是利用matlab跑随机数据，而得出来的随机优化的图。目前来看，有一个很明显的优化方案就是初始点随机函数的选择。是否存在一种方式，使得该初始点距离全局最优解尽可能小？

<img src="https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211221015746.jpg">

<img src="https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211221214363.jpg">

<img src="https://adguycn990-typoraimage.oss-cn-hangzhou.aliyuncs.com/202211221015916.jpg">

## 总结

模拟退火不仅可以解决几何问题，也可以求解方案集合最优解的问题（前提是代价函数具有一定连续性）。

