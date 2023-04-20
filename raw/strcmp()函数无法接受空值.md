---
title: strcmp()函数无法接受空值
date: 2019-06-08 00:00:00
cover: /img/Cover-CPLang.jpg
categories:
  - Dev-Code
tags:
  - C
---

# strcmp()函数无法接受空值

如果在strcmp函数中将一个什么串和“空”对比，就会出现段错误；

这个问题值得留意；

很多大公司会在使用串函数之前套用一个检查函数；

但是默认情况下C语言的编辑器和编译器都不会帮代码撰写者检查使用的串操作函数，

在需要的情况下，我也许需要自己写一些检查函数。

knighthana

2019年6月8日 于 西电

------------------------------------

# function strcmp cannot accept NULL

 In project fakeshell, I found that if strcmp(NULL, [something]), there will be a segmentation fault.
 It's a problem should be noticed.
 There is a saying that many big companies will make a checkfunction before using str* functions.
 But C make no-check just for efficiency, I think I can make a check if necessary, but not every time.

 Knighthana@XDU
 2019/06/08
