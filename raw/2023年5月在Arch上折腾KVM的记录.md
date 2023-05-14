---
title: 2023年4月在LinuxMint上安装Docker
date: 2023-05-11 21:16:00
updated: 2023-05-14 22:00:00
cover: /img/Cover-Docker.png
categories:
  - Dev-Env
tags: 
  - ArchLinux
  - KVM
  - 2023
---

# 2023年5月在Arch上折腾KVM的记录

突(tū)发(rán)奇(fàn)想(bìng)打算折腾一下KVM

决定一作死到底(bushi)，直接用ArchLinux来安装KVM(为什么不用Manjaro？好问题)

那么还得复习一下ArchLinux的安装流程，边做边查

因为是做实验，所以就在VirtualBox上进行了

首先用浏览器打开Arch Wiki关于[KVM](https://wiki.archlinux.org/title/KVM)的介绍，放在旁边备用

## 第一步核验本机的虚拟化技术支持情况

KVM需要芯片带有虚拟化技术支持，因此必须先验证机器支不支持虚拟化技术

使用命令
```bash
LC_ALL=C lscpu | grep Virtualization
```
核验本机的虚拟化技术支持情况

> If nothing is displayed after running either command, then your processor does not support hardware virtualization, and you will not be able to use KVM.

![CPU_Virtual]()

如果出现如图所示的情况，那么就是支持虚拟化技术

## 核验内核是否支持KVM模块

检查必要的模块是否可用
```bash
zgrep CONFIG_KVM /proc/config.gz
```

> The module is available only if it is set to either y or m.

基本上需要确认`kvm`、`kvm_amd`、`kvm_intel`三个选项都是`y`或者`m`

检查这些模块是否自动加载
```bash
lsmod | grep kvm
```

这一步什么都没有显示，我突然意识到，操作系统还没有安装，那没法查啊

所以先进入操作系统安装流程

## 安装ArchLinux

若干年前安装Arch的时候还要照着贴吧的教程一步一步来

今非昔比，我们直接用原始材料

[ArchLinux Installation Guide](https://wiki.archlinux.org/title/installation_guide)

[ArchLinux安装指南](https://wiki.archlinuxcn.org/wiki/%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97)

如果发生了任何错误，都可以通过重新加载archiso，进入`arch-chroot`解决，所以不必慌乱

### 前略

获取安装映像 验证签名 准备安装介质 启动到 Live 环境 控制台键盘布局

几个步骤因为各自不同的原因略去

### 验证引导模式 检查网络连接 更新系统时间

要验证引导模式，请用下列命令行出 efivars 目录：

```bash
ls /sys/firmware/efi/efivars
```

> 如果命令结果显示了目录且没有报告错误，则系统以 UEFI 模式引导。 如果目录不存在，则系统可能以 BIOS 模式 (或 CSM 模式) 引导。如果系统未以您想要的模式引导启动，请参考您的主板说明书。

要在 Live 环境中配置网络连接，请跟随以下步骤：

使用
```bash
ip link
```
检查系统是否启用了网络接口

对于VirtualBox虚拟机来说，是不用操心这些事情的，至于其他情况如下

以太网——连接网线

Wirless-LAN——使用`iwctl`验证并连接无线网络

移动宽带调制解调器——使用`mmcli`连接到移动网络

获取IP地址：

对于局域网中带有DHCP服务器的情况，不需要操心这个问题

手动配置IP的情况参考[IP地址](https://wiki.archlinuxcn.org/wiki/%E7%BD%91%E7%BB%9C%E9%85%8D%E7%BD%AE#%E9%9D%99%E6%80%81_IP_%E5%9C%B0%E5%9D%80)

用 ping 检查网络连接：

```bash
ping archlinuxcn.org
```

使用
```bash
timedatectl status
```
确保系统时间是准确的，例如ssl协议等需要准确的时间才能使用

### 格式化硬盘

在
[创建硬盘分区](https://wiki.archlinuxcn.org/wiki/%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97#%E5%BB%BA%E7%AB%8B%E7%A1%AC%E7%9B%98%E5%88%86%E5%8C%BA)
提到使用
```bash
fdisk
```

我不太确认fdisk是否支持GPT分区

虽然据称

> fdisk (link to manual); note: fdisk from linux-utils 2.30.2 partially understands GPT now

[Should I use fdisk for partitioning or GPT aware tools?](https://unix.stackexchange.com/a/340913)

但我还是不太愿意冒这个风险，

另外，工具[parted](https://man7.org/linux/man-pages/man8/parted.8.html) [parted](https://wiki.archlinuxcn.org/wiki/Parted)也提供了GPT的分区功能

但感觉这个工具的包装做的不是很好，泄露的东西太多

比较符合传统操作习惯的是[gdisk](https://wiki.archlinuxcn.org/wiki/GPT_fdisk)

和`fdisk`类似，它也有一个友好界面版本`cgdisk`

于是，我使用
```bash
cgdisk
```
作为本次的磁盘分区工具

#### the secondary header's self-pointer indicates that it doesn't reside at the end of the disk

这个虚拟磁盘经过扩容，但其中的GPT分区表没能认知到这个变化过程

于是`gdisk`中使用`v`，或者直接运行`cgdisk`，就会提示

> the secondary header's self-pointer indicates that it doesn't reside at the end of the disk

[rebuilding GPT on cloned disk](https://gist.github.com/TuvianNavy/ad993eae707c8ddd3d59349708fee9ce)

从`bash`中运行`gdisk`打开磁盘分区工具

然后输入`x`回车，进入专家模式

*(疑惑：在主界面杵那么多东西，你跟我说主界面不是“专家模式”？)*

然后输入`e`回车执行重映射，

再输入`v`回车检查

一般来说到这一步问题就解决了，最后记得`w`回车向硬盘写入更改

#### there is a gap between the main partition table (ending sector 33)and the first usable sector

然而我遇到了问题，那就是使用`v`检查之后，提示

> There is a gap between the main partition table (ending sector 33)and the first usable sector

根据提示，在专家模式输入`j`回车，

再次回车，输入默认设置，

这时候再次使用`v`回车检查硬盘情况，会发现一切良好

于是`w`回车，将更改写入磁盘，并进入下一步

#### 开始分区

在处理完硬盘的一些glitch之后，准备开始分区工作

我的虚拟机只有一块SATA硬盘，因此使用

```bash
cgdisk /dev/sda
```

进入友好的GPT硬盘分区界面

左右方向键选择下方的功能

上下方向键选择分区

用上下方向键选中`free space` （对于一个空硬盘，可以略过此步，因为默认所有空间都是`free space`）

用左右方向键选择下面的`[  New  ]`创建新的分区，起始位置按照默认，直接回车，

第二步会询问

> `Size in sectors or {KMGTP}`

这个“KMGTP”的意思其实就是传统的单位

由于EFI特有的对启动分区的格式要求，我们得留一个FAT32分区给它用作ESP(EFI system partition)

注意，手册中有提示

> 如果要启动的磁盘已经有一个EFI系统分区，不要新建 EFI 分区，请使用现有的分区。

但这是虚拟机，当然没有，所以得自己新建

那么这一步输入

```fdisk
512Mi
```
回车确认

之后会询问分区的类型

查询[Partition type](https://wiki.archlinuxcn.org/wiki/GPT_fdisk#Partition_type)

可知，应该输入`ef00`回车，将其设置为EFI分区

如此这般，分出一个512MiB的分区留给EFI

然后在下方的`free space`里面再`[  New  ]`一个分区，起始位置默认，大小默认（会使用所有剩余的空间），类型默认（默认是`8300`，也可以手动指定为`8304`，这样的话只能用来挂载根目录）

因为这是虚拟机，我没有留SWAP分区，如果需要的话，可以建立一个需要大小的，类型为`8200`的分区

这样的话硬盘里的分区们就做好了

不放心的话，可以用`[  Verify  ]`检查一下，应该会提示

> No problems found.

如果之前有些步骤做错了，可以通过`[  Delete  ]`删掉分区重做

如果只是类型设置错误，可以通过`[  Type  ]`修改

那就可以了，使用`[  Write  ]`向硬盘写入更改

这一步是危险操作，会有所提示，不过既然之前检查之后没什么问题，那就继续

比如我执行到这一步的时候看起来是这样的

![CGDISK]()

请注意，分区表上、下方留出空白的未使用空间是正常现象，不要想着全榨干净

右侧的`Partition Name`列中的字符串只是标识符，可以自己在下方用`[ naMe  ]`定义，留空也没有影响，我为了辨识方便做了一些标记

最后使用`[  Quit  ]`退出`cgdisk`

那么硬盘上往分区表里面要写入的内容完毕了，下来是建立文件系统。

#### 建立文件系统

经过上面的步骤之后，硬盘内应当会有一些分区

使用
```bash
ls /dev/
```
检查目前的情况，不出意外的话，硬盘相关的应该是`sda` `sda1` `sda2`三个条目，其中`sda1`是`sda`上的首个主分区，之后会把ESP放到这个分区里

`sda2`是`sda`上的第二个分区，之后会将主要的文件系统放在这里

但它们现在还不能使用，得往里面建立文件系统

```bash
mkfs.fat -F 32 /dev/sda1
```

稍候片刻，一个为ESP而建立的FAT32文件系统就建立在`sda1`中了

然后

```bash
mkfs.ext4 /dev/sda2
```

稍候片刻，一个ext4文件系统就建立在硬盘分区`sda2`中了

### 挂载

挂载这一步比较迷惑，因为在广泛使用UEFI的今天，并不清楚应该把ESP挂在哪里 是`/boot`或`/EFI/`或`/boot/EFI`还是别的什么玩意

查了一圈，各有各的说法

我决定遵循这个回答[What is the difference between /boot and /boot/efi, do I need both partitions?](https://www.reddit.com/r/linux4noobs/comments/mqf7kp/what_is_the_difference_between_boot_and_bootefi/)

> Although this is old, there are some incorrect points here.
>
> Most distros mount EFI System Partition (esp) on /boot/efi . This means the efi folder in /boot is a partition. /boot is just a folder in your root / partition.
>
> /boot/efi is FAT32 filesystem (as neccessary for esp ) and /boot is probably ext4 in this case.
>
> Arch linux doesn't care if esp is /boot or /boot/efi
>
> But that isn't the case for other distros ( mainly debian and its deivatives).
>
> If your using only arch, there's nothing wrong with esp in /boot
>
> If you are mult-booting or has debian based ones then use /boot/efi as esp

那么，在ext4中建立`/boot`，然后把FAT32挂载到`/boot/efi`中看起来是一个比较稳妥的方案

```bash
mount /dev/sda2 /mnt
```

```bash
cd /mnt
mkdir boot
cd boot
mkdir EFI
```

```bash
mount /dev/sda1 /mnt/boot/EFI
```

这样的话应该就挂载完毕了

对于需要swap分区的情况，请参考[挂载分区](https://wiki.archlinuxcn.org/wiki/%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97#%E6%8C%82%E8%BD%BD%E5%88%86%E5%8C%BA)

### 为ArchLinux设置镜像源 并 安装必需的软件包

```bash
vim /etc/pacman.d/mirrorlist
```

然后遵照自己使用的镜像源的说明添加对应的URL项目
注意，务必添加在其他`Server`项目的前面，这样优先级更高

之后
```bash
pacman -Syy
```

可以更新一下缓存，虽然由于我们正在使用archiso做不做都行，但还是做一下，检查一下自己的镜像设置有没有写错什么的

![]()

带宽跑满，看来没写错，进入下一步

执行
```bash
pacstrap -K /mnt base linux linux-firmware
```
安装`base`软件包、Linux内核、固件

这个K参数的意思是

> Initialize an empty pacman keyring in the target (implies -G).

由于是虚拟机，所以“可以不执行固件安装”，但管他呢，全打进去，以及vim什么的趁手的软件都带上，最后回车！

*一共121个软件包，设置好软件源非常重要*

### fstab

使用
```bash
genfstab -U /mnt >> /mnt/etc/fstab
```
为在`/mnt`中的操作系统生成需要的`fstab`信息

注意使用`>>`，因为`NEWOSROOT/etc/fstab`（比如现在是`/mnt/etc/fstab`）是一个已经存在的文件，我们需要的是在它的后面增补信息，而不是全抹掉写新的

使用
```bash
vim /mnt/etc/fstab
```
查看生成的`fstab`文件是否有问题

我们记得硬盘上设置了两个分区，每个分区挂载在不同的目录中，因此这个文件中应该有两个条目，一条是`/dev/sda1`，另一条是`/dev/sda2`

![]()

这样应该就算是写入正确了

注意，这是最后一步在archiso操作系统中的操作，接下来会转移到新的操作系统中，所以还有什么要做的都得赶紧咯

### 换目录

```bash
arch-chroot /mnt
```

于是我们进入了新的操作系统

*之前几步忘了给新的操作系统安装zsh，于是暂时没有zsh用了，淦！*

### 时区

中国是亚洲上海时区，因此这一步输入

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

勤用TAB自动补全，也避免输错。

然后
```bash
hwclock --systohc
```

生成`/etc/adjtime`

设置完时区之后，应该可以顺便安装点程序，我在这一步之后安装了`vim`

### 本地化

编辑`/etc/locale.gen`文件，取消掉需要使用的本地化前面的注释，其中`en_US.UTF-8 UTF-8`是必须去掉注释的

那么我就照做，把`en_US.UTF-8 UTF-8`前的注释去掉

再去掉`zh_CN.UTF-8 UTF-8`前的注释，顺便去掉了`ru_RU.UTF-8 UTF-8` `ja_JP.UTF-8 UTF-8`前的注释

按照推荐，

> 也可以设置为 en_GB.UTF-8 或 en_SG.UTF-8，附带以下优点：
>
> - 进入桌面环境后以 24 小时制显示时间；
>
> - LibreOffice 等办公软件的纸张尺寸会默认为 A4 而非 Letter(US)；
>
> - 可尽量避免不必要且可能造成处理麻烦的英制单位。

就把英国和新加坡的英语本地化一并开启，它们同属英语，应该不会额外占用太多空间

执行
```bash
locale-gen
```
生成locale信息

```bash
vim /etc/locale.conf
```

添加
```bash
LANG=en_SG.UTF-8
```

### 网络配置

#### hostname

在

```bash
/etc/hostname
```

中写上主机名

#### 安装网络管理器

坑爹的官方安装教程对这里是一点没提，网络配置里面也写得含糊其辞，但是这一步很重要

通过
```bash
pacman -S networkmanager
```
安装[网络管理器](https://wiki.archlinuxcn.org/wiki/%E7%BD%91%E7%BB%9C%E9%85%8D%E7%BD%AE#%E7%BD%91%E7%BB%9C%E7%AE%A1%E7%90%86%E5%99%A8)

**必须安装！**

等待它安装完毕

这是一个守护进程，但是我们目前在`chroot`模式下，因此只能在重启机器，以`systemd`启动后，才能为它设置启动项

### ROOT用户自己的密码

```bash
passwd
```

这一步很重要，务必记得修改root密码

### 用户管理

[用户和用户组](https://wiki.archlinuxcn.org/wiki/%E7%94%A8%E6%88%B7%E5%92%8C%E7%94%A8%E6%88%B7%E7%BB%84)

虽然安装页面中没有提，但是安装期间最好还是为自己建立一个用户，避免日常使用root用户

```bash
useradd -m -s "/bin/zsh" "username"
```

由于没有通过`-G`指定用户所在的组，因此会为用户单独创建一个组

如果这是第一个用户，那么uid和gid应该都是1000

虽然`sudo`不是用户管理的一部分，但是`sudo`是一个很重要的工具，一并安装

```bash
pacman -S sudo
```

使用
```bash
visudo
```
以便打开配置文件`/etc/sudoers`，修改文件，在保存前`visudo`会检查格式是否正常

顺便把其他杂七杂八要用的工具，例如网络连接实用程序、git一类的也一起装上并配置好，免得待会手忙脚乱，安全起见，shell有关的成功开机之后再配

### 安装引导程序 一般来说是GRUB

[GRUB](https://wiki.archlinuxcn.org/zh-hans/GRUB)

首先把工具安装上：

```bash
pacman -S grub efibootmgr
```

然后让grub去做剩下的工作

```bash
grub-install --target=x86_64-efi --efi-directory=/boot/EFI --bootloader-id=GRUB
```

如无意外，提示

> Installation finished. No error reported

安装就成功了

[如果遇到问题，查看 UEFI 故障排查](https://wiki.archlinuxcn.org/zh-hans/GRUB#UEFI_%E5%BC%82%E5%B8%B8)

接下来是配置

#### 配置GRUB

使用
```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

来生成配置文件

当启动的内核发生变化，比如安装了新的内核之后，就需要更新这个文件，也就是重新运行`grub-mkconfig`

#### 探测其他操作系统

有这个可行性，参考[探测其他操作系统](https://wiki.archlinuxcn.org/zh-hans/GRUB#%E6%8E%A2%E6%B5%8B%E5%85%B6%E4%BB%96%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F)

但目前虚拟机中不需要

### 安装完成

在配置好GRUB之后，ArchLinux的安装就算是完成了，退出chroot，关机

```bash
exit
poweroff
```

弹出虚拟光盘，重启一下试试能否正常引导

如果发生了任何错误，都可以通过重新加载archiso，进入`arch-chroot`解决，所以不必慌乱

### 进入系统

先检查一下shell、文件系统有无故障

如无意外，系统此时是连不上网的

#### 启动网络管理器

一般来说，在带有DHCP的环境中，照顾好自己计算机系统的网络配置就可以了

启动服务进程

```bash
sudo systemctl restart NetworkManager
```

注意大小写

用
```bash
ping
```
工具检查网络管理器是否正常工作，例如`ping www.sina.com`

如果没有回应，换一个网站再试试

如果有回应，说明网络管理器工作正常，那么将网络管理器添加进入开机启动项

```bash
sudo systemctl enable NetworkManager
```

注意大小写

至此，ArchLinux安装完毕

## 安装KVM

继续之前KVM安装前的检查部分

```bash
zgrep CONFIG_KVM /proc/config.gz
```

```bash
lsmod | grep kvm
```

检查到的结果发现，模块没有加载，那么就需要[手动加载这些模块](https://wiki.archlinuxcn.org/wiki/Kernel_modules#%E6%89%8B%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%97%B6%E8%AE%BE%E7%BD%AE)

但我偏不这么做，我要让系统自动加载

```bash
sudo vim /etc/modules-load.d/kvm-init.conf
```

输入以下内容：
```conf
# Load KVM modules at boot 2023/05/12
kvm_intel
kvmgt
mdev
vfio
kvm
irqbypass
```

`:wq`退出，`reboot`重启

启动时有一行标红报错一闪而过，不过我并没有注意到，其实那是

> failed to start load kernel modules

开机之后，按照教程的说法，检查内核模块加载的情况

```bash
lsmod | grep kvm
```

会发现没有`kvm_intel`选项，下方的说法提到

> 提示：如果 `modprobe kvm_intel` 或 `kvm_amd` 失败，但 `modprobe kvm` 成功，并且 `lscpu` 声称支持硬件加速，检查 `BIOS` 设置。某些厂商，特别是笔记本电脑厂商，默认禁用这些处理器扩展。`modprobe` 失败后，`dmesg` 的输出可以告诉你这些扩展是硬件不支持还是在 BIOS 中禁用。

使用
```bash
sudo dmesg | grep kvm
```
之后，会发现提示`kvm_intel : vmx not supported by cpu 0`

然而，根据VirtualBox管理页面的显示，我的虚拟计算机是启用了`VT-x`硬件加速的，VBox BIOS中也并没有类似的选项

这期间我在互联网上找了很多东西，都没有满意的答案，事情陷入了困局

注意到，VBox的管理页面有一个选项叫“启用嵌套 VT-x/AMD-V”(Nested Virtualization)，这个选项是灰色的，默认不可选，考虑到主页提示过“VT-x已经启用”，也许使用这个选项是没有必要的？

无论如何试试看

### 启用VirtualBox的嵌套VT-x/AMD-V

首先关闭虚拟计算机

参考[VirtualBox启用套嵌VT-x/AMD-V](https://apad.pro/virtualbox-win-vt-x-amd-v/)

我的解决方案是，在Windows中打开`Powershell`

```powershell
cd 'C:\Program Files\Oracle\VirtualBox\'
.\VBoxManage.exe list vms
```

得到输出
```powershell
........................
"ArchLinux" {e2f0d5f5-bd01-401b-9ffd-3d63b597061b}
........................
```

然后对其进行修改
```powershell
.\VBoxManage.exe modifyvm "ArchLinux" --nested-hw-virt on
```

然后退出PowerShell

### 检查KVM内核模块情况

这次启动虚拟计算机，就没有任何内核模块加载失败的提示了

进入界面，输入
```bash
lsmod | grep kvm
```
提示
```bash
kvmgt        479232  0
mdev          24576  1 kvmgt
vfio          61440  2 kvmgt,vfio_iommu_type1
i915        3837952  1 kvmgt
kvm_intel    458752  0
kvm         1327104  2 kvmgt,kvm_intel
irqbypass     16384  1 kvm
```

可以看到`kvm_intel`已经正确加载，问题得以解决

```bash
egrep -o 'vmx | svm' /proc/cpuinfo | wc -l
```

显示的数值不再等于0

OK！准备下一步

## 添加ArchLinuxCN社区源（可以不做）

这一步和今天的主题没啥关系，但是我得记录一下，以备之后的维护

```bash
sudo vim /etc/pacman.conf
```

我使用了本校的源，但是我校的开源镜像站并不对外部网络连接开放，那么文章里写本校源不是很好

当然，Arch Linux CN的源原本就在国内，所以用最上流的源也很合适
或者可以用清华TUNA源，地址是[Tuna: Arch Linux CN 软件仓库镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/archlinuxcn/)

```conf
[archlinuxcn]
Server = https://repo.archlinuxcn.org/$arch
```

```bash
sudo pacman -Sy
sudo pacman -S archlinuxcn-keyring
```

## GUI？ or not？

这一步我犹豫了一下，因为Linux的GUI那个安装管理使用实在是一言难尽，而且现在是在做实验，引入不必要的部分可能会带来“unforeseen consequences”，比如已经可以预见到显卡驱动全崩，需要在640x480的分辨率下去不知道哪个目录里面装卸驱动的惨状了

不过GUI确实会方便监视系统和虚拟计算机的运行状况，所以还是装吧

说实话我想给这一步的系统打个快照，但是目前的情况似乎不太允许

用什么呢？

虽然我很讨厌KDE，但我考虑要不要在这台虚拟机里使用`KDE`，或者避免`KDE`和`Gnome44`中的任何一个，去用`MATE`，要不然就是继续用`xfce4`，这也是我最熟悉的桌面环境

还是试试MATE吧

```bash
sudo pacman -Syy
sudo pacman -S --needed xorg
sudo pacman -S xorg-xinit
sudo pacman -S mate mate-extra
```

```bash
cd ~
vim .xinitrc
```

```rc
exec mate-session
```

`:wq`

测试一下
```bash
startx
```

肉眼可见地卡卡的，考虑到我只分配了2核心2GiB内存，显存只有16MiB的情况，还是去VBox里把显存调到支持的上限，128MiB吧，内存也加到8GiB，毕竟要跑图形界面

情况稍微有所改善

退出桌面，目前暂时还不需要图形环境

在菜单栏中寻找“登出”，也就是`logout`，将用户从MATE登出，即可关闭图形界面

## 安装QEMU

参考[QEMU/KVM 虚拟化环境的搭建与使用](https://thiscute.world/posts/qemu-kvm-usage/)

```bash
sudo pacman -Syy
sudo pacman -S qemu-full virt-manager virt-viewer dnsmasq vde2 bridge-utils openbsd-netcat
```

```bash
sudo pacman -S libguestfs
```

### 启动守护进程

启用`libvirtd`守护进程

```bash
sudo systemctl enable libvirtd.service
sudo systemctl start libvirtd.service
```

### 修改配置文件，组管理

```bash
sudo vim /etc/libvirt/libvirtd.conf
```

查找
```conf
unix_sock_group="libvirt"
unix_sock_rw_perms="0770"
```
去掉注释，使之生效

回到终端，进行组管理
```bash
sudo newgrp libvirt
sudo usermod -aG libvirt $USER
```

如此操作之后，目前正在使用的用户就被加入了一个允许读取socket的用户组`libvirt`中

最后检查一下`/etc/group`文件，确保刚才操作中的更改没有出错

```bash
vim /etc/group
```

找到`libvirt`用户组，参考[用户组文件](http://c.biancheng.net/view/841.html)，和[用户组](https://wiki.archlinuxcn.org/wiki/%E7%94%A8%E6%88%B7%E5%92%8C%E7%94%A8%E6%88%B7%E7%BB%84#%E7%94%A8%E6%88%B7%E7%BB%84)

一般来说，在`libvirt`这个用户组后面看到自己的用户名，并且其他地方没有预料之外的修改，那就对了

重启`libvirtd`服务

```bash
sudo systemctl restart libvirtd.service
```

### 嵌套虚拟化

就像刚才在VBox中为ArchLinux开启嵌套虚拟化一样

现在需要为Arch带有的KVM启用嵌套虚拟化，方便将来要用的虚拟机使用

```bash
cat /sys/module/kvm_intel/parameters/nested
```

如果提示`Y`，则说明启用了嵌套虚拟化

对于农企U，则是
```bash
cat /sys/module/kvm_amd/parameters/nested
```

我这里提示开启了，真是不枉刚才折腾了半天KVM

如果没有开启，可以查看[启用嵌套虚拟化](https://thiscute.world/posts/qemu-kvm-usage/#3-%E5%90%AF%E7%94%A8%E5%B5%8C%E5%A5%97%E8%99%9A%E6%8B%9F%E5%8C%96)

### 检查虚拟化环境的情况

之前安装了`qemu-full`，和`libvirt`，进图形界面检查一下
```bash
startx
```

![]()

如图，打开这个桌面应用，完成！

## 在KVM中安装Windows XP

为什么要安装Windows XP呢？

因为Windows具有和Linux完全不同的内核

而XP是目前手头能找到的，最简单的Windows操作系统安装映像了

如果需要的话之后试一下Windows 7

### 把镜像搞到虚拟机里面

由于这个ArchLinux刚刚安装完毕，文件拷贝有些不太好办，懒得装VBox的客户工具了（主要是客户工具涉及到内核模块，不想引入额外的复杂度）

用HTTP协议传到虚拟机里面吧

![]()

### 启动GUI下的QEMU

初学KVM，先看看要怎么用这个东西

用起来感觉和VBox没什么不同啊（

![]()

啊，熟悉的界面，爷少回！

![]()

等待安装，已经开始显示汉字了

![]()

关于虚拟计算机的硬件信息

![]()

在磁盘上查找了一下对应的文件，发现所有者是单独的一位用户`libvirt-qemu`，这一点很有意思

以及Windows XP由于缺少驱动的原因是既没声音也没网，就这样吧

如此这般之后，感觉没什么事做了

用又没甚用，卡又卡得慌，毕竟是在VB虚拟机里面的，也不能指望KVM表现出它正常情况下的性能

至于命令行调度虚拟机，用到的时候再说

总之，这个KVM用起来，感觉就是一个普通的虚拟机而已，不可否认，由于获得了来自内核模块的加速支持，它的性能肯定是要强一些的

本以为KVM会是一种单独的操作系统什么的，最后看来并不是这样呢，完全可以理解为一种QEMU的内核级加速(虽然QEMU只是KVM的一种适配形式，但除了QEMU，民用也拿不到别的东西来用了)呢

Knighthana

2023/05/12
