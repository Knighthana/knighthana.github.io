---
title: clangd到底要咋配.md
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
date: 2026-04-19 06:39:56
updated: 2026-04-19 06:39:56
tags:
  - C
  - clangd
---

`clangd`到底要咋配
===============

`clangd`很好用，毋庸置疑；

但每当在一个新的环境上部署了`clangd`、或者在一个新的代码仓库中打开`clangd`，或者手里有几套交叉的编译环境的时候，

`clangd`对环境的纠结可以促使人快速从平静变成愤怒然后再变成平静；当看到`clangd`把一个`C Header`当做`Objective C++`来猜的时候，就应该知道，该请高人了；

以前提过`clangd`的配置文件，但是干活的时候还是经常“俺寻思这样能行”，现在的话，决定整理一套方案，来汇总这些零零散散的配置文件。

# 说的是哪个`clangd`

首先，虽然`clangd`只有一个，那就是[What is clangd?](https://clangd.llvm.org/)，也就是作为[LLVM](https://llvm.org/)项目一部分的Language Server(*LSP Server*)。

不过一般不直接用`clangd`，而是通过编辑器调用，最常用的编辑器是[VSCode](https://code.visualstudio.com/)，我们一般通过插件功能调用[clangd](https://github.com/clangd/vscode-clangd)[插件](https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.vscode-clangd)。

# 文件？配置？顺序？

## `clangd`的配置

优先级：从(最高1)到(最低4)，越靠近启动指令，优先级越高

|优先级|配置来源|存储位置|生效范围|
|-----|--------|-------|--------|
|1|命令行参数|编辑器配置(VSCode - `clangd.arguments`)|仅当前编辑器实例|
|2|项目配置文件|项目根目录的 `.clangd`|仅当前项目文件夹|
|3|用户全局配置|`config.yaml` (系统路径下)|当前用户的所有项目|
|4|默认行为|`clangd` 程序内建逻辑|全局|

系统路径：
- Linux类环境 `~/.config/clangd/config.yaml`
- Windows环境 `%LocalAppData%\clangd\config.yaml` (`Roaming`)

关键规则：
- 覆盖关系：对于单一值的配置（如 `CompilationDatabase`），高优先级直接覆盖低优先级。
- 追加关系：对于列表值的配置（如 `CompileFlags: Add` 或 `QueryDriver`），高优先级通常会追加在低优先级之后，`clangd`会尝试匹配列表里的每一项。

### Compilation Database：

Compilation Database协议本质上是一个JSON格式的文件，惯例上命名为`compile_commands.json`，其顶层是一个“命令对象”的数组。每个对象代表一个源文件（即“翻译单元”）的编译配置。`clangd`正是通过解析这些信息来理解工程的。

所以整个协议都围绕着一个JSON文件，*这是否也是一种单例模式*。

`clangd`遵循协议的标准方式，自动查找并解析`compile_commands.json`文件，从中提取编译所需的信息。它的核心逻辑如下：
1. 智能查找：`clangd`启动后，会寻找`compile_commands.json`文件，查找顺序通常是：
  - 通过`--compile-commands-dir=<路径>`命令指定的目录。
  - 当前工作目录。
  - 当前工作目录的父目录。
  - 待分析的源文件所在目录及其父目录。
2. 精确匹配：找到文件后，`clangd`会解析其内容，并使用`file`字段作为索引，为当前打开的源文件匹配对应的“命令对象”。
3. 提取核心编译参数：`clangd`主要从匹配到的“命令对象”中提取`arguments`或`command`字段里的信息。它利用这些信息来构建编译环境，从而理解代码，提供准确的代码补全、跳转和诊断等功能。

### 生成`compile_commands.json`的方法

这个文件可以自动生成，常见的方法有：

**CMake**：在运行CMake配置时，添加`-DCMAKE_EXPORT_COMPILE_COMMANDS=ON`选项即可。

**Bear**：一个通用的工具，通过拦截`make`或其他构建命令的编译器调用来生成数据库。

**Clang** 自身：编译时使用`-MJ`参数可以为每个源文件生成一个JSON片段，再将它们合并起来。

**Bazel**：需使用第三方工具，如`hedronvision/bazel-compile-commands-extractor`。

一般来说，最常用的是CMake，而且这厮还带了一个效率贼高的Ninja-Build，所以就它了。

## vscode的clangd插件的配置

VSCode的`clangd`插件是在启动进程时，通过**命令行参数（CLI Arguments）**将配置传递给`clangd`服务：
- 过程：VSCode 启动时，会读取`settings.json`中的`clangd.arguments`数组。
- 执行：它在后台拉起`clangd.exe`（或Linux下的`clangd`）时，实际执行的命令类似：
  `clangd --compile-commands-dir=build/msys2-to-win --query-driver=/usr/bin/gcc ...`
- 这种方式的本质：是实时注入，不改动磁盘上的任何配置文件。

# 所以该怎么排布这些文件

从开发者的角度看，工程是多变的，环境是迟钝的；

从工程的角度来看，对环境的需求是不变的；

|文件|位置|远程/本地|作用|
|----|----|-------|----|
|`config.yaml`|`%LocalAppData%`或`~/.config`|本地|设定基础的警告习惯、最常用的编译器|
|`.clangd`|项目根目录|远程|配置仅与项目密切相关且与本地无关的编译情景|
|`settings.json`|项目`.vscode/`|本地|配置项目中与本地密切相关的场景|
|`CMakePresets.json`|项目根目录|远程|一般来说是配置场景|
|`CMakeUserPresets.json`|项目根目录|本地|`inhert`Preset之后，主要是本地的build环境|
|`compile_commands.json`|项目`build*`|本地|CMake生成的对`clangd`最好消化的配置文件|

# 附录

## `clangd`这个tag为什么全小写

查阅了[clangd的网站](https://clangd.llvm.org/)，没有任何迹象表明创作者希望`clangd`首字母大写，尤其是：

> clangd is based on the Clang C++ compiler, and is part of the LLVM project.

当`clangd`与`Clang`同行出现时，前者不大写而后者大写；

根据“名从主人”原则，`clangd`的`c`不应该大写。

--------------------------

Knighthana

2026/04/20
