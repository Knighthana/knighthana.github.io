---
title: 对apt源设置加速代理
date: 2026-03-17 06:14:36
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
tags:
  - Linux
  - Debian
  - APT
---

# 对APT源设置加速代理

以前一直以为APT这种系统工具设置代理很麻烦，或者至少也得用工具把`apt`全部套进去才行；

现在发现没那么麻烦，`apt`自己就支持设置代理；

## 确认需要被代理的远端源的主机地址

在`apt`更新的时候留心观察是哪个软件的源在拖慢更新速度；

打开`/etc/apt/sources.list`或者`/etc/apt/sources.list.d/`，记住需要被代理的远程仓库的主机地址；

## 创建或修改用于加速代理的配置文件

打开目录`/etc/apt/apt.conf/`，注意其中是不是有含有`proxy`字样的配置文件，如果没有，就创建一个；

创建前先观察已经有的配置文件都用了什么编号，建议用靠后的编号，比如`90`，如果`90`已经占用，就用更靠后的`95`或者`97`；

例如我们创建`/etc/apt/apt.conf.d/95proxy`文件；由于是个小文件，假设使用`nano`

```bash
sudo nano /etc/apt/apt.conf.d/90proxy
```

然后输入代理规则，假设主机为`download.hostexample.org`，代理服务器运行在`http://your-proxy-address:port`，则格式如下
```conf
Acquire::http::Proxy::download.hostexample.org "http://your-proxy-address:port";
```

若有多个远程仓库主机Alice、Bob、Carol需要代理，如上各式追加几行指向不同的远程仓库即可；
```conf
Acquire::http::Proxy::download.alicesoft.com "http://your-proxy-address:port";
Acquire::http::Proxy::download.bobsoft.com "http://your-proxy-address:port";
Acquire::http::Proxy::download.carolsoft.com "http://your-proxy-address:port";
```


随后保存文件退出。

## 更新测试

在配置文件搞定后，通过
```bash
sudo apt update
```
测试配置是否生效顺便更新本地数据库；

-------------------------------

Knighthana

2026/03/17
