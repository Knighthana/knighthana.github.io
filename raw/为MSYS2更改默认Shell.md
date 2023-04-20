---
title: 为MSYS2更改默认Shell
date: 2021-03-24 00:00:00
cover: /img/MSYS2-logo.png
categories:
  - Dev-Env
tags: 
  - Linux
  - Windows
  - MSYS2
  - shell
---

# 为MSYS2更改默认Shell

 在msys2的目录下有一个msys_shell.cmd文件

 打开，第6行就是默认shell设置

 非常优雅的方式，这个设置可以同时影响到MSYS2,MINGW32和MINGW64

 Knighthana

 2021年3月24日 于西电

---------------------------------------------------------------------------

# Change Default Shell Under MSYS2

  for some reason, I need to install msys to use mingw;

  and I'm used to oh-my-zsh over zsh under unix-like system;

  well MSYS2 use bash as default shell;

  but appearently I can't change default shell with `chsh` under MSYS2.

  check the MSYS folder, and there will be a `msys_shell.cmd` file in sight.

  there is a `set "LOGINSHELL=bash"`,  edit it.

Knighthana @ XDU

2021/03/24
