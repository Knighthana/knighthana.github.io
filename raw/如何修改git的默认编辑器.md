---
title: 如何修改git的默认编辑器
date: 2019-06-11 00:00:00
cover: /img/git-scm-logo.png
categories:
  - Dev-Env
tags:
  - Git
---

# 如何修改git的默认编辑器

 提交了一段简单修改，但是commit环节出了问题，nano编辑中文的时候处理不了问题，比如吞字符，导致我的一个中文引号编辑总是出问题。

 （真垃圾真垃圾

 于是需要改默认编辑器

## 方法1：修改全局配置
 
 git config -global core.editor vim

## 方法2：仅修改当前配置

打开git配置文件
 ```bash
 vim %gitfolder%/.git/config
 ```

然后修改
 ```gitconfig
 [core]
 editor = vim
 ```

Knighthana

2019年06月11日 于 西电
