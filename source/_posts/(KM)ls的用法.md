---
title: (KM)ls的用法
date: 2023-05-15 18:36:00
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
tags:
  - ls
---

# ls的用法

按照时间顺序显示项目(新前旧后)

```bash
ls -t
```

按照时间顺序显示项目(reverse新前旧后)

```bash
ls -tr
```

按照时间顺序打印出文件详细信息列表，并确保在终端屏幕上自己看到最近修改的文件

```bash
ls -ltr
```

使用`ls --help`可以获取说明

不过，这篇可以用来参考的文章也许更加简单一些：
[ls命令按时间排序](https://blog.csdn.net/viviliving/article/details/116975340)

不过，其中说

> -g无用

事实上，根据
```bash
ls --help | grep \-g
```
的执行结果，`g`参数的意思是

> 类似 `-l`，但不列出所有者

Knighthana
