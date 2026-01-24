---
title: (KM)奇加偶减-容斥原理
date: 2023-05-06 22:50:00
updated: 2023-05-06 22:50:01
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
tags:
  - 课程笔记
  - Math
  - 概率论与数理统计
---

# 奇加偶减-容斥原理

在学习概率论与数理统计时提到过一个技巧，对于多个事件，计算其并事件时，遵循一个口诀“奇加偶减”

这个口诀的背后是容斥原理

[容斥原理 - Wikipedia](https://zh.wikipedia.org/wiki/%E6%8E%92%E5%AE%B9%E5%8E%9F%E7%90%86)

容斥原理（inclusion-exclusion principle）又称排容原理，

在组合数学里，其说明若
$A_1, A_2, ... , A_n$
为有限集，则
$$
{\displaystyle {\begin{aligned}\left|\bigcup _{i=1}^{n}A_{i}\right|={}&\sum _{i=1}^{n}|A_{i}|-\sum _{1\leq i<j\leq n}|A_{i}\cap A_{j}|+\sum _{1\leq i<j<k\leq n}|A_{i}\cap A_{j}\cap A_{k}|-\cdots +(-1)^{n-1}\left|A_{1}\cap \cdots \cap A_{n}\right|.\end{aligned}}}
$$

其中
$|A|$
表示
$A$
的基数。

例如在表示两个集的情况时，我们可以通过将
$|A|$
和
$|B|$
相加，再减去其交集的基数，从而得到其并集的基数。

## 描述

### 两个集合的容斥原理

$$
n(A∪B)=n(A)+n(B) -n(A∩B)
$$

### 三个集合的容斥原理

$$
|A \cup B \cup C|=|A|+|B|+|C|-|A \cap B|-|A \cap C|-|B \cap C|+|A \cap B \cap C|
$$

### n个集合的容斥原理

$$
{\displaystyle {\begin{aligned}\left|\bigcup _{i=1}^{n}A_{i}\right|={}&\sum _{i=1}^{n}|A_{i}|-\sum _{1\leq i<j\leq n}|A_{i}\cap A_{j}|+\sum _{1\leq i<j<k\leq n}|A_{i}\cap A_{j}\cap A_{k}|-\cdots +(-1)^{n-1}\left|A_{1}\cap \cdots \cap A_{n}\right|.\end{aligned}}}
$$

或

$$
{\displaystyle \left|\bigcup _{i=1}^{n}A_{i}\right|=\sum _{k=1}^{n}(-1)^{k+1}\left(\sum _{1\leq i_{1}<\cdots <i_{k}\leq n}|A_{i_{1}}\cap \cdots \cap A_{i_{k}}|\right)}
$$

或

$$
{\displaystyle \left|\bigcup _{i=1}^{n}A_{i}\right|=\sum _{\emptyset \neq J\subseteq \{1,2,\ldots ,n\}}(-1)^{|J|-1}{\Biggl |}\bigcap _{j\in J}A_{j}{\Biggr |}.}
$$

(转载者注：还是分别组合、奇加偶减)

## 概率论中的容斥原理

在概率论中，对于概率空间
$(\Omega, \mathcal{F}, \mathbb{P})$
中的事件
$A_1,A_2,...,A_n$
有

### 两个事件的容斥原理

$$
{\displaystyle \mathbb {P} (A_{1}\cup A_{2})=\mathbb {P} (A_{1})+\mathbb {P} (A_{2})-\mathbb {P} (A_{1}\cap A_{2}),}
$$

### 三个事件的容斥原理

$$
{\displaystyle \mathbb {P} (A_{1}\cup A_{2}\cup A_{3})=\mathbb {P} (A_{1})+\mathbb {P} (A_{2})+\mathbb {P} (A_{3})-\mathbb {P} (A_{1}\cap A_{2})-\mathbb {P} (A_{1}\cap A_{3})-\mathbb {P} (A_{2}\cap A_{3})+\mathbb {P} (A_{1}\cap A_{2}\cap A_{3})}
$$

### 推广

自行推广

Knighthana

2023/05/06
