---
title: 安装Torch
date: 2023-04-05 00:00:00
cover: /img/torch-flow-hero-logo.png
categories:
  - Dev-Env
tags:
  - Torch
  - Lua
  - C
  - Linux
---

# 安装Torch

需要安装一下Torch，记录一下过程。

首先打开[toch的官方网站](http://torch.ch)

然后找到[安装指导](http://torch.ch/docs/getting-started.html)

根据指导，首先要运行

```
git clone https://github.com/torch/distro.git ~/torch --recursive
```

`git clone`是很熟悉的命令，但是后面说要安装在`~`目录中，这多少让人感觉有点难顶，我并不是很想在自己的家目录下面弄出一堆文件夹来，但是初来乍到，还不清楚乱改目录会不会造成兼容问题，所以只能先允许它这么干

这里需要注意的是，这一段要求通过 [github.com](https://github.com/torch/distro.git) 下载代码，鉴于国内特有的GitHub那个时灵时不灵的连接，对于这种大项目建议备好终端下的正常通信程序再执行`clone`，不然下到一半连接断了，项目又没有验证程序，基本就得重新下载了

UNIX的习惯是“没有提示就是没有报错”，不过torch安装完毕之后会提示`子模块路径'pkg/xxxx':检出'xxxxxxxxxxxxxxxxxxxx'`，这种状况我不太熟悉，稍稍找了一下，应该是某个检查模块的正常输出，那么安装已经成功了

接下来照着指示进入`~/torch`目录，运行
```bash
bash install-deps
```
，即便这条命令是在安装软件，也不需要`sudo`，在脚本被`bash`解释之后会单独要求输入密码的

我之前已经提前准备好了`lua5.4`和`luarocks`，这里只需要解决其他的依赖就可以了

(按照文档的说法，torch使用的是`LuaJIT`而非通常的`Lua`，如果要改成`Lua`，还要给`install.sh`输入一条额外的环境变量，然而我懒得做，而且用LuaJIT什么的不是更好吗)

这里包管理器提示有一个包找不到了，不过这个包可以通过`software-properties-common`替代，遂手动安装；考虑到torch最后一次更新是2017年，只有一个包找不到还真是不错呢(棒读)；

另外，安装`torch`还需要`cmake`，但`cmake`并不是一个必定安装的软件，然而这点既没有在指导文档里面说明，也没有通过`install-deps`脚本解决，幸好报错里面提到了，手动安装`cmake`解决。

然后再按照说明执行
```bash
./install.sh
```
，等待编译安装完成

另外，安装完毕之后，`th`命令不会立刻起作用，

要么
```bash
source ~/.zshrc
```
（这条命令具体是什么取决于你所使用的shell种类，详见[官方说明](http://torch.ch/docs/getting-started.html)），

要么退出终端重进一次，我选择了后者，然后痛失上面的所有提示信息(重定向一个log文件实在是太有必要了)

在shell识别到带有torch的`$PATH`之后，运行`th`就可以看到torch的界面啦

```lua
  ______             __   |  Torch7 
 /_  __/__  ________/ /   |  Scientific computing for Lua. 
  / / / _ \/ __/ __/ _ \  |  Type ? for help 
 /_/  \___/_/  \__/_//_/  |  https://github.com/torch 
                          |  http://torch.ch 
	
th> 
```

接下来应该就要面对来自`Lua`的会心一击了

Knighthana

2023/04/05
