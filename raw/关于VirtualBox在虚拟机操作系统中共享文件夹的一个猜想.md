---
title: 关于VirtualBox在虚拟机操作系统中共享文件夹的一个猜想
date: 2022-07-07 00:00:00
cover: /img/VirtualBox-IMG.jpg
categories:
  - Dev-Env
tags: 
  - Linux
  - VirtualBox
  - Ubuntu
  - Kernel
---

# 关于VirtualBox在虚拟机操作系统中共享文件夹的一个猜想

我注意到VirtualBox的虚拟机中，共享文件夹功能在更换内核之后就无法使用了

所以我的猜想是，VirtualBox的GuestAdditions通过向内核安装了一个内核模块，来实现扩展的额外功能

而这其中就包括了共享文件夹功能

所以在更换内核之后，由于原先安装的内核模块不在新启动的内核上面，因此共享文件夹功能就不可用了

当然目前仅仅只是一个猜想

这个猜想主要是为了解决一个问题，就是“为什么已经安装了VirtualBox GuestAdditons工具，仍然无法创建和访问共享文件夹”

解决方案是更换到安装了该功能的版本的内核

Knighthana

2022/07/07
