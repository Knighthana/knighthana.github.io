---
title: undefined reference to sem and stdout
date: 2019-06-05 00:00:00
cover: /img/Tux.svg
categories:
  - Dev-Code
tags:
  - Linux
  - signal
  - stdout
  - gcc
---

# 一个系统信号量相关函数的问题，一个stdout相关的问题

## 未定义的引用：sem函数(`Undefined Reference to Sem_*`)

GCC没有默认地支持C的API中的信号函数例如`sem_init` `sem_post` `sem_wait` （这很常见，GCC总是不会默认帮你加载所需的链接库） 

直接`gcc`带有这些函数的代码，想都不用想，肯定会报

  > undefined reference to sem

  的错误

解决这个问题需要给gcc带一个`-pthread`参数

-------------------------

## 标准输出stdout缓冲区flush的问题

在我设置的打印提示信息（`fprintf(stderr, "info")`）出现之前程序就段错误了，之前以为是打印的句子之前出现了错误，但是后来得证问题出在提示信息之后的语句中；

那为什么以前不出提示信息呢？

这个问题是打印错误信息的语句没有考虑到C缓冲区的问题，事实上C输出缓冲区只会在里面有`\n`，EOF，`fflush(stdout)`，还有程序执行完毕的时候才会把缓冲区里面的内容打印出来，所以如果提示信息里面没有`\n`或者什么能清空缓冲区的东西，那么提示信息就会一直屯着，直到程序觉得可以输出了，那么如果在这之间程序出了问题，提示信息就永远不会打印出来，进而也会导致对出错位置判断失误

Knighthana

2019年06月05日 于西电
