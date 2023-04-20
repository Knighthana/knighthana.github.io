---
title: 停电，然后失去git文件
date: 2022-12-06 00:00:00
cover: /img/Cover-Blog-Maintenance.jpg
categories:
  - Blog Maintenance
tags:
  - Blog
  - WSL
  - Git
---

# 停电，然后失去git文件

半夜敲代码没看时间，然后遇到熄灯停电；

本来以为积极保存代码能躲过一劫，事实上代码确实没问题，而且commit的时候也没有遇到问题；

然而最终发现，基于WSL内文件系统的git文件损坏了；例如进行远程push的时候，抛出了一大堆问题，例如`inflate: data stream error (unknown compression method)` `unable to unpack 4f51a0a09060036272c441837705d2bd64156f61 header`；

有人提到过这样的问题，[Git error: inflate: data stream error (unknown compression method)](https://stackoverflow.com/questions/41741683/git-error-inflate-data-stream-error-unknown-compression-method)

抱歉，我只是个学生，还得完成我的主要代码，修复这些git文件不是目前要考虑的问题；

所以只能先把文件复制出来，然后重新执行pull-copy-add-commit-push的操作；

这样的话会丢掉中间好几次的commit注释信息，所幸注释里面只写了一些编译器报错内容，方便下次定位问题。

今天本来也只是被舍友一大早赶车吵醒所以早起的，这会困意又席卷而来，无力与这样的git文件系统破碎问题纠缠，先这样吧。

Knighthana

2022/12/06
