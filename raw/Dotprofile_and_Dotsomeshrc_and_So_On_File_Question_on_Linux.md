<meta name="created" content="2023-01-14"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

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
