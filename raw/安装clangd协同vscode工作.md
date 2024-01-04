---
title: 安装clangd协同vscode工作
date: 2023-11-16 22:19:40
update: 2023-11-16 22:57:00
cover: /img/Cover-CPLang.jpg
categories:
  - Dev-Env
tags:
  - C
---

# 安装Clangd

## 什么是Clangd？

[What is clangd?](https://clangd.llvm.org/)

> clangd is a language server that can work with many editors via a plugin. Here’s Visual Studio Code with the clangd plugin, demonstrating code completion:
>
> ![clangd work with vscode example](https://clangd.llvm.org/screenshots/basic_completion.png)

不多介绍，很**牛逼**就是了，对于我这种希望对代码做**最**精细检查的人来说非常好用

## 怎么安装Clangd？

对于 Debian Linux 或者 LinuxMint 用户（也包括对应的WSL用户，不再赘述）来说，输入

```shell
sudo apt install clangd
```

即可安装Clangd，其他发行版也可以在包管理器内找到对应的软件包，一般来说叫`clangd`进行安装

# 安装名为“Clangd”的vscode插件

## 安装插件

点击vscode侧面的插件页面，搜索“Clangd”插件，作者为“LLVM”的那个就是

点击安装

## 对vscode的配置

基本不需要自己配置，

在安装了Clangd插件之后，它会自动提示“请禁用与Clangd冲突的插件”，点击允许的那个按钮就可以了

一般来说会禁用vscode自带的“IntelliSense”

如果不慎禁用了这个用于自动提示的对话框，可以在Clangd的插件设置里面找到关于这个对话框的设置`clangd.detectExtensionConflicts`

## 如何重新启用IntelliSense

假如出于各种原因，需要重新启用IntelliSense，怎么启用呢？

打开vscode对应阶段的`settings.json`，一般来说，被clangd插件禁用的是用户层级的，那么

Linux在

```Path
/home/user/.config/Code/User/settings.json
```

Windows在

```Path
%userprofile%/AppData\Roaming\Code\User\Settings.json
```

中找到对应的配置文件

但是，最稳妥的办法是按下`ctrl`+`shift`+`P`找到对应层级（用户级、工作区级、SSH连接级）的配置文件

查找这样一行

```json
    "C_Cpp.intelliSenseEngine": "disabled",
```

根据需要和提示修改为`"disabled"`或者"`default`"，就可以控制IntelliSense的开关了

# 向clangd传递工程的情况

有时候自定义了一些头文件，放在了特殊的目录中，编译的时候也会使用gcc的`-I`来控制头文件目录，但是对于语法检查程序来说并不知道编译参数是什么

这里参考llvm给出的文档

[Configuration](https://clangd.llvm.org/config.html)

在工程目录下新建一个叫做`.clangd`的**文件**，然后根据文章中的语法要求书写配置即可

例如我最关心的`CFLAGS`

（懒得翻译了）

> ## CompileFlags
> Affects how a source file is parsed.
> 
> CompileFlags:                     # Tweak the parse settings
>   `Add: [-xc++, -Wall]`             # treat all files as C++, enable more warnings
>   `Remove: -W*`                     # strip all other warning-related flags
>   `Compiler: clang++`               # Change argv[0] of compile flags to `clang++`
> clangd emulates how clang would interpret a file. By default, it behaves roughly as clang $FILENAME, but real projects usually require setting the include path (with the `-I` flag), defining preprocessor symbols, configuring warnings etc.
>
> Often, a compilation database specifies these compile commands. clangd searches for compile_commands.json in parents of the source file.
>
> This section modifies how the compile command is constructed.
>
> ## Add
> List of flags to append to the compile command.
>
> ## Remove
> List of flags to remove from the compile command.
>
> If the value is a recognized clang flag (like `-I`) then it will be removed along with any arguments. Synonyms like `--include-directory=` will also be removed.
> Otherwise, if the value ends in `*` (like `-DFOO=*`) then any argument with the prefix will be removed.
> Otherwise any argument exactly matching the value is removed.
> In all cases, -Xclang is also removed where needed.
>
> Example:
>
> Command: `clang++ --include-directory=/usr/include -DFOO=42 foo.cc`
> Configuration: `Remove: [-I, -DFOO=*]`
> Result: `clang++ foo.cc`
> Flags added by the same CompileFlags entry will not be removed.

比如我比较关心的`-I`参数，那么就在文件里面写

```.clangd
CompileFlags:
  Add: [-I/home/knighthana/my/project/path/include]
  Compiler: gcc
```

重启vscode,发现语法检查已经跟上了，完事！

# 在交叉编译环境中的准备

在交叉编译环境中配置`clangd`正常工作就必须用到`vscode`的设置文件`.vscode/settings.json`了

事实上我是很抗拒使用`vscode`来进行配置的，因为`vscode`在打开的工作区非单独工程目录时的表现过于蠢笨，它似乎没法理解这种情况

但对于交叉编译环境，使用`settings.json`终归是最简单的办法

例如工程中实际使用的编译器是`/opt/share/arm-blahblahcompany-linux-uclibcgnueabihf/bin/arm-blahblahcompany-linux-uclibcgnueabihf-gcc(g++)`

那么就需要在工作区的顶层目录新建`.vscode`文件夹，新增文件`settings.json`（或向已经存在的文件增添以下内容）

```JSON
{
    "clangd.arguments": [
        "--query-driver=/opt/share/arm-blahblahcompany-linux-uclibcgnueabihf/bin/arm-blahblahcompany-linux-uclibcgnueabihf*"
    ]
}
```

这样的话，通过`vscode`唤起的`clangd`就会使用交叉编译器的环境进行配置

## 查找资料时发现的一点好玩的东西

据说某些版本的`clangd`会因为`gcc`输出了非英语英文的本地化字符而无法识别交叉编译环境，例如[解决clangd设置query-driver后无法解析include路径](https://zhuanlan.zhihu.com/p/616838477)

虽然我没有遇到，但如果发生这样的事情的话，可以考虑向这个方向怀疑

自己检查的办法是，运行
```shell
gcc -xc -v -E /dev/null
```
查看输出是否为英语英文，若不是，则有可能是发生了[引文](https://zhuanlan.zhihu.com/p/616838477)中的情况


Knighthana

2023/11/16
