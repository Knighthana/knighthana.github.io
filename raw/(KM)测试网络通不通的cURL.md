---
title: (KM)测试网络通不通的cURL
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
date: 2026-03-17 06:48:49
tags:
  -cURL
---

# 测试网络通不通的cURL

如果只是需要测试网络通不通，用
```bash
curl -ILv https://example.com
```
即可

`-I`的含义是“只显示头部”

`-L`的含义是“自动跟随跳转”

`-v`的含义是“显示详细信息”

在测试网络状况时，一般也就需要用到这些功能，也不需要把文件下载到本地。

--------------------------

Knighthana

2026/03/17
