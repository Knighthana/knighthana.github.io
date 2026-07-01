---
title: (KM)向trusted.gpg.d中加入密钥是不安全的
date: 2023-04-11 00:00:00
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
tags:
  - GPG
  - APT
---

# 向/etc/apt/trusted.gpg.d中加入密钥是不安全的

# Adding a key to /etc/apt/trusted.gpg.d is insecure

Adding a key to /etc/apt/trusted.gpg.d is insecure because it adds the key for all repositories. This is exactly why apt-key had to be deprecated.

The proper solution is explained in that Linux Uprising article and on the Debian Wiki: Store the key in /etc/apt/keyrings/ (or /usr/share/keyrings/ if you're the package maintainer), and then reference the key in the apt source list.

[Warning: apt-key is deprecated. Manage keyring files in trusted.gpg.d instead](https://stackoverflow.com/questions/68992799/warning-apt-key-is-deprecated-manage-keyring-files-in-trusted-gpg-d-instead)

------------------------

上次因为安装slack的deb包，而在`apt`时报过类似错误，当时也没怎么当回事（我觉得主要是被`apt`之前的依赖爆炸搞出心理阴影了）

这两天准备安装docker，官方的教程里面提到要添加一个docker组织的gpg-key，需要在`/etc/apt/`新建一个`keyrings/`目录，查看了`/etc/apt/`目录，看到其中包含`trusted.gpg.d/`这个目录，从字面意思理解，这是“信任的gpg-key文件目录”，疑惑为什么docker的教程要求另建一个`keyrings`目录，于是查找了一下`trusted.gpg.d`到底是做什么用的，然后看到了上面来自stackoverflow的回答

看来随便往`trsuted.gpg.d`里面放东西是有安全风险的，还是按照标准来比较好

2023/04/11
