---
title: 家目录下的rc和profile文件
date: 2023-01-14 00:00:01
updated: 2023-04-19 00:00:00
cover: /img/Cover-Shell-Image.png
categories:
  - Dev-Env
tags: 
  - Linux
  - home path
  - shell
  - config
---

## Tag
2023-04-19_21-52-09.png
linux-shell; config-file

# 在Linux下诸如 .profile .*shrc 这样的问题

首先作为一名zsh用户应当懂得一个基本的道理，选择走人少的路总是有代价的。不过，如何处理因为解决这些代价而投入的成本，也影响着后面的得失，如果能因此彻底搞清一些问题，也是有一些收益的。

例如，为了搞好一个方便一点的博客系统，需要用到gem，需要优雅使用gem，则需要优雅地设置有关`.gem/`的环境变量，为了优雅地设置环境变量，需要调整开机时默认执行的脚本。

传统的草台教程中提到的修改`.bashrc`、`.bash_profile`的方法肯定是不行的，使用zsh的情况下，即便是修改`.profile`的方法也变得不可行起来，为了弄明白这些问题，还得对这套自动系统有一些进一步的深入了解才行。

如果有较好的英文基础，先阅读[Zsh not hitting ~/.profile](https://superuser.com/questions/187639/zsh-not-hitting-profile)，然后应该就不用看下面的东西了。

简单来说，

1. 出于语法兼容性方面的原因，zsh不会加载系统原来的`.profile`文件。

2. 在登入时，zsh加载`~/.zprofile`文件

3. 在打开一个新的终端会话时，zsh加载`~/.zshrc`文件

目前来看，安装过并且正在按照oh-my-zsh的方式运行zsh，并不会影响`.zprofile`文件正常发挥作用

Knighthana

2023/01/14

--------------------

## 更新1

卸载了oh-my-zsh之后，会留下一个`.zshrc.omz-uninstalled-$DATETIME`文件

这个文件是留着给人读的

重新安装omz之后，需要阅读一下这个文件，记得把以前自动化工具写进去的那些自己没留意过的配置文件迁移到新安装的`.zshrc`或是其他起作用的`rc`或`profile`里面

## 更新2

对于ZSH+LightDM用户来说，可能会遇到`.zprofile`未能加载的问题，这好像和大多数DM的一些不够智能有关系

总之，如果不是纯CLI方式(比如用TTY不开X11，或者SSH)的方式以zsh作为登录Shell，那么`.zprofile`就是废纸一张

[ZSH not sourcing zprofile](https://serverfault.com/questions/901403/zsh-not-sourcing-zprofile)

[Solved .zprofile not sourced](https://bbs.archlinux.org/viewtopic.php?id=211162)

[Correctly setting environment](https://unix.stackexchange.com/questions/4621/correctly-setting-environment)

不过即便安装了`zsh`，`lightdm`仍然会去加载`.profile`(想想也很合理，你安的是zsh，那zsh parse不了标准的profle关我lightdm屁事)

那就把需要在登陆时设置的环境变量一类的东西弄到`.profile`里面就可以了

我迁移了一些`.zshrc`中的语句到`.profile`，重启，使用lightdm登录

试了一遍`rbenv` `nvcc` `th` `npm` 都能正常工作，暂时认为没有问题

此外，通过观察可以发现，`.zshrc`和`.profile`的生命周期是不一样的

在`rc`中的内容，只要关闭了虚拟终端就会立刻失效，下一次打开终端时会重新读取载入然后生效

而`profile`中的内容，会在登录期间持续生效，与何时打开多少终端没有关系

所以环境变量什么的需要长生命周期且需要花费很长时间来加载的东西，就写在`profile`里面即可，不然浪费启动终端时的响应速度就很不美好了。

Knighthana

2023/04/19
