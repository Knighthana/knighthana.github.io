---
title: 重新配Linux环境痛苦的经历
date: 2023-04-01 00:00:00
updated: 2024-11-05 00:00:00
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
tags:
  - Linux
  - Windows
  - Fedora
  - Ubuntu
  - Ruby
  - gems
  - OpenSSL
  - NVIDIA
  - Blog
  - fcitx5
  - font
  - vscode
  - LinuxMint
---

# 重新配Linux环境，痛苦的经历

**含有情绪输出**

## Linux&Windows双系统 系统时钟

当Linux操作系统和Windows操作系统在同一个主板上工作时，会出现系统时钟不一致的情况（除非身处格林威治时区）；

为了不要让它们把系统时钟改来改去打架，必须统一它们对系统时间的读写方式；

Linux会把主板时间识别且修改为UTC，然后根据时区设置给出一个加减小时之后的软时钟；

Windows会把主板时间识别为本地时间，如果身处东八区的话，那么BIOS时间就被认为，且会被修改成UTC+8；

无意评价这两种方法的优劣，根据习惯修改Linux控制时间同步的方式

```bash
sudo timedatectl set-local-rtc 1
```

这样会让Linux将BIOS时间识别并修改成本地时间

## 不要使用包管理器安装需要调用gem的Ruby

在Linux下，包管理器一般只能以root级别的权限运行，这导致下载安装的文件的所有者是root，虽然一般来说，这些文件被设置为了 rwx_r-x_r-x，所以即便不是root用户，也可以读取并执行，而那些被程序读写的文件在用户目录，所以作为用户并没有觉得异样。

但是以root权限安装的Ruby附带的gem包管理器的目录也会被写成root权限。

所以最好的方式是安装rbenv，并且设置好在gitee的rbenv镜像访问插件，在安装了rbenv之后，按照说明修改shell的rc文件并重新启动shell，之后以
```bash
rbenv install -l
```
列出可用版本的表单，最后用
```bash
rbenv install ${version}
```
安装ruby，设定了
```bash
rbenv global ${version}
```
之后，这个gem才是要使用的ruby gems。

## gem的源设定命令

教程里一般都写的是
```bash
gem sources -r xxx.xxx.xxx/ -a xxx.xxx.xxx/
```
，注意，`-r`参数里的每个字符都必须一致，也就是说移除官方镜像的语句中，末尾的`/`是必须的，因为gem的`source`或者`sources`命令使用严格检查，即便是一个斜杠符号也必须和原记录中的一致，语句才有意义，执行才会有效。

## OpenSSL的编译与安装

明确目的“为什么要编译安装这个东西？”，以及明确“为什么我使用的操作系统没有提供”

如果答案是，

> 需要解决某种依赖问题，操作系统提供最新的ssl版本过于老旧不能解决依赖。

那么问题不能通过编译OpenSSL解决，**需要换个操作系统**。

OpenSSL的官方网站上提供源码下载，因此可以自己编译。

我的建议是注意阅读说明文件`INSTALL.md`

首先，编译OpenSSL需要几个前置的包，这些都写在README的前半部分，务必在将前置需求安装完毕之后再开始下一步。

然后需要对系统进行检查，系统中是否已经安装有OpenSSL

如果答案是“是”，那么通过
```bash
openssl version
```
检查版本，如果发现是1.x.x.?，那么接下来需要对配置文件做一些修改，以便将OpenSSL安装到其他位置。按照README的说明修改源码中对应的文件，在启动配置程序之前添加对应的行。

下面把原文贴出来，懒得翻译了，善用ctrl+F,或者vim的`/`功能，在`INSTALL.md`里面查找这一段，顺便看看前后的其他注意事项

> To install OpenSSL to a different location (for example into your home
directory for testing purposes) run `Configure` as shown in the following
examples.
>
> The options `--prefix` and `--openssldir` are explained in further detail in
[Directories](#directories) below, and the values used here are mere examples.
>
> On Unix:
>
>     $ ./Configure --prefix=/opt/openssl --openssldir=/usr/local/ssl
>
> On OpenVMS:
>
>     $ perl Configure --prefix=PROGRAM:[INSTALLS] --openssldir=SYS$MANAGER:[OPENSSL]
>
> Note: if you do add options to the configuration command, please make sure
> you've read more than just this Quick Start, such as relevant `NOTES-*` files,
> the options outline below, as configuration options may change the outcome
> in otherwise unexpected ways.

如果是没有安装OpenSSL，虽然多少有点奇怪，但是应该可以继续。如果已经安装了OpenSSL3，那么没理由非要去编译源码并安装，各发行版应当已经针对之前的CVE进行过修复，通过包管理系统更新即可。

之后没什么复杂的，

```bash
./Configure
```

```bash
./make
```

注意，编译完成之后，需要

```bash
./make test
```

以便对编译结果进行检查，检查时会输出详细的说明。

其中有一步需要连接`example.com`，视网络情况，这一步可能会提示出错，如果是连接问题造成的报错，大可以忽略；

最后检查所有提示的错误，核对数目，然后判断这些错误是什么情况，视情况决定下一步采取何种行动。

最后是安装，一般来说是
```bash
make install
```

## ruby的编译安装

通过rbenv安装ruby，实际上是使用源码进行了编译安装，即便配置好国内的镜像源，也有可能需要耗费很长的时间等待编译的结果，以及处理报错和重新开始编译。

编译ruby的其他依赖，`build-essential`提供了大部分，`bison`需要自己安装，`libyaml`也需要自己安装，可能还有其他包，这些会有变动，最好去查询官方文档。

新版本(3.x.x)的ruby需要OpenSSL3才可以进行编译，如果系统中的库是OpenSSL1，那么除了大量的warning以外，还会提示在一个头文件处有类型错误。

如果看到一个关于`*.h`文件的报错，说明安装程序很大概率是调用了OpenSSL1的库。

一般来说这是因为`libssl-dev`的版本仍然在1导致的，如果已经安装了3，请卸载`libssl-dev`包，并解决掉已经崩掉的库的问题，之后再进行尝试。

## Dummy Deb Package

包`equivs`一般不会默认安装，我建议你装一个——虽然我不建议你在任何除了它原本的调试用途以外的情况下使用它。

`equivs`具有的一个功能是根据一个control文本文件生成一个"dummy deb package"，它可以欺骗`dpkg`包管理系统——让后者做除了报告依赖条件不满足以外的事情。

它原本仅仅用来调试，不过在紧急情况下可以用来救场，例如用于修复网络连接，然后把系统中的某些开机才能转移的数据转移出去。

之后我建议重置这台机器的操作系统。

虽然包管理器这个破软件很dummy很stupid，但终究还是离不开它，我们不可能每次都自己处理所有的更新问题，引入一个dummy package令包管理器不正常地工作，就是埋下了一颗不定时炸弹，那么之后不知道哪天就会在哪里爆炸。

## Nvidia显卡驱动的安装

自己安装Nvidia驱动的体验一般都不会很好。最好的方式是继续使用`noveun`——如果对CUDA没有那么强烈的需求的话，或者使用驱动支持做得很好的发行版，或者使用一个一开始不带有图形界面的发行版，这样先装驱动后装桌面体验会好得多。

好的方面是，一般来说，Nvidia提供的Linux驱动基本后续再也不会更新，所以你的折磨只有一次。

一般装驱动都是去Nvidia网站下载一份run文件，注意型号务必对应，选择型号前先看一下选择列表的其他部分有没有可能会出现更符合你想要做的选择。

安装前记得先去`/etc/modprobe.d/`添加blacklist黑名单文件，禁用noveun驱动——或者也可以不做这步，Nvidia驱动安装程序会帮你建立——那时候你得手动重启一遍。

另外还需要修改grub文件，在`/etc/default/grub`中的`GRUB_CMDLINE_LINUX_DEFAULT=`后面添加`blacklist=nouveau`，并且
```bash
update-grub2
```
，接着
```bash
update-initramfs-u
```
更新内核启动映像。

重启前查看一下run文件的位置，如果放在了一个中文目录里面，记得把它移到方便用命令行找到的位置——我在准备重启的前一秒想到了这件事，然后在`~/下载`里面找到了`run`文件

假如恰巧还没来得及安装zsh并装上oh-my-zsh插件的话，那么依靠bash那羸弱的自动补全功能，是不可能在TTY的一堆方块里面进入无论是`桌面`还是`下载`的

（这是我很讨厌各大桌面环境的一点，擅作主张用本地化名称命名一些关键目录，关于用户目录下面的固定用途文件夹怎么命名，怎么在图形系统里面做映射，Windows给出的优秀示范已经那么多年了，Linux几大桌面环境到现在抄都不会抄，是他们中没有CJK使用者， 还是他们从来不用终端？）

之后进入TTY模式，以root权限运行Nvidia提供的run文件，一切顺利的话，会出现进度条，之后会询问一些问题，我只遇到两个问题，一个是"32-bit compatibility libraries"，32位兼容库，如果不是明确要用这个库就不要装，复杂的系统造就复杂的问题，“update your x configuration so that nvidia x driver will be used when you restart x”这个务必允许选择yes，以便x系统调用安装好的驱动，我没有遇到其他人说的“register the module with DKMS”，这个一般来说不选yes而要选择no，虽然显卡驱动的确是内核的一个module，而且随内核更新自动编译安装驱动听起来很美好，但我们都知道这套系统有多骨感，况且稳定的发行版一般没事很少换内核，如果某天更新之后发现系统换了内核的话，就去下载一个最新的Nvidia驱动，再手动安装一遍

重启，输入
```bash
nvidia-smi
```
，如果一切正常，那么应当会看到一份详细的驱动和显卡情况说明

## Fedora的protected packages

Fedora的一些发行类型，针对某些包设有保护，正常情况下它会保护一些至关重要的包应用，例如grub2。

然而我们也会看到，Fedora的Workstation会将gnome-shell也一并保护，
```bash
dnf remove gnome-shell
```
的时候拒绝卸载这个包，提示"protected package"。

对了，看到这里的时候我的建议是先把gnome完整地装回去，因为一会要用到。

这时候急功近利的办法是使用Fedora的包管理器`dnf`进行操作，swap掉fedora-identity-workstation，换成无论fedora-identity-basic或者server或者别的什么，然后
```bash
groupremove gnome-desktop
```
，就可以顺利地卸载掉gnome了，我是在TTY模式下运行这条命令的，因此并没有注意到是不是和有些人说的一样，把X卸载掉了。

换桌面环境这种事，Linux做的并不好。虽然Linux在安装新桌面方面非常容易，但是在卸载旧桌面方面，那复杂的 bloody 依赖关系 performs so ugly.

因此最好是换掉整个系统——从一开始就选择心仪图形界面的版本。

顺带提一下，KDE能够做到在登录期间SDDM识别显卡正常输出画面，而KDE本体不识别显卡，对单显示器输出800×600分辨率。八年前我对KDE在性能方面的评价就很糟，一年两年前对其在其他方面的评价也是 just soso，*现在我的评论是它就像它登录管理器的名字一样，SD*。

## `/etc/passwd` `/etc/shadow` `/etc/group`

原本的`/etc/passwd`如其名是用来存储密码的地方，然而后来它能够管理账户的特点，以及人人皆可读取的特点导致它变成了一个专门用于用户管理的文件，密码管理功能迁移到了`/etc/shadow`

尽管`passwd`文件中的`x`表示密码移动到了其他位置，但即便在`/etc/passwd`中`x`所在的位置写入密码，目前的操作系统基本也不会尝试读取`passwd`这里的密码；

`/etc/shadow`的密码存储方式是散列函数加盐，

用户名称冒号后面，前两个美元符号之间的内容描述散列方式，例如Fedora使用的`$y$`，这是指yescrpt；

Ubuntu系基本采用`$6$`，这是SHA-512散列函数，接下来一个美元符号前的内容是盐，后面的内容就是密码的单向映射结果；

有可能遇到`$5$`，这个是SHA-256；

一定不会遇到的是`$1$`，这是MD5；

如何生成一个密码？有可能很容易想到`openssl sha512`，但是这是没必要的；

直接
```bash
mkpasswd --method=SHA-512
```
即可，它会自动为你生成一个加随机盐的符合条件的密码，将结果直接填入`/etc/shadow`；

于是就绕过了Fedora的密码字典检查（但是这有何意义呢）

`/etc/group`用来进行组管理，不过一般组管理很少需要手动修改；

## Ubuntu 22.04的Snap

简单介绍一下snap，据官方所称，这是一个能够“将包与运行环境隔离，可独立运行在各大发行版中的分发系统运行环境”。

我对它做一个简单的介绍，snap是一个强行端上你的桌子，用于无视镜像设置，拖慢你`apt update`速度，让你的`apt upgrade`偶尔失败，让firefox浏览器变得糟糕透顶、失去文件读写能力，无法支持输入法的 slum，just piece of ....

关于如何安装非snap版本的firefox已经有很多教程了，主要分为

1. 使用Mozilla的firefox小组提供的PPA源安装deb、

2. 自行从源码编译安装、

3. 使用Flatpak版

三个流派。我的建议是，人生苦短，放弃它——放弃snap，还有顺便放弃ubuntu下的firefox，如果他继续执迷不悟的话

我觉得日常使用的交互型软件中提供输入法支持是对CJK地区人民的基本尊重，如果做不到这点，我很难对这样的软件给出什么好话，它所有的宣传都很noisy

此外，snap商店提供了slack的支持，然而它也不支持输入法，这让我对snap唯一一点可能的好印象也没了。

无论是snap，还是Ubuntu Pro推送，都让我对这个曾经的主要使用习惯所在的发行版的最新版本失望透顶。

我当然知道snapd是可以卸载的，但是既然这是Canonical上赶着要推送给你的东西，把它卸载了，就能解决其它的和将来的问题吗？

这也是我在上面的折腾浪费了一天的时间的前提下，又在晚上一度重新安装了Ubuntu server 22.04、Xubuntu 22.04并且使用了一段时间后，却最终决定不再使用这个发行版的原因。

## Ubuntu的“内部问题”

“内部问题”是Ubuntu系列经久不衰的保留项目，是Ubuntu的传统艺能；

部分内部问题窗口带有详情按钮，这时可以查看到底是哪些软件包导致的问题，要么解决问题，要么解决造成问题的包（

对于没有提示的情况，建议手动打开`/var/crash/`浏览错误日志查明情况，一一予以解决，以及不要忘记删掉这些文件，或者把它们挪到别的地方；

## Ubuntu Server

在安装Ubuntu Server之前，我认为它和Debian一样，是一个不带图形界面的Ubuntu。

其实并非如此，例如Debian比起Ubuntu来说就要**稳健**地多，从另一个方面来讲，就是**老旧**得多。

那么，其实Ubuntu Server必然也和Ubuntu Desktop是不一样的，这些待会再说，先说说Ubuntu Server独有的优点。

首先，Ubuntu Server有一个值得称道的功能，它允许你在安装之前设定镜像源，而且并不是给一个列表让你选择，而是URL的每个字符都可以自己决定，这样可以使用不在它列表上的自定义近距高速镜像源。

我很喜欢这项功能，它允许我在安装期间将系统更新到最新状态，而不是安装完成之后先手动设定`apt`的`sources.list`再跑一遍`apt update && apt upgrade`等进度条慢慢走完。

安装过程也比较友好——我把它与安装Arch的经历对比了一下，这真的已经很友好了。

Ubuntu server安装设定中的一步会提供选择，是否安装并启用`sshd`，这是个很好的功能，省掉了安装之后的一堆麻烦；

不过此时的我不需要这功能，所以选择了否。

然后这时我开始第一次思考这个问题，server版和desktop版的操作系统到底有何区别？

整个安装过程非常快，比这几天所有其他经历的安装过程都要快，我粗略估计进度条一共跑了不到两分钟。

需要留意的是，安装完毕之后不会自动重新启动，显示`subiquity/late/run`，然后就不动了，需要手动在下方选择reboot并确认；

重启之后，server用起来还是很不错的。

不过当我在桌面环境上的虚拟终端里又跑了几次apt之后，看着更新结束时提示的“no service need to restart” “no device need to...”一类的提示，我又在想那个问题，

server版和desktop版的操作系统到底有何区别？

答案就是，server版是为server环境调校的，desktop是为desktop环境调校的；

这是一句正确的废话，于是我也意识到之前的行为是废行为，

它们可能本质上没有区别，无外乎预装的软件包不一样，预定的设置不一样，但如果这些不一样和预期用途不一致，是需要花费时间调整的，时间并非一文不值，

遂卸载ubuntu server，尽管我对它赞不绝口

## 如有可能，不要在Linux上折腾桌面

转向Xubuntu，在图形界面上，Xubuntu并不能挑出任何毛病，想要用哪个桌面，最好一开始就使用带有这个桌面的版本，而不是想着之后调整，因为在Linux下面，桌面环境安装方便，卸载很难，

问题不出在Xubuntu上，而是出在Ubuntu上，如上文所说，我不喜欢别人强行让我接受什么东西，说得再好也不行，

在试用了一会Xubuntu后最终弃用这整个发行版

## LinuxMint上的新开始，美好，暂时的

正如`Ubuntu`是源自`Debian`的一个发行版一样，`LinuxMint`是源自`Ubuntu`的一个发行版。

我对这个发行版的接触很少，唯一的印象是八到九年前的试用，我对它的`Cinnamon`有点印象。但它太平凡，太普通，以至于我一直没有想起来。

### 我的需求到底是什么

在昨天浪费一天时间之后，晚饭前难得的平静时间内，我思考了一下自己到底在干什么，我的需求是什么？

一套标准的C编译环境，所有的Linux Desktop都可以提供，顺带一提，基本所有的Linux Desktop也基本都能提供`git`，这样版本管理问题也解决了；

一套较好的C编辑环境，一般来说有`vim`算是勉强满足要求，所有的Linux基本都能提供`vim`；但最好是有`vscode`一类比较方便的编辑器，这样的话范围就被限制了，也就是说我需要一个`Xorg`；

*(其实`vscode`支持远程使用，比如部署在服务器上并通过`ssh`工作，但是我目前并是单机工作，所以无法以这种方式使用)*

图形化浏览器和较好的网络环境支持，虽然`w3m`算是“浏览器”，但肯定不会是我在敲代码途中想要用的那个，这增强了对Xorg的需求；我还需要较好的网络环境支持功能，这又把范围进一步缩小了；

输入法，如果要查询东西，这个是必须的，进一步地，不仅要提供输入法，还要足够好用，至少要能在浏览器里面使用；

国内的即时通讯软件？不是很需要的样子；

办公软件？不需要，如果有文档需要处理，那么我就重启计算机去使用Windows10；虽然我很支持`LibreOffice`套件，它还有`QtiPlot`曾经和我度过了一段艰难但是快乐的时光；

*(以及QtiPlot的最新版好像开始收费了？)*

绘画？同上，重启换系统解决问题；不过似乎`GIMP`也能支持的样子，但我还没试过；

听音乐？不得不承认这个很有诱惑力，但我想了一下， 我只是需要让Linux挂载一下Windows的硬盘，读一下NTFS分区里面的文件而已，况且此外的需求还有网易云来填补——虽然曲库不太全，不过还有浏览器来填补剩下的需求；虽然Linux的音频管理做的很糟——调整声音振幅什么的居然有可以感觉得到的延迟；

我需要一套灵活的Python环境，因为接下来可能会用到，不过Linux下的Python支持不错，有`venv`，还有`anaconda`，虽然我对这个还从未使用过的商业软件在Linux下面会跑成什么样子没有底；但即便最坏的情况也还有Docker可用；

我需要一套ruby on rail的环境，在我搞出一套编译器出来之前，需要它帮我完成一些不太好办的事情；

一个`yacc`，估计很快就要用到，虽然Windows下面可以通过`msys`、`cygwin`(这也是我很喜欢的一个软件)，还有我比较喜欢的`wsl1`实现，但在Linux下面使用显然更好；

一套GoLang开发环境，估计可能过段时间就要用到，我查询了一下，Linux下面是可以进行Go开发的；

一套熟悉的包管理系统——可以是`apt`或者`pacman`，因为下午用了一会Fedora的`yum/dnf`，感觉浑身不自在，习惯的力量还是太强大了；

最好提供`xfce4`支持，也可以是`lxde`，反正我不喜欢Gnome，因为需要花很多时间卸载它而且卸不干净，尽管它和xfce一样也源自gtk+；

我也不喜欢KDE，它真的从来没有给我留下过任何好印象，很难想象WebKit和KDE曾经有一段过去；

(`gnome`和`kde`对我来说主要问题还是浪费资源严重，可定制化程度太低，即便`gnome`和`kde`目前是为数不多的支持wayland的玩意)

镜像支持，在几个我能访问到的高速镜像站有可用的镜像，最好不要附带一些莫名其妙、东一榔头西一棒槌的用不了镜像且会卡死进度条的怪东西；不过这也意味着不可能选择BSD，FreeBSD在国内的镜像支持是有的，而且我也很佩服那些坚持做镜像源的志愿者们，我曾经和他们有过一些关于镜像问题的邮件交流，他们给我留下了非常深刻的印象，但是终究，Linux的源更多更快，而且我目前还能用到百兆的Linux源，并不是很愿意使用其他操作系统——这并不是这些操作系统本身的原因；

于是在折腾完Ubuntu Server和Xubuntu之后，我又重新考虑了一下我的需求，这些需求虽然很刁钻，但也不是特别难办，我还是有选择的，那就是多年前接触过且没有给我留下印象的LinuxMint；

首先，习惯方面，Debian同一系的包管理——主要是包命名方式，这符合“apt或者pacman”的要求；源自Ubuntu还意味着丰富的软件包支持——当然没有Arch的AUR那么夸张；

高速镜像，这个正好是有的；而且只需要配一个Mint源，其它的几个可以直接用Ubuntu源；

没有`snap`，好耶！

Xorg和`xfce4`支持，都具备；

甚至有NVIDIA专有显卡驱动支持；

输入法支持，除了某些没有镜像源而且硬要端给别人的怪东西之外，正常的X桌面环境都有虽然不完善但是基本可以使用的输入法支持；

那还等什么，赶快下载LinuxMint-xfce4，然后录写制作启动U盘，重启准备开始安装过程；在Grub2页面，我留意到这里有四个选项，启动，以兼容模式启动，OEM安装，内存测试——和其他几个发行版相比多出来一个兼容模式

### 有惊无险的安装过程

小众同时意味着惊喜不断，LiveCD的界面里我的鼠标就卡死了，我不太确定这是输入设备支持的问题，还是系统的问题，看了右下角的时钟过去了一分钟还没有变化，多半是卡死了，这LiveCD真的让人很难相信系统的品质，但我觉得没必要这里就放弃，因为这一天已经经历过够多了，于是重启了一下，选择了`(compatibility mode)`，这次的LiveCD除了因为显卡驱动没有加载导致图形界面有点难看，以及在某几个页面点击“下一步”更换页面时让人担忧的短暂无响应之外，倒也是顺利地安装完毕了，最后提示拔掉安装介质按下ENTER以重新启动；

### 让人逐渐喜欢的使用体验

安装完毕之后，随着EFI定制的BIOS页面启动画面转动，一切正常，令人有些担心的是lightdm出现之前有一个短暂的TTY登录提示输入用户名和密码，但是它很快就被跳过了，在进入桌面之后这些担忧就烟消云散了

看起来是经过定制的xfce4，简单改了一下多显示器位置的设定，这套桌面其他的地方都比较精美，我仅仅修改默认面板设置使其自动隐藏腾出桌面地方，在副屏的角落处增加了用来随时看日期时间的半透明小面板，看起来基本没有什么需要改动的地方了；

登入后自动弹出的向导窗口让我选择了喜欢的色彩主题，然后向我介绍了如何使用自带的软件，以及面板里几个图标的功能，这个挺让人喜欢的；

按照向导的介绍，我启用了Timeshift的功能，它会产生snapshot，虽然名字里带有“snap”，不过它要讨人喜欢得多，如Timeshift的名字所示，它是一个系统快照+还原软件，可以在系统被搞得一团糟的情况下恢复系统，对于Linux这种十分依赖集中型包管理的操作系统是很提效的功能；虽然更有效的是使用习惯，但有时候没那么多选择；

以及向导会提供图形化的驱动安装引导界面，由于Ubuntu能够从Nvidia获取匹配的闭源驱动，因此在Mint下也可以非常方便地使用它们，直接在图形界面下安装驱动并做完所有配置；这是很多发行版做不到的事情；

安装了一下常用的软件，夜已经深了，回顾了一下一整天的经历，假如一开始就下定决心而不是在20.04的基础上修修补补，最终捅了个关于OpenSSL的大篓子导致整套网络栈近乎报销，也许会省下许多时间，但问题最终的解决方案也并不是一开始就浮上水面的，事实上直到深夜之前，我都没有想到过Mint其实是正好满足一切需求的发行版；有时候就是需要这样一个灵感，然而灵感的产生也并不是那么随心所欲的；

### Fcitx5同时需要gtk2和gtk3

要想让Fcitx5正常工作，`fcitx5-frontend-gtk2`和`fcitx5-frontend-gtk3`这两个包是同时被需要的，不能只装一个；

### vscode的颜色设置

上一次配vscode还是很久之前的事情

我也不太想登录账号让它自动同步设置，因为我在三个环境下同时使用vscode，Windows，WSL，LinuxMint，已知Windows和WSL的配置是独立存在的，但后两者之间不太确定

json中的`"workbench.colorCustomizations"`条目就是设置位置了，

```json
"statusBar.noFolderBackgroud"
```
是非打开文件夹情况下状态栏的颜色，我不是很喜欢那个紫色，我认为紫色太醒目，所以改成了深蓝色

```json
"statusBar.backgroud"
```
是打开文件夹情况下的颜色，直接设成`#1874CD`

```json
"statusBar.debuggingBackgroud"
```
是调试代码期间状态栏的颜色，可以凭喜好随意设定，不要太刺眼就行

### 一些繁杂的经历和一些不太愉快的经历

Linux的字体支持很糟糕，这不完全是Linux的原因——这个世界上有很多人守着字体这棵摇钱树；

作为一个个人用户，我对那些不感兴趣，我只关心怎么好看好用，首先搞到几家大公司一起弄出来促进互联网发展的思源黑体(sans，无衬线)和思源宋体(serif，有衬线)，这套字体是开源允许任意使用的，然后是微软的Cascadia开源字体，它包含了对等宽的支持，接下来通过其他手段搞到其他字体文件，比如Consolas之类的；

(4月2日更新：关于字体配置可以去看[Linux字体美化实战(Fontconfig配置)](http://www.jinbuguo.com/gui/linux_fontconfig.html)，这篇文章写得更专业，更全面，我参照文章删掉了原本安装的CJK字体中不需要的几个，顺带一提这网站作者真是个非常硬核的人)

一般来说，Linux下有两种字体，一类是OpenType，一般以otf为扩展名，一类是TrueType，一般以TTF和TTC为扩展名，将它们放到`/usr/share/fonts`对应的字体文件夹里，然后`fc-cache -fv`更新字体缓存

只有等宽字体才可以被终端一类的程序使用，虽然CJK类文字天生就是等宽的，但是思源黑体和思源宋体没有把自己声明为等宽字体(也许是因为西文部分不等宽)，所以终端方面还是得使用`noto`，`cascadia`，`consolas`一类的等宽字体

此外，字体一定要装完整，不要只装一半，不然本来某些程序读不到字体会用替代品版正常地显示，但假如读到原本要用的字体"font family"中的同类(但不是本体)，它有些许可能会选择使用(并非总是，有一个优先级问题)，于是粗细正斜也许会对不上，这会导致显示效果更糟糕；

例如firefox在渲染网页时就有可能会出现这样的问题，另外vscode没有读到合适的等宽字体就会使用系统默认的mono字体设定，说实话自带字体那个显示效果只能说是非常糟糕且糟糕透顶，我的建议是搞到其他字体文件并且根据这些字体去修改vscode的字体集使用设定(Preference->Fonts)；

以及运行没多久，mint的xfce就带来了两次鼠标卡死而其他操作——比如键盘操作——正常的小BUG，所幸通过切换窗口焦点、通过终端`kill`掉对应的进程一般都能解决问题；

最后是虚拟终端字形渲染问题，几乎所有虚拟终端都采用了同样的`vte`库，据称[这个库导致了字体行高异常的问题](https://gitlab.gnome.org/GNOME/vte/-/issues/347)，目前尚不太清楚后续的情况，但是就使用体验而言是还没解决，不知道他们打算什么时候修；

2024年11月4日追补更新：在更新了Mint22之后，我发现这个问题仍然存在，于是打算重新解决这件事，经过一波搜索，发现这个问题在今年发布的某个CSDN的博客中也提到了：[【Ubuntu 22.04】解决Ubuntu 22.04终端行距过大的问题](https://blog.csdn.net/xuzhengzhe/article/details/136156834)，这位作者也同样没有找到解决的办法，但是他使用另一个方法绕过了这个问题：

1. 通过命令`locale`检查当前的语言环境，如果发现`LC_CTYPE`为`zh_CN.UTF-8`，那么虚拟终端中的间距异常现象可能就与此项设定有关；

2. 在确认问题与`LC_CTYPE`存在关联之后，修改`/etc/default/locale`，在其中指定`LC_CTYPE="en_US.UTF-8"`；

3. 重启计算机，以便设置生效；

> 根据从其他地方找到的解释，`LC_CTYPE`指定的是“字符分类”
> 
> 总之，我检查了本地的设定，确实存在这样的问题，并且这样操作之后，的确可以解决字符间距异常（其它地方的社区讨论结果认定间距只是表象，故障实质是字体高度异常）的问题，而且终端也可以正常地显示中文；
>
> 然而，在被修改的`/etc/default/locale`的开头写着`#  File generated by update-locale`，因此这样以修改一个自动配置文件的方式达成目的，其实也是有某天突然被恢复成原样的风险的

顺带一提，还有一个不影响使用的小毛病

mint-xfce自带的`lightdm`无法通过常规方式调整显示器的位置，这也是dm的通病，它们基本都是一个单独的用户，而普通用户对桌面的修改只在自己的文件夹中生效。

Gnome可以通过将Gnome系统的`monitors.xml`文件拷贝到gdm用户的目录下使之生效

但xfce与lightdm的组合，暂时没找到比较好的办法。

gentoo wiki给出了一个创建与修改`/etc/xorg/xorg.conf.d/`中文件的方式调整xorg对显示器的识别方式，过程中需要用到`xrandr`工具检查图形输出，尤其是显示器输出的名称，

我也查找了xorg.conf的manual手册，也许是我看着资料写的`40-monitor.conf`中

```conf
Section "Device"
    Identifier "NVIDIA-VIDEO-CARD"
    Option "Monitor-HDMI-0" "MonitorA"
    Option "Monitor-DP-0" "MonitorB"
EndSection

Section "Monitor"
    Option "MonitorA"
EndSection

Section "Monitor"
    Identifier "MonitorB"
    Option  "RightOf" "MonitorA"
EndSection
```

哪里出了问题，总之，xorg并没有在lightdm中正确地排布我的显示器位置。

暂时算是平稳地装完了系统，可以开始享受纯Linux的开发了。

thunar挂在硬盘的不可预知权限 (05-15更新)

thunar这个东西，挂载磁盘完全靠玄学，有时候是读写模式挂载，有时候是只读模式挂载

说实话我只希望它稳定一点，不要每次都在摸奖

## Keep Dissing snap craft

继续炮轰snap craft

snap在整个世界都只有一个软件商店，全指望你Canonical一家的网络资源进行软件包下载，你端得起这么大的盘子吗？

如果说为了所谓的“跨平台移植性”，那为什么不选择同样支持跨平台移植性并且更加开放的flatpak呢？

Knighthana

2023/04/01 Pub

2023/04/13 Edited

2024/11/05 再次增补
