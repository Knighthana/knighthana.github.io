---
title: Linux版本的Chrome无法使用鼠标中键滚动页面
date: 2023-04-18 00:00:00
cover: /img/chrome-logo-m100.svg
categories:
  - Dev-Env
tags: 
  - Linux
  - Chrome
---

# Linux版本的Chrome无法使用鼠标中键滚动页面

至少在Ubuntu某些版本和基于Ubuntu的某些发行版中，在Chrome中用鼠标中键尝试滚动页面，会发现不弹出拖动以滚动页面的图标。

12年前有人提过
[Chrome/Chromium middle mouse button for scroll Linux, Mac](https://askubuntu.com/questions/28150/chrome-chromium-middle-mouse-button-for-scroll-linux-mac)
这个问题

解决方案就是安装这个[AutoScroll插件](https://chrome.google.com/webstore/detail/occjjkgifpmdgodlplnacmkejpdionan)

改`xinput`什么的方法就算了，目前看来实现同样的功能花费了更多的时间，而且在更大范围造成了对我而言未知的后果，所以暂时不采用这个方法。

2023/04/18

Knighthana
