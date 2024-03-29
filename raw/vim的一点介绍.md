---
title: vim的一点介绍
date: 2023-05-02 16:25:00
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
tags:
  - vim
---

# `vim`的一点介绍

最近在网络社交论坛上经常(“多次”、“反复”)看到关于`vim`的话题，讨论的双方中，一方认为不知道`vim`鼎鼎大名的人不配做程序员，另一方认为2023年还在用`vim`的人除了装逼之外没有别的目的。

就感觉……挺无聊的，有这个功夫不如去争论一下“PHP到底是不是最好的语言”，哦对，时过境迁，现在的话应该是争论“JavaScript是不是最好的语言”，毕竟人家都已经有Webassembly这种玩意了；

首先声明，我现在已经不把`vim`当做主要的代码工具来用了，但是，如果需要临时快速编写或处理一些文本、调整配置文件，乃至提交`git`的`commit`，都是会使用vim的，有使用习惯和高效率两方面的原因。因此这篇文章的水平也不会高到哪里去，我只能保证它比初学者的水平高。

这篇文章是面向初学者的，我觉得，假如之前还有初学者在围观这种无聊的争论，不知道自己是不是应该使用这个“逼格很高”的工具，现在看到这篇文章，也差不多该学一学然后散了，各做各的事情去。

生命苦短，不看吵架。

在

> 讲一些`vimtutor`中没有的东西

一节中会讲一些常用的高阶用法，阅读前半节打开`vimtutor zh`窗口的同时，可以直接跳到后面看一看“讲一些`vimtutor`中没有的东西”的内容，至于前面的半节内容，其实不看也无妨。
（善用目录功能）

## `vim`的入门——`vimtutor zh`

`vim`的入门不应该有太复杂的心理负担，虽然说有人声称`vim`的学习曲线非常高耸，画了一条骇人听闻的曲线，确实，它的操作比起记事本和`micro$oft word`是有些反常识了，但这是思路的问题，是常识本来就不兼容的问题。

最基本的`hjkl`交互逻辑，在Unix、GNU/Linux中本就是经常可以看到的，这也是常识的一种，比如`man`。

我觉得任何人，入门`vim`的最佳方式，都应该是抽出半个小时，甚至半个小时都用不上，十几分钟，把`vimtutor`过一遍；我想不到还有什么比这个交互式教程更快的学习方式了。

而不是先打开搜索引擎：我惊讶于有这么多人从网站开始学习`vim`，他们会表示太难，太反直觉，往往在浏览器窗口和终端窗口来回切换，叫苦连天；但是却对它自带的教程充耳不闻；

就vim而言，这种学习方式不太妥当；

对于初学者来说，直接在终端中输入`vimtutor`即可，不过由于每个人使用的系统语言设置不同，此条命令有可能会打开一个英文版本的教程，所以请使用
```bash
vimtutor zh
```
打开中文教程。

它会在`/tmp/`中创建一个副本，所以基本不用担心修改到原文件。

`vimtutor zh`的作者有

  Michael C. Pierce

  Robert K. Ware

  (创意) Charles Smith

  (修订) Bram Moolenaar

  (翻译) 梁昌泰

  (翻译) 赵涛

  (通信) Sven Guckes

## 移动 hjkl

移动是非常基础的操作，虽然`vim`支持使用方向键`←↑↓→`移动，但适应`hjkl`的操作有右手不离开主键区一直处于准备位置且只有最灵活的食指需要移动的好处；

按`j`往下一行翻动页面。

虽然说当初刚开始使用`vim`的时候，即便在这篇教程内，我也是用方向键的，但是现在已经更习惯hjkl了，甚至有时会在`nano`里面打出hijk。

## 退出

我记得有个经久不衰的笑话，

> 如何最快获得一串完全随机的字符
>
> 找一个新手，让他试着退出`vim`或者`emacs`

`vim`的退出这么奇怪，是因为，作为一个命令行环境的编辑器它必须提供命令和编辑两种交互逻辑，粗略来说，vim有两种模式，

1. “正常模式”，这种情况下，输入被视为命令；我觉得叫它“命令模式”也无妨；

2. 插入模式，或者说，编辑模式，非正常模式，这种情况下，输入被视为字符；

当然还有其他模式，但是将它们基本归类在正常模式之内也无妨，

从插入模式到正常模式的方式是按`esc`键，如果不确定自己在哪个模式，多按几下`esc`总是能回到正常模式的；

在正常模式下，各种键盘输入会被当做命令来理解，最简单的退出，需要先输入一个冒号，也就是`shift+;`，然后输入`w`，这大概是"write to file"的意思，再输入一个`q`，也许是"quit"的意思，然后回车，

如果不想保存，那么输入`:q`也是可以的，但是问题在于，假如对文件有过改动，`vim`会阻止不保存而退出的行为，所以需要强制执行，那就是`:q!`

也就是说`:wq`+回车，或者`:q!`+回车，就可以退出`vim`

在终端界面中输入`vimtutor zh`以重新回到教程；

## 进入插入模式

编辑文档，这是一个文本编辑器最重要的功能；上面的内容算是简单介绍GUI中的菜单栏，下面说说中间的窗口，编辑文档，或者说插入模式；

从正常模式到插入模式的转换方式有很多，最常见的是按`i`，这是从GUI转过来的人觉得最熟悉的方式，

但是`vim`比起GUI的编辑器强大的地方在于，正常模式下，vim有26个小写英文字母和26个大写英文字母，一共52个字母用于精细地进行控制，它不像严重依赖光标的GUI编辑器，而是可以非常精准地表达自己要做的事情，例如：

`r`，替换光标位置的单个字符，替换结束之后自动返回正常模式，是基于单个字符的替换，并且保留在正常模式，一般用来替换文本中已有的单个不当字符

`R`(大写r)，连续替换，类似`insert`键的功能

`s`，删除光标所在字符，并进入编辑模式，也是基于单个字符的替换，但是会进入编辑模式，类似于GUI的`delete`+输入

`o`，在下方直接插入一个新行，并进入编辑模式，类似`enter`+输入

`A`(大写a)，在行尾进入编辑模式；这个操作在GUI中基本需要右手离开键盘，用鼠标精准地定位到行尾点击，然后右手回到键盘进行操作；当然，简单来说，对于具有104键键盘的GUI使用者来说，一个`end`键就可以搞定了；但是用大写A可以不用伸出右手去摸控制键位的位置；

`a`(小写a)，这个并不是很常用，它会在光标之后插入文本；

还有很多，不一一举例了，因为其它的我也没怎么用过；

## 基于字符或单词粒度的光标位置或命令控制

有点抽象，所谓字符粒度，单词粒度，说的是一次移动多少，停留在哪里，例如：

`w`，这个输入使光标一次跳过一个单词，出现在下一个单词开始的位置，对于中文的分词能力则较弱，一般是跳到下一个空格后的第一个字符的位置，`w`的跳转不限于单行内；

`e`，这个输入也会使光标一次跳过一个单词，但是光标会出现在单词末尾的位置，同样，对于中文的分词它就不是那么聪明了，一般是根据空格和特殊符号决定自己何时出现的；

命令则是另外的一些东西，

`x`，删除单个字符(实际上是剪切)

`d`，是删除命令的开头，后面需要跟一个描述需要删多长的命令字符，比如`dd`，表示删除一整行，`dw`，表示删掉一个单词

## 介绍到此为止

之后的内容我觉得应该全部交给
```bash
vimtutor zh
```

无论是撤销，查找替换，高亮搜索，还是可视模式与剪切复制粘贴一类的东西，这些通过阅读`vimtutor`讲解，在其中练习，都比阅读一篇教程要来得好。

`vim`在处理很长的单行文档方面的能力，是我目前见过的编辑器之中最强大的，不用担心它会崩溃卡死；如果`vim`也崩溃卡死了，那么这个文档可能确实是很难处理了。

# 讲一些`vimtutor`中没有的东西

有些东西教程里面没有写，可能是觉得过于高级不必介绍，但我觉得这些挺常用的，因此写在这一节

## 分窗

正常模式中，输入
```vim
:vs
```
+回车以将窗口竖直切开一分为二以便打开多个文件，这个最常用，因为代码竖着看比较方便；

输入
```vim
:sp
```
+回车以将窗口水平切开一分为二，如果要用的话也是可以的；

还可以组合执行，例如将已经vs切开的窗口再度sp切开，这样会得到三个窗口；

按下两次`ctrl`+`w`以便在多个窗口之间来回切换，

用`:q`或`:wq`或`:q!`来退出单个窗口，如此原来被切开的窗口会重新占据两个窗口的位置

## 使用`ctrl`+`p`或`ctrl`+`n`进行补全

教程没有讲这些进阶操作，但是对于经常用`vim`码代码的人来说，补全是挺常用的功能，

`ctrl`+`p`或者`ctrl`+`n`会给出可供选择的补全列表，p是在变量名之间选择可能的补全，n是在所有输入过的字符串中选择可能的补全

在帮助命令

```vim
:help compl-generic
```

中会有其它更加详细的补全介绍

## 临时调用`sudo`提高权限保存文档

这是很经常的事情，比如去`/etc/`里面修改配置文件，退出的时候发现忘了使用超级用户权限，

假如直接退出，那么编辑的内容就没了，但是想写入的话，却因为缺乏权限完全做不到。

```vim
:w !sudo tee %
```

使用这个命令需要安装有`tee`这个文本编辑输入输出工具，一般来说在各大发行版中`tee`是默认安装的

这将会是这种困境下最方便也基本是最优雅的选择。

## `vim`的鼠标模式

vim支持鼠标

```vim
:set mouse=a
```

可以通过窗口中的冒号命令，如上，临时启用鼠标支持，

也可以通过修改`~/.vimrc`持久启用或关闭鼠标的支持，将这条命令去掉冒号，单独一行保存在`.vimrc`中即可

`a`是启用了所有情况下的鼠标支持，可能用不到那么多情况，`vim`支持针对场景进行自定义的鼠标支持

可以阅读
[vim鼠标模式打开与关闭](https://blog.51cto.com/lxw1844912514/3107723)
获取直观的介绍

或者在`vim`中输入

```vim
:help mouse
```

获取来自帮助文档中的更加详细的说明

--------------------------------------------------------------------

不看草台教程，浪费时间，

不看吵架，浪费生命！

Knighthana

2023/05/02
