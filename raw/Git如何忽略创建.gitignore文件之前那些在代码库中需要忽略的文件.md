---
title: 如何忽略创建.gitignore文件之前那些在代码库中需要忽略的文件
date: 2019-06-07 00:00:00
cover: /img/git-scm-logo.png
categories:
  - Dev-Env
tags:
  - Git
---

# 如何忽略创建.gitignore文件之前那些在代码库中需要忽略的文件

如果在代码库中有创建.gitignore之前就有的需要忽略的文件，简单的删除是不能阻止这些文件加入推送的；

需要使用以下代码先删掉本地的缓存，然后重新commit，这样就能使gitignore文件对所有文件生效了；

> .gitignore只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。
>
> 解决方法就是先把本地缓存删除（改变成未track状态），然后再提交:
>
> `git rm -r --cached .`
>
> `git add .`
>
> `git commit -m 'update .gitignore'`

Knighthana

2019年6月7日 于西电

-----------------------------------

# Git Newly Ignore

 I want to ignore the .ignore file from my repo, so what should I do?
 Firstly I only changed the .gitignore file, but `git status` said that their is new modified not tracked.
 So I search the Web, Find a Blog

 [Git 忽略提交 .gitignore][https://www.cnblogs.com/youyoui/p/8337147.html]


> .gitignore只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。
>
> 解决方法就是先把本地缓存删除（改变成未track状态），然后再提交:
>
> `git rm -r --cached .`
>
> `git add .`
>
> `git commit -m 'update .gitignore'`

原文出处：[Git 忽略提交 .gitignore](http://uusama.com/542.html)

 However I now realized a question, if I ignored the `.gitignore` file, there will be a lot of junk files in the directory. So the `.gitignore` file should be tracked.

Knighthana@Home

2019/06/07
