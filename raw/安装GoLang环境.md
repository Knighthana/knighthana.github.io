---
title: 安装GoLang环境
date: 2025-01-17 00:00:00
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
tags:
  - GoLang
  - Linux
---

# 安装GoLang环境

## 安装版本管理器

稍微查阅了一下，目前比较常用的GoLang版本管理器是[GVM](https://github.com/moovweb/gvm)

特别注意用zsh执行安装脚本即可安装流程，注意网络问题

## 如何卸载GVM

根据GVM的提示，执行

```shell
rm -rf /home/username/.gvm
```

即可卸载GVM

## GVM做了什么？

跟踪安装脚本，可以发现它在执行/home/username/.gvm/scripts/gvm-default的脚本

```shell
unset GOROOT
unset GOARCH
unset GOOS
unset GOPATH
unset GOBIN

unset gvm_go_name
unset gvm_pkgset_name

mkdir -p "$GVM_ROOT/logs" > /dev/null 2>&1
mkdir -p "$GVM_ROOT/gos" > /dev/null 2>&1
mkdir -p "$GVM_ROOT/archive" > /dev/null 2>&1
mkdir -p "$GVM_ROOT/archive/package" > /dev/null 2>&1
mkdir -p "$GVM_ROOT/environments" > /dev/null 2>&1

export GVM_VERSION=$(cat "$GVM_ROOT/VERSION")
export PATH="$GVM_ROOT/bin:$PATH"
export GVM_PATH_BACKUP="$PATH"
[ -f "$GVM_ROOT/environments/default" ] && . "$GVM_ROOT/environments/default"
. "$GVM_ROOT/scripts/env/gvm"

. "$GVM_ROOT/scripts/env/cd" && cd .
```

最终指向了运行`$GVM_ROOT/environments/default`、`$GVM_ROOT/scripts/env/gvm`和`$GVM_ROOT/scripts/env/cd`这三个文件

至少了解了它做了什么，假如某天要排查什么问题的时候，可以由此查起

## 版本情况

注意到，主页称：

> A Note on Compiling Go 1.5+
>
> Go 1.5+ removed the C compilers from the toolchain and replaced them with one written in Go. Obviously, this creates a bootstrapping problem if you don't already have a working Go install. In order to compile Go 1.5+, make sure Go 1.4 is installed first. If Go 1.4 won't install try a later version (e.g. go1.5), just make sure you have the -B option after the version number.

大致是说Go在1.5之后的版本的安装是自举进行的，因此需要一个安装好的Go版本来进行后续版本的编译安装，照提示操作先行安装1.4，或是像我实际操作的一样直接安装当前最新版本的二进制版本。

## 安装实操

现在是2025年1月17日，最新版本是1.23.5，因此输入

```shell
gvm install go1.23.5 -B
```
没有提示就是最好的提示，下一步是

```shell
gvm use go1.23.5 --default
```
由此环境配置完成

## 修改镜像源

以防万一，参阅[Golang GVM 修改国内镜像](https://gist.github.com/rambolee/f7bc4cfdc52d8c2535513bd933d71c78)

实际上Google和GitHub在国内的网络状况都……一言难尽

## 其他参考

这是其他作者的博客，他提到了

那么问题来了，我每次切换版本，都会改变 GOPATH ，这在开发中很蛋疼，你可以看出有三个命令，linkthis,pkgset,pkgenv 都是跟环境变量有关的。

[GVM - Go 的多版本管理工具，使用介绍](https://dryyun.com/2018/11/28/how-to-use-gvm/)

我之后可以注意一下这方面的问题，但目前我只安装了1.23.5，因此大概不用考虑这些问https://github.com/moovweb/gvm题。

## 测试Go

```shell
➜  ~ go version
go version go1.23.5 linux/amd64
```

后记
不知道为什么这篇文章一年前（2025年1月）写完没有发出来

Knighthana

2026/1/20
