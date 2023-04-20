---
title: 使用git以ssh方式向GitHub Push本地库时需要输入账号密码的情况
date: 2021-01-31 00:00:00
updated: 2023-04-20 00:00:00
cover: /img/git-scm-logo.png
categories:
- Dev-Env
tags:
- Git
---

# 使用git以ssh方式向GitHub Push本地库时需要输入账号密码的情况

之前在Github的html页面新建了一个库，之后通过git clone https的方式将代码clone到本地继续工作，但是之后再次push的时候就遇到了需要输入用户名和密码的问题。

按说我早已经配置过了GitHub的ssh-key，而且本地保存的是对应的私钥，执行

```bash
ssh git@github.com
```

可以收到 welcome but we dont support shell access 的提示，说明我登陆成功了

那么为什么只有这个库是需要输入账户名和密码才可以push的呢？

在网上查询了一番，找到了原因，还是clone方式和预期的方式不符的原因。

在本地库中输入
```bash
git remote -v
```
查询远程库，可以看到远程库是 `https://github.com/*` 说明使用的是https协议

因此需要更换本地库中的远端设置

```bash
git remote rm origin

git remote add origin git@github.com:username/repo.git

git push --set-upstream origin main
```

所以说 clone 的时候这个 "git@" 开头非常重要啊，不然协议就选错了

参考文章：[Github：每次git push推送的时候都需要输入git的用户名和密码](https://blog.csdn.net/whbing1471/article/details/52066688)

参考文章：[错误地使用了git的克隆方法导致的推送出错](https://github.com/Knighthana/knighthana.github.io/blob/master/raw/Git_Cannot_Push_Caused_By_Wrong_Cloning_Method.md)

另外，之前打成了 `push origin master` 疯狂提示没有这个分支，仔细一看，原来是master分支现在叫main分支，第一次感觉到这个鬼变化，呵呵

Knighthana

2021年1月31日

-------------------

已将原来的“使用终端版本的git向GitHub Push本地库时需要输入账号密码的情况”标题改为“使用git以ssh方式向GitHub Push本地库时需要输入账号密码的情况”

Knighthana

2023/04/20
