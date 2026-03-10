---
title: 迁移WSL文件到其他位置
date: 2026-03-10 23:27:00
updated: 2026-03-10 23:59:59
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
tags:
  - WSL
  - WSL2
  - Windows
---

# 迁移WSL文件到其他位置

其实迁移WSL的事情咱已经干了好几遍了，不过呢，这事确实不经常干，等到要用的时候又手生。

几次之后，我决定还是记录一下迁移WSL的前前后后。

## 用WSL2而不是WSL1

由于WSL1和WSL2虽然文件存在形式不同，但在迁移方面的操作都是通过WSL管理器完成的，

很早之前在单位的Win11电脑上通过WSL2装了个Debian，工作起来还是很舒畅的，因此对WSL2改观不少，

另一方面，我在WSL1上遇到过一些奇奇怪怪的问题，这些问题也有一部分是WSL1特殊的形制导致的；

所以后面迁移家里的WSL的时候也就没那么抵触情绪了；

虽然我很欣赏WSL1处理Win与Lin系统关系“融合”的风格，但是务实一点地说，在WSL1被放弃支持的现在，用WSL2做事更合适一些，所以以后主要还是在WSL2上工作。

通过
```powershell
wsl --set-default-version 2
```
将WSL管理器设置为默认操作WSL2，这样从商店下载安装新的WSL时，会变成WSL2

通过
```powershell
wsl --set-version Ubuntu 2
```
（这里用`Ubuntu`举例，事实上这里要把名字换成WSL管理器内`wsl -l -v`看到的名字），可以将特定的WSL换成指定的版本

### 清理WSL2的硬盘

对了，WSL2的虚拟硬盘机制导致其对物理硬盘光进不吐很讨厌，比起WSL1实在是吃相难看，这里顺便记录一下怎么整理硬盘，安全起见最好是备份后再这么干。

1. 在WSL的内部执行`sudo fstrim /`，这原本是用于对SSD进行Trim的命令，不过对于WSL2来说，是让它把用不到的地方腾开的意思；这一步其实可以展开说说，WSL的Linux内核会将TRIM信号传给Hyper-V虚拟化层，Hyper-V会负责对虚拟磁盘文件内块的标记工作；

2. 退出WSL虚拟机，并在powershell中执行`wsl --shutdown`通过WSL管理器关闭正在运行的WSL；

3. 继续在powershell中运行`diskpart`，如果powershell不是管理员身份打开的，这一步会请求管理员权限，输入账号密码之后会打开一个新的cmd窗口容纳`diskpart`；

4. 执行`select vdisk file="<vhdx文件\的\路径>"`

5. 执行`attach vdisk readonly`

6. 执行`compact vdisk`，这一步需要很长的时间；

7. 执行`detach vdisk`，随后`exit`

另一个方案是使用`Optimize-VHD`，部分系统上可能没有这个指令，那就只能用上面的`diskpart`，

不过我查询了一下我的系统上有，用`Optimize-VHD`的方法是（需要管理员权限）
```powershell
Optimize-VHD -Path "<vhdx文件\的\路径>" -Mode Full
```

默认情况下，Debian的磁盘位置在`%appdata%/../Local/Packages/TheDebianProject.DebianGNULinux_76v4gfsz19hv4/LocalState`

所以是
```powershell
Optimize-VHD -Path C:\Users\Knighthana\AppData\Local\Packages\TheDebianProject.DebianGNULinux_76v4gfsz19hv4\LocalState\ext4.vhdx -Mode Full
```

不过这玩意需要关掉WSL才能使用，反正我遇到的情况是这样的。

## WSL的分步安装

我不喜欢22.04以后的Ubuntu，就因为它把Firefox迁移到Snap体系中，而我不喜欢Snap这个概念和推广它的形式。

因此尽管我保留了老的Ubuntu虚拟机并会不断地升级它以保证软件包正常工作，但宁愿转移以后的工作到其他发行版上去。

之前其他博客提到过，我在物理硬盘上选择了LinuxMint，它拥有许多优点，是离开Ubuntu之后的一个好去处。

不过对于WSL虚拟机，由于省去了很多图形界面方面的问题，因此直接上Debian会很简单省事。

这次是用一个全新的Debian WSL进行测试的。

在从商店下载了Debian之后，我注意到一个很有趣的现象，那就是，Debian出现在了开始菜单中，却没有出现在WSL管理器中。

![ThereisntDebianinWSLManager](/img/2026-03-10_213711_There_isnt_Debian_in_WSL_Manager.png)

![DebianappearsinStartMenu](/img/2026-03-10_213739_Debian_appears_in_StartMenu.png)

这样[wsl --install --no-launch does not install the distro](https://github.com/microsoft/WSL/issues/10646)的问题也有人遇到过，很巧的是他的想法和我差不多，我们都想搞一个“封包提起来就走”的WSL，我是想在安装前就给它迁移到D盘去，不过WSL的机制似乎并没有被设计为允许这么干。

那还是老老实实先等它安装到C盘，然后我们再迁移吧。

点击开始菜单中的`Debian`，这会启动`Debian/WSL`的自动安装过程。

```bash
Installing, this may take a few minutes...
Please create a default UNIX user account. The username does not need to match your Windows username.
For more information visit: https://aka.ms/wslusers
Enter new UNIX username: Knighthana
New password:
Retype new password:
passwd: password updated successfully
usermod: no changes
Installation successful!
User account already exists, skipping creation
Knighthana@KNIGHTHANA-DESKTOP:~$
```

安装大功告成！不过由于WSL的一些特性，需要提前做一些准备：
```bash
echo -e "[user]\ndefault=<用户名>" | sudo tee -a /etc/wsl.conf
```
比如：`echo -e "[user]\ndefault=Knighthana" | sudo tee -a /etc/wsl.conf`

另外，如果要改镜像源的话也最好现在做完，虽然默认官方源用的是`http`，但考虑到信息安全问题，还需要安装对`https`镜像源的支持。
```bash
apt install apt-transport-https ca-certificates
```

然后切换到国内的镜像源，最好更新一下，不再赘述。顺便一提，`debian`可以在日常的`upgrade`过程中完成小版本更新，不用做额外的设置。

一切完成后，Ctrl-D关掉`Debian/WSL`以便开始迁移工作。

打开PowerShell，首先用`wsl -l -v`确认各虚拟机工作状态，如果需要迁移的Debian虚拟机还没关机，则用
```powershell
wsl --terminate "<发行版名称>"
```
以关闭它，比如`wsl --terminate Debian`

## 导出

WSL管理器带有导出WSL虚拟机的功能，只需要通过
```powershell
wsl --export "<发行版名称>" "<导出/文件/路径.tar>"
```
就可以进行导出工作，比如`wsl --export Debian D:\backup\WSL\Debian_wsl_202603102327_backup.tar`

导出的Debian只有 *296MiB* 453MiB，可以说很精简了。（我就跑了一个`sudo apt update && sudo apt dist-upgrade && sudo apt autoremove`，明明提示占用空间变小了，鬼知道为什么打包之后变大了，介意的就别更新了直接打包吧）

注意，进行导出操作期间，WSL中某些机制可能会修改**全体**运行中的WSL虚拟机的部分`/proc`信息，所以其他正在工作中的虚拟机内可能出现奇怪的问题；

待到`tar`文件创建完成后，虚拟机算是安全了，只要这个备份在手，就能随时还原。

## 注销

导出操作更像是备份，原本的虚拟机还在工作，如果是为了快照，那么这一步就足够了。

不过我们的工作是迁移，所以需要继续，下一步是注销，既是为了腾出地方，也是为了留出名字的空间，WSL是不允许注册重名的虚拟机的。

注销操作会彻底删除掉当前虚拟机的一切，如果没有备份的话，这一步会从计算机上彻底抹除掉任何原来虚拟机的痕迹。

通过
```powershell
wsl --unregister "<发行版名称>"
```
来注销虚拟机。

验证一下，`C:\Users\Knighthana\AppData\Local\Packages\TheDebianProject.DebianGNULinux_76v4gfsz19hv4`目录只有40KiB大小了。

## 导入

导入这一步，可以自定义虚拟机的名称、位置、版本。可以说是很自由了。

通过
```powershell
wsl --import "<虚拟机命名>" "<指定\虚拟\硬盘\存放\位置>" "<先前\导出\备份\路径>" --version "<版本号>"
```

而我需要用的是`wsl --import Debian D:\SoftwareData\DebianWSL D:\backup\wsl\Debian_wsl_202603102327_backup.tar --version 2`

等待虚拟机导入。

## 大功告成

通过系统菜单进入刚刚创建的`Debian`虚拟机，可以发现一切如旧，完成！撒花！

## 附录

### 关于DEB822

“**`DEB822`**”是Debian系在较新系统上推出的标准，也是正在发展的方向。我之前在LinuxMint上就已经在使用这个`DEB822`了，不过当时并没有意识到它其实是一个新标准。

这个标准并不复杂，简单来说就是将源从原来的`/etc/apt/sources.list`迁移到`/etc/apt/sources.list.d`，当然文件内容也有所变动，一般来说镜像源网站会提供本镜像源所需的`debian.sources`文件；

如果没有提供的话，离线情况下可以在`/usr/share/doc/apt/examples/debian.sources`找到参考文件，照猫画虎即可，镜像源也是从官方源拖的文件，因此`Signed-By`什么的都基本不用修改。

如果系统提供了自动化脚本`apt modernize-sources`，那么可以直接将传统的`sources.list`转换为DEB822的`debian.sources`；

如果系统没有提供，那么这一步也可以手动操作，不必担心弄坏东西，只需要删掉旧的`list`文件，添加新的`sources`文件就可以了；

而且，`apt`允许传统方式与`DEB822`方式两者的文件同时存在，`apt`每次运行的时候都会扫描这些涉及到的目录；另外，由于`apt`工作的方式是把所有配置文件内容汇总后一起处理，因此无法预测源的先后顺序，不要在这里放冲突的配置条目；

### 关于导入后用户变成了`root`

上面说过……

> 安装大功告成！不过由于WSL的一些特性，需要提前做一些准备：

```bash
echo -e "[user]\ndefault=<用户名>" | sudo tee -a /etc/wsl.conf
```

> 比如：`echo -e "[user]\ndefault=Knighthana" | sudo tee -a /etc/wsl.conf`

WSL导出导入之后就是会有这样的问题，究其原因，是第一次打开WSL创建用户时，有很多注册表里面的操作系统代为完成了，

注销时这些信息被删掉了，而再次导入时系统不会代劳这些事，

因此需要用这个补丁——`/etc/wsl.conf`中的`[user]`，来解决问题；

虽然我觉得这办法也挺好的，以后再次导出导入的时候也不用再处理这些登录用户设定之类的问题了，一劳永逸；

如果嫌丑，可以这么做：

#### 确定Linux用户的UID

打开需要操作的WSL系统，用
```bash
id -u <用户名>
```
或是翻找`/etc/passwd`来确认自己的`uid`

一般来说创建的第一个普通用户的`uid`都是`1000`

#### 确定发行版的注册名称

在Win中执行
```powershell
wsl -l -v
```

记住对应的发行版虚拟机在WSL中注册的名称

#### 寻找注册表键值

在Windows注册表中寻找
```
计算机\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Lxss\
```

里的条目，翻找所有名字为`{GUID}`的条目，通过每个条目的`DistributionName`找到对应发行版的条目，

定位其中的`DefaultUid`键，如果没有这个键，以`DWORD(32位)`格式创建名称为`DefaultUid`的键；

#### 修改

将Linux中找到的`uid`填入Windows注册表中的`DefaultUid`键。

重启对应的WSL虚拟机

`wsl --terminate Debian`关闭

再启动；

-------------------------------

Knighthana

2026/03/11
