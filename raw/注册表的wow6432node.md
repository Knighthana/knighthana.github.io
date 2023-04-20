---
title: 注册表中的wow6432node
date: 2019-07-24 00:00:00
cover: /img/Registry_Editor_icon.png
categories:
  - Dev-Env
tags: 
  - Windows
  - Registry
---

# registry wow6432node

当按照已有的教程修改注册表却没有起到作用时，确认路径无误的情况下，考虑是否已有教程是为32位系统写的，而现在的64位系统并不认这个注册表。

在64位系统的注册表HKEY_LOCAL_MACHINE\SOFTWARE下有一个wow6432node，这个位置放着的是为32位系统而写的注册表项目。

所以说，64位Windows对32位Windows的兼容性果真是通过跑32位子系统实现的。64位系统中的32位程序，二者关系并没有我想象的那么亲密呢。

这方法巧妙吗...不过暂时想不到更好的了。

Knighthana@Home

2019/07/24
