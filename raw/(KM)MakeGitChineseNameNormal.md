---
title: (KM)解决Git中中文显示为8进制编码的问题
date: 2023-04-09 00:00:00
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
tags:
  - Git
  - CJK
---

# 解决Git中中文显示为8进制编码的问题

Git会将编码大于0x80的字符进行转码显示

通过
`git config --global core.quotepath false`
改变git的全局设定

这样就可以令Git显示中文了

[git环境下中文显示转义乱码](https://blog.csdn.net/qfeung/article/details/106067094)

[设置GIT显示中文名](https://blog.csdn.net/imphp/article/details/21592565)

2023/04/09
