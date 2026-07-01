---
title: Docker入门与Hadoop的部署
date: 2023-05-17 00:00:00
updated: 2023-05-18 00:00:00
cover: /img/Cover-Docker.png
categories:
  - Dev-Env
tags: 
  - LinuxMint
  - Docker
  - Hadoop
  - 2023
---

# Docker入门与初步使用

之前折腾了一次安装`docker`，由于一直没什么用途，也就没有继续探索

现在需要使用`docker`完成另一项任务，因此先探索一下`docker`具体的用法

## 外部链接：其他教程

关于如何使用Docker,有三个教程

网站设在国内的，全中文，十分方便食用的
[Docker 教程 | 菜鸟教程](https://www.runoob.com/docker/docker-tutorial.html)

来自官方的，比较标准的，但是全英文的
[Overview | Docker Documentation](https://docs.docker.com/get-started/)

来自微软的，局限于vscode，但同样方便食用的
[教程：使用 Visual Studio Code 创建 Docker 应用](https://learn.microsoft.com/zh-cn/visualstudio/docker/tutorials/docker-tutorial?WT.mc_id=vscode_docker_aka_getstartedwithdocker)

BTW: 检测到环境中安装有Docker之后，vscode会自动提醒可以安装Docker插件

## 安装Docker

关于
[安装Docker](https://knighthana.github.io/Dev-Env/2023%E5%B9%B44%E6%9C%88%E5%9C%A8LinuxMint%E4%B8%8A%E5%AE%89%E8%A3%85Docker.html)
的博客，我在之前写过，因此不再赘述

这篇博客中还提到了`docker-ce`的权限与用户组设置（以便以普通用户而不是超级用户的身份使用docker），`docker`的镜像设置

## 什么是映像，什么是容器？

如
[Docker objects](https://docs.docker.com/get-started/overview/#docker-objects)
所言

> 映像是创建容器的指导性文件，只读，之后行文的时候可能也会写作“镜像”
>
> 容器是运行中的映像实例，有一个自己的读写文件系统

通过阅读这段文字，我可以认为，映像是程序，容器是进程

## 下载第一个映像

有一篇很有趣的小文章讲了一下常见映像的大小
[Minideb: A Minimalist, Debian-Based Docker Image](https://dzone.com/articles/minideb-a-minimalist-debian-based-docker-image)
，最有趣的是，Python在冗余方面从来不负众望

虽然教程给的是centos，但是我对`yum`或者说`dnf`的一套东西不太熟悉，我更加熟悉的是debian系的`apt`和arch系的`pacman`，所以本教程就用debian映像进行之后的操作了

通过
```bash
docker pull debian
```
将会下载第一个映像

下载速度取决于镜像站设置，或者是否对这段网络连接进行了“加速处理”

下载完毕之后，会看到明显的提示

可以手动检查一下，输入
```bash
docker image ls -a
```

可以看到以下输出：
```bash
➜  ~ docker image ls -a
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
debian        latest    34b4fa67dc04   2 weeks ago     124MB
hello-world   latest    feb5d9fea6a5   20 months ago   13.3kB
```

其中的`debian`就是刚刚下载的映像了，可以发现它的大小只有124MiB，甚至远远小于`debain-11.7.0-amd64-netinst.iso`的389MiB

下面的`hello-world`是之前向世界宣布我们的`docker-ce`安装成功时自动下载来的映像，由于只有13Ki大，我打算留着它

## 进容器瞧瞧看看

此时，通过运行

```bash
docker run -it debian /bin/bash
```

就会使用`debian`映像创建一个容器、进入容器、并且调用`bash`作为交互界面

由于之前下载过程的反馈提示中说下载了“最新版本”的Debian映像，我很好奇这究竟是哪个版本，那么不妨检查一下

常见的`lsb_release`或`debian_version`命令并没有打包在映像中，不过可以通过
```bash
cat /etc/os-release
```
来查看系统信息

```bash
root@da62261bc436:~# cat /etc/os-release 
PRETTY_NAME="Debian GNU/Linux 11 (bullseye)"
NAME="Debian GNU/Linux"
VERSION_ID="11"
VERSION="11 (bullseye)"
VERSION_CODENAME=bullseye
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

不出所料，是“bullseye”，也就是“牛眼”版本

再看看都预装了什么软件包：

<details>
<summary>Debian的Docker映像中预装软件包列表</summary>
<pre>
<code class="lang-bash">

root@da62261bc436:/etc/apt# apt list | grep installed

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

adduser/now 3.118 all [installed,local]
apt/now 2.2.4 amd64 [installed,local]
base-files/now 11.1+deb11u7 amd64 [installed,local]
base-passwd/now 3.5.51 amd64 [installed,local]
bash/now 5.1-2+deb11u1 amd64 [installed,local]
bsdutils/now 1:2.36.1-8+deb11u1 amd64 [installed,local]
coreutils/now 8.32-4+b1 amd64 [installed,local]
dash/now 0.5.11+git20200708+dd9ef66-5 amd64 [installed,local]
debconf/now 1.5.77 all [installed,local]
debian-archive-keyring/now 2021.1.1+deb11u1 all [installed,local]
debianutils/now 4.11.2 amd64 [installed,local]
diffutils/now 1:3.7-5 amd64 [installed,local]
dpkg/now 1.20.12 amd64 [installed,local]
e2fsprogs/now 1.46.2-2 amd64 [installed,local]
findutils/now 4.8.0-1 amd64 [installed,local]
gcc-10-base/now 10.2.1-6 amd64 [installed,local]
gcc-9-base/now 9.3.0-22 amd64 [installed,local]
gpgv/now 2.2.27-2+deb11u2 amd64 [installed,local]
grep/now 3.6-1+deb11u1 amd64 [installed,local]
gzip/now 1.10-4+deb11u1 amd64 [installed,local]
hostname/now 3.23 amd64 [installed,local]
init-system-helpers/now 1.60 all [installed,local]
libacl1/now 2.2.53-10 amd64 [installed,local]
libapt-pkg6.0/now 2.2.4 amd64 [installed,local]
libattr1/now 1:2.4.48-6 amd64 [installed,local]
libaudit-common/now 1:3.0-2 all [installed,local]
libaudit1/now 1:3.0-2 amd64 [installed,local]
libblkid1/now 2.36.1-8+deb11u1 amd64 [installed,local]
libbz2-1.0/now 1.0.8-4 amd64 [installed,local]
libc-bin/now 2.31-13+deb11u6 amd64 [installed,local]
libc6/now 2.31-13+deb11u6 amd64 [installed,local]
libcap-ng0/now 0.7.9-2.2+b1 amd64 [installed,local]
libcom-err2/now 1.46.2-2 amd64 [installed,local]
libcrypt1/now 1:4.4.18-4 amd64 [installed,local]
libdb5.3/now 5.3.28+dfsg1-0.8 amd64 [installed,local]
libdebconfclient0/now 0.260 amd64 [installed,local]
libext2fs2/now 1.46.2-2 amd64 [installed,local]
libffi7/now 3.3-6 amd64 [installed,local]
libgcc-s1/now 10.2.1-6 amd64 [installed,local]
libgcrypt20/now 1.8.7-6 amd64 [installed,local]
libgmp10/now 2:6.2.1+dfsg-1+deb11u1 amd64 [installed,local]
libgnutls30/now 3.7.1-5+deb11u3 amd64 [installed,local]
libgpg-error0/now 1.38-2 amd64 [installed,local]
libgssapi-krb5-2/now 1.18.3-6+deb11u3 amd64 [installed,local]
libhogweed6/now 3.7.3-1 amd64 [installed,local]
libidn2-0/now 2.3.0-5 amd64 [installed,local]
libk5crypto3/now 1.18.3-6+deb11u3 amd64 [installed,local]
libkeyutils1/now 1.6.1-2 amd64 [installed,local]
libkrb5-3/now 1.18.3-6+deb11u3 amd64 [installed,local]
libkrb5support0/now 1.18.3-6+deb11u3 amd64 [installed,local]
liblz4-1/now 1.9.3-2 amd64 [installed,local]
liblzma5/now 5.2.5-2.1~deb11u1 amd64 [installed,local]
libmount1/now 2.36.1-8+deb11u1 amd64 [installed,local]
libnettle8/now 3.7.3-1 amd64 [installed,local]
libnsl2/now 1.3.0-2 amd64 [installed,local]
libp11-kit0/now 0.23.22-1 amd64 [installed,local]
libpam-modules-bin/now 1.4.0-9+deb11u1 amd64 [installed,local]
libpam-modules/now 1.4.0-9+deb11u1 amd64 [installed,local]
libpam-runtime/now 1.4.0-9+deb11u1 all [installed,local]
libpam0g/now 1.4.0-9+deb11u1 amd64 [installed,local]
libpcre2-8-0/now 10.36-2+deb11u1 amd64 [installed,local]
libpcre3/now 2:8.39-13 amd64 [installed,local]
libseccomp2/now 2.5.1-1+deb11u1 amd64 [installed,local]
libselinux1/now 3.1-3 amd64 [installed,local]
libsemanage-common/now 3.1-1 all [installed,local]
libsemanage1/now 3.1-1+b2 amd64 [installed,local]
libsepol1/now 3.1-1 amd64 [installed,local]
libsmartcols1/now 2.36.1-8+deb11u1 amd64 [installed,local]
libss2/now 1.46.2-2 amd64 [installed,local]
libssl1.1/now 1.1.1n-0+deb11u4 amd64 [installed,local]
libstdc++6/now 10.2.1-6 amd64 [installed,local]
libsystemd0/now 247.3-7+deb11u2 amd64 [installed,local]
libtasn1-6/now 4.16.0-2+deb11u1 amd64 [installed,local]
libtinfo6/now 6.2+20201114-2+deb11u1 amd64 [installed,local]
libtirpc-common/now 1.3.1-1+deb11u1 all [installed,local]
libtirpc3/now 1.3.1-1+deb11u1 amd64 [installed,local]
libudev1/now 247.3-7+deb11u2 amd64 [installed,local]
libunistring2/now 0.9.10-4 amd64 [installed,local]
libuuid1/now 2.36.1-8+deb11u1 amd64 [installed,local]
libxxhash0/now 0.8.0-2 amd64 [installed,local]
libzstd1/now 1.4.8+dfsg-2.1 amd64 [installed,local]
login/now 1:4.8.1-1 amd64 [installed,local]
logsave/now 1.46.2-2 amd64 [installed,local]
lsb-base/now 11.1.0 all [installed,local]
mawk/now 1.3.4.20200120-2 amd64 [installed,local]
mount/now 2.36.1-8+deb11u1 amd64 [installed,local]
ncurses-base/now 6.2+20201114-2+deb11u1 all [installed,local]
ncurses-bin/now 6.2+20201114-2+deb11u1 amd64 [installed,local]
passwd/now 1:4.8.1-1 amd64 [installed,local]
perl-base/now 5.32.1-4+deb11u2 amd64 [installed,local]
sed/now 4.7-1 amd64 [installed,local]
sysvinit-utils/now 2.96-7+deb11u1 amd64 [installed,local]
tar/now 1.34+dfsg-1 amd64 [installed,local]
tzdata/now 2021a-1+deb11u10 all [installed,local]
util-linux/now 2.36.1-8+deb11u1 amd64 [installed,local]
zlib1g/now 1:1.2.11.dfsg-2+deb11u2 amd64 [installed,local]

</code>
</pre>
</details>

在`-it`，其实也就是`-i -t`模式中的体验，很像之前安装ArchLinux时的`arch-chroot`

## 简单的自定义

由于接下来我们需要进行一些安装，所以得先去修改一下`apt`的镜像站地址

很容易发现，映像为了节约空间，没有安装`vi`、`vim`、`nano`中的任何一个

无论是为了下载安装它们，或者是为了保留映像的tiny特性而不安装文本编辑器，都需要知道如何在只有基本工具的情况下修改`sources.list`文件

```bash
mv /etc/apt/sources.list sources.list.bak
echo -e "deb http://linux.xidian.edu.cn/mirrors/debian/ bullseye main non-free contrib\ndeb http://linux.xidian.edu.cn/mirrors/debian/ bullseye-updates main non-free contrib" | tee /etc/apt/sources.list > /dev/null
```
我使用了西电源，这个源不对外开放，请根据自己的情况修改源

为了换行方便，我使用了`echo -e`，在后面使用了`\n`换行，请适当地予以替换

这里使用了`http`而不是`https`，因为我在学校内网中，并且不想在docker容器中安装`apt-transport-https`和`ca-certificates`

如果网络环境不安全的话，还是应该使用TLS加密的

这里用了一下`tee`是为了方便在中间做一些动作，如果不需要做额外的动作，或者假如映像中连`tee`都没有打包的话，应该可以直接省略关于`tee`的管道命令，用`>`将内容重定向至`/etc/apt/sources.list`

|name|download size|install size|
|----|-------------|------------|
|nano|825KiB|3087KiB|
|vim|8174KiB|36.9MiB|

那么，还是安装一个`nano`吧

然后去修改一下`~/.bashrc`，取消有关颜色的注释、`alias`的注释，修改完之后，还需要在`.bashrc`文件的最上面上面添加单独一行`export SHELL=/bin/bash`，因为我们每次是通过在外面直接`exec /bin/bash`的方式进入容器的，所以这个环境变量目前需要设置在`.bashrc`中

之后如果交互的方式有所变化，我们需要更改这行环境变量`SHELL`修改命令的位置

## 退出容器，重新进入容器

第一次通过`docker run -it`运行的容器，在容器的交互式界面中，平常地使用用`exit`就会退出容器

但是我们不可以再次运行上一个`run`命令以期望进入刚才的容器，因为创建的容器已经是另一个分支了，如果我们此时再次运行`docker run -it debian /bin/bash`就会从`debian`映像上创建另一个全新的容器

先查询刚才在本地创建的容器叫什么

```bash
docker ps -a
```

```bash
➜  ~ docker ps -a
CONTAINER ID   IMAGE     COMMAND       CREATED       STATUS                     PORTS     NAMES
da62261bc436   debian    "/bin/bash"   2 hours ago   Exited (0) 3 minutes ago             distracted_shockley
```

这里提示容器的状态是“已退出”，如何重新运行容器并获取容器的控制呢？

先说运行容器，这个非常简单

通过
```bash
docker start distracted_shockley
```
就会在后台静默启动一个docker容器`distracted_shockley`，此时我们无法直接和它交互

但是此时运行`docker ps`，注意我们并没有附加`-a`选项，就会发现docker报告有一个容器已经启动了

```bash
➜  ~ docker ps   
CONTAINER ID   IMAGE     COMMAND       CREATED       STATUS         PORTS     NAMES
da62261bc436   debian    "/bin/bash"   2 hours ago   Up 4 seconds             distracted_shockley
```

此时要进入容器，还需要做一些选择

### `attach`

对于正在运行中的容器，通过
```bash
docker attach distracted_shockley
```
交互式地返回正在运行中的容器`distracted_shockley`

如果此时在容器中的`bash`里输入命令
```bash
exit
```
并回车，那么容器就会彻底关闭并退出

在宿主机上运行
```bash
docker ps
```
只会看到空空如也的界面

### `exec`

对于正在运行中的容器，通过
```bash
docker exec -it distracted_shockley /bin/bash
```
就可以打开一个新的`bash`进入容器

退出这个`bash`并不会让整个容器停止运行

例如屏幕上的这段显示
```bash
➜  ~ docker exec -it distracted_shockley /bin/bash
root@da62261bc436:/# exit
exit
➜  ~ docker ps
CONTAINER ID   IMAGE     COMMAND       CREATED       STATUS              PORTS     NAMES
da62261bc436   debian    "/bin/bash"   2 hours ago   Up About a minute             distracted_shockley
```

中间虽然通过`exit`退出了容器中的`bash`，但是容器还是运行状态

不难猜到，容器中还有一个`bash`正在运行中，只有通过`attach`的方式才能访问到它

Docker的初步安装与配置到此结束，不难发现，Docker是一个内部“基本完整”的“操作系统”，因此，在谈论“一个容器”的时候，我们知道，这个“容器”里面一定是有操作系统的，虽然被简化了许多

接下来将结合Hadoop进行具体功能使用方面的的探索

# Hadoop的下载与安装

[Apache官方Hadoop稳定版介绍](https://hadoop.apache.org/docs/stable/)

介绍页面说了，对于初学者，请从单机模式开始学习配置，然后再使用集群模式

那么这是有关单机模式Hadoop的[Apache官方的手册文件](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/SingleCluster.html)

最后是[Apache官方的下载地址](https://hadoop.apache.org/releases.html)（访问较慢）或者说去访问[镜像](https://www.apache.org/dyn/closer.cgi/hadoop/common/)，镜像有CDN

*如果彼时的stable还是3.3.5，可以用[这个链接](https://dlcdn.apache.org/hadoop/common/stable/hadoop-3.3.5.tar.gz)*

还有国内的非常方便食用的[Hadoop 教程 | 菜鸟教程](https://www.runoob.com/w3cnote/hadoop-tutorial.html)

现在(2023.05.22)，最新稳定版本的Hadoop是3.3.5

先看着文档一步一步来

## 前置条件

> GNU/Linux is supported as a development and production platform. Hadoop has been demonstrated on GNU/Linux clusters with 2000 nodes.

这没问题，我正在使用LinuxMint，是GNU/Linux

> Required software for Linux include:
>
> Java™ must be installed. Recommended Java versions are described at [HadoopJavaVersions](https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions).
>
> ssh must be installed and sshd must be running to use the Hadoop scripts that manage remote Hadoop daemons if the optional start and stop scripts are to be used. Additionally, it is recommmended that pdsh also be installed for better ssh resource management.

需要`java`的支持和`sshd`的支持，

文档中推荐安装pdsh，我这里提一句，Hadoop会自动检测pdsh的安装与否，如果安装了它就会使用pdsh，除非你清楚pdsh如何配置和使用，否则不要安装pdsh

那就检查一下
[HadoopJavaVersions](https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions)

> Supported Java Versions
>
> Apache Hadoop 3.3 and upper supports Java 8 and Java 11 (runtime only)
>
> Please compile Hadoop with Java 8. Compiling Hadoop with Java 11 is not supported:  HADOOP-16795 - Java 11 compile support Open 
>
> Apache Hadoop from 3.0.x to 3.2.x now supports only Java 8
>
> Apache Hadoop from 2.7.x to 2.10.x support both Java 7 and 8

也就是说只能在openjdk-8编译，对于openjdk-11，只能运行，但不能用于编译

但是注意到这篇文章的日期最后修改日期是2020年10月19日

访问
[Java 11 compile support](https://issues.apache.org/jira/browse/HADOOP-16795)
，发现很多issue已经被标记为solved或者resolved

但是既然说明文档还没有标记openjdk-11已经完全得到支持，这里就采用它的说法，不要强行尝试用OpenJDK-11编译

因为主机这边已经安装了OpenJDK-11，可能需要再安装一个OpenJDK-8，Linux中的java支持用`update-alternatives`来切换提供`java`命令支持的JRE、JDK版本

[Installing Multiple Java Versions On Linux Mint 20](https://nuwancs.medium.com/installing-multiple-java-versions-on-linux-mint-20-df321b08e138)

[How to work with multiple java versions under Linux](https://www.thegeekdiary.com/how-to-work-with-multiple-java-versions-under-linux/)

不过目前还不用执行这个方案，我的策略如下

- 如果获得了Hadoop的二进制文件，那么就在Docker中安装OpenJDK-11，这是为了安全

- 如果只能获取到Hadoop的源码，必须自己编译，那么一个更简单的方案是在Docker中安装OpenJDK-8负责编译和运行工作

- 一个稍稍复杂的方法是在本机安装OpenJDK-8，编译出二进制文件，再使用Docker中的OpenJDK-11来运行它

我的时间不多，只能考虑前两个方案

打包之前做好的debian镜像，其中包含了我修改过的镜像源配置，以及一个安装好的nano，如果我对JDK的选择有误，那么就回到这一步

先确保docker的容器关闭

```bash
docker ps
```

结果显示
```bash
➜  ~ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
➜  ~ 
```

没有容器处在运行状态，好的，准备打包

执行
```bash
docker commit distracted_shockley debian_startpoint
```

运行结果是：
```bash
➜  ~ docker commit distracted_shockley debian_startpoint
sha256:d11256cddabc2ea308e8e1bb7954de8c4457e7b635fcab53eb5c2627bed08a91
➜  ~ docker images
REPOSITORY          TAG       IMAGE ID       CREATED         SIZE
debian_startpoint   latest    d11256cddabc   6 seconds ago   146MB
debian              latest    34b4fa67dc04   2 weeks ago     124MB
hello-world         latest    feb5d9fea6a5   20 months ago   13.3kB
➜  ~ 
```

镜像创建完毕，打开原来的容器，准备安装软件

```bash
apt install openssh-client openssh-server openjdk-11-jre
```
提示我需要470MiB的磁盘空间

```bash
apt install openssh-client openssh-server openjdk-11-jdk
```
提示我需要706MiB的磁盘空间

I think that we just don't have too much choice

So, JUST DO IT

```bash
apt install openssh-client openssh-server openjdk-11-jdk
```

此外，为了便于管理，还应该安装`sudo`
```bash
apt install sudo
```

等待安装完毕，检查
```bash
root@da62261bc436:/# java -version
openjdk version "11.0.18" 2023-01-17
OpenJDK Runtime Environment (build 11.0.18+10-post-Debian-1deb11u1)
OpenJDK 64-Bit Server VM (build 11.0.18+10-post-Debian-1deb11u1, mixed mode, sharing)
```

```bash
root@da62261bc436:/# sshd -v       
unknown option -- v
OpenSSH_8.4p1 Debian-5+deb11u1, OpenSSL 1.1.1n  15 Mar 2022
usage: sshd [-46DdeiqTt] [-C connection_spec] [-c host_cert_file]
            [-E log_file] [-f config_file] [-g login_grace_time]
            [-h host_key_file] [-o option] [-p port] [-u len]
```

但是当我尝试运行
```bash
root@da62261bc436:/# systemctl enable ssh && systemctl start ssh 
```
的时候，提示

> Synchronizing state of ssh.service with SysV service script with /lib/systemd/systemd-sysv-install.
>
> Executing: /lib/systemd/systemd-sysv-install enable ssh
>
> System has not been booted with systemd as init system (PID 1). Can't operate.
>
> Failed to connect to bus: Host is down

docker的容器并非由`systemd`唤起，这好像也不难理解，注意到菜鸟教程创建容器时使用了`--privileged`参数，这会导致容器内的东西泄漏出来，这可不太明智

目前来看，也没必要现在就运行`sshd`，可以之后用`exec`运行它，注意，运行`sshd`需要使用绝对路径，也就是`/usr/sbin/sshd`

先执行
```bash
mkdir /run/sshd/
```
创建sshd所需的目录，以便稍后运行`sshd`

由于不应该允许通过`ssh`登录`root`，因此创建一个新用户`remoteU`用于`ssh`
```bash
useradd -d /home/remoteU -m -s /bin/bash remoteU
```
其中`-m`选项新建了用户目录

修改`remoteU`的密码
```bash
passwd remoteU
```

su进去配置密钥
```bash
su remoteU
```

```bash
ssh-keygen -t rsa
```

一路回车过去，按照默认设置配好
然后，cd进`~/.ssh/`

```bash
nano authorized_keys
```

把自己的主机的公钥贴进去，然后应该就完事了

## 下载与校验Hadoop

另一边，主机也不用闲着，开始下载hadoop的二进制文件

```bash
cd ~/Downloads/
curl -fSL -O https://dlcdn.apache.org/hadoop/common/stable/hadoop-3.3.5.tar.gz
```

查看[sha512](https://dlcdn.apache.org/hadoop/common/stable/hadoop-3.3.5.tar.gz.sha512)为

> SHA512 (hadoop-3.3.5.tar.gz) =
>
> cc170df24976543a3e961a1353a19422
> 5e3ffc5d53d594dd63d71422765e1d81
> 6d1ffa877c02bf93f0183fcfbe4c10f4
> b7739deca69420ed83372a0b1f9d5dc7

核验本地
```bash
➜  Downloads sha512sum hadoop-3.3.5.tar.gz 
cc170df24976543a3e961a1353a194225e3ffc5d53d594dd63d71422765e1d816d1ffa877c02bf93f0183fcfbe4c10f4b7739deca69420ed83372a0b1f9d5dc7  hadoop-3.3.5.tar.gz
```

## Hadoop的安装

这个软件需要手动安装，事实上，它的安装只是需要移动二进制文件到某个看起来很系统级的目录，然后配置几个环境变量

拷进容器里面
```bash
docker cp ~/Downloads/hadoop-3.3.5.tar.gz distracted_shockley:/root/
```

首先是确保我们能找到hadoop

在容器用户的`~/.bashrc`中添加
```bash
export PATH=$PATH:/usr/local/hadoop/bin:/usr/local/hadoop/sbin
```

以便我输入有关`hadoop`的命令时，bash都了解如何找到hadoop

下来是让hadoop自己搞清楚方向，

修改`/usr/local/hadoop/etc/hadoop/hadoop-env.sh`

查找`JAVA_HOME=`，修改为`java`的路径，例如我通过`whereis java`查找`java`的二进制文件，查找它的软链接目标，最后确定路径是`/usr/lib/jvm/java-11-openjdk-amd64`

```bash
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

查找`HADOOP_HOME=`，修改为hadoop的安装位置，例如此时安装在了`/usr/local/hadoop`，那么就写
```bash
export HADOOP_HOME=/usr/local/hadoop
```

到这一步，hadoop的环境变量就配完了

```bash
hadoop version
```

可以看到提示
```bash
root@da62261bc436:/usr/local/hadoop/etc/hadoop# hadoop version
Hadoop 3.3.5
Source code repository https://github.com/apache/hadoop.git -r 706d88266abcee09ed78fbaa0ad5f74d818ab0e9
Compiled by stevel on 2023-03-15T15:56Z
Compiled with protoc 3.7.1
From source with checksum 6bbd9afcf4838a0eb12a5f189e9bd7
This command was run using /usr/local/hadoop/share/hadoop/common/hadoop-common-3.3.5.jar
```

## Hadoop的配置

按照
[Hadoop: Setting up a Single Node Cluster.](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/SingleCluster.html#Standalone_Operation)
的说明

修改`etc/hadoop/core-site.xml`
```xml
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
</configuration>
```

修改`etc/hadoop/hdfs-site.xml`
```xml
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration>
```

默认配置中，http监视服务运行在`http://localhost:9870/`

但是我们可能需要从外部访问http监视服务

因此更改`etc/hadoop/hdfs-site.xml`，增添
```xml
<property>
  <name>dfs.http.address</name>
  <value>0.0.0.0:9870</value>
</property>
```
这样，http服务就会绑定在本机上，便于将来从容器外部访问

此外，不知怎地hadoop一定强调要求我配置好ssh，并且需要达成不通过密码访问本地的sshd的效果，也就是要用公私钥体制，

之前的说明也只是说脚本里有几个守护进程，依赖什么的

按照要求的做

```bash
ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 0600 ~/.ssh/authorized_keys
```

以防万一，我将两个用户`root`和`remoteU`都配了一遍，把自己的公钥加入到自己的ssh允许列表里面

虽然允许远程登录root很不安全，但这里是容器环境，所以先这样

容器环境不能够使用systemd的守护进程，所以sshd不会随“开机”自动启动，需要自己手动启动sshd服务器，因此输入

```bash
/usr/sbin/sshd
```
以便在本地启用一个ssh服务器

测试一下：
```bash
root@da62261bc436:/usr/local/hadoop/etc/hadoop# ssh localhost
Linux da62261bc436 5.15.0-72-generic #79-Ubuntu SMP Wed Apr 19 08:22:18 UTC 2023 x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
root@da62261bc436:~#   
```

这说明ssh服务器已经按照要求配置完成

## 运行Hadoop的HDFS

### 格式化namenode

```bash
root@da62261bc436:/usr/local/hadoop/etc/hadoop# hdfs namenode -format
WARNING: /usr/local/hadoop/logs does not exist. Creating.
# 此处的日志实在太长，故挪到了文章末尾处
SHUTDOWN_MSG: Shutting down NameNode at da62261bc436/172.17.0.2
************************************************************/
root@da62261bc436:/usr/local/hadoop/etc/hadoop# 
```

如此这般，没有报错，格式化应该是完成了

### 启动hdfs

运行
```bash
start-dfs.sh
```
时遇到了问题

> but there is no HDFS_NAMENODE_USER defined. Aborting operation.

由于我将容器运行在只有root的模式下，因此在文件中配置指定用户名

```bash
# SERVICE USER OPTIONS
export HDFS_NAMENODE_USER="root"
export HDFS_DATANODE_USER="root"
export HDFS_SECONDARYNAMENODE_USER="root"
export YARN_RESOURCEMANAGER_USER="root"
export YARN_NODEMANAGER_USER="root"
```

由于hadoop会自动检测是否安装`pdsh`，但如果安装了但是没有配置pdsh,那么就容易得到拒绝连接的提示

因此应当`apt purge pdsh`卸载pdsh,

或者按照
[Hadoop : start-dfs.sh Connection refused](https://stackoverflow.com/a/48697837)
的方式处理问题

无论如何，我得到了提示
```bash
root@da62261bc436:~# start-dfs.sh 
Starting namenodes on [localhost]
Starting datanodes
Starting secondary namenodes [da62261bc436]
da62261bc436: Warning: Permanently added 'da62261bc436,172.17.0.2' (ECDSA) to the list of known hosts.
```
看起来相关服务已经运行起来了，用java进程检查器`jps`看一下有什么java服务正在运行
```bash
root@da62261bc436:~# jps
3061 Jps
2569 NameNode
2863 SecondaryNameNode
2671 DataNode
```

我的容器里面没有安装图形界面和浏览器，而且暂时还没有对外暴露端口，因此只能用`w3m`浏览器稍稍检查一下http服务的情况

```bash
w3m http://localhost:9870
```

虽然终端下的浏览器渲染出来的网页很简陋，但是勉强能看出来，9870端口上有个http服务器正在努力地工作着，并且提供了一个动态的网页，之后只要把这个端口暴露出去，就可以在外面访问它了

### 进行文件操作

运行
```bash
hdfs dfs -help
```
会得到一份命令清单

按照说明，新建一个
```bash
hdfs dfs -mkdir /helloworld
```

要查看它，执行
```bash
hdfs dfs -ls /
```

得到提示
```bash
Found 1 items
drwxr-xr-x   - root supergroup          0 2023-05-22 18:13 /helloworld
```

在本地新建一个示例文件

```bash
cd ~
touch thereisanexample
```

```bash
hdfs dfs -put ./thereisanexample /helloworld/
hdfs dfs -ls /helloworld
```

```bash
hdfs dfs -mv /helloworld/thereisanexample /helloworld/thereisanotherexample
```

```bash
hdfs dfs -ls /helloworld
```

```bash
hdfs dfs -get /helloworld/thereisanotherexample ./
ll
```


真是功夫不负有心人，进行到这一步，可以打包一下容器，使之成为映像，准备下一步工作

关闭服务，退出容器
```bash
stop-all.sh
exit
```

```bash
docker commit distracted_shockley hadoop_on_debian
```

这次打包耗时很久

```bash
➜  ~ docker images 
REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
hadoop_on_debian    latest    f6ddd02c25a0   12 seconds ago   2.96GB
debian_startpoint   latest    d11256cddabc   5 hours ago      146MB
debian              latest    34b4fa67dc04   2 weeks ago      124MB
hello-world         latest    feb5d9fea6a5   20 months ago    13.3kB
```

2.96Gi 不能说小


## 探索——在docker中组建Hadoop集群

先明确一下开机流程：

```bash
/usr/sbin/sshd
start-dfs.sh
```

容器对外开放的端口必须在创建时确定

哪些端口需要得到调整呢？统计一下

|名称|端口|
|---|---|
|sshd|22|
|hdfs|9000|
|dfs-webUI|9870|


# 附录

## `hdfs namenode -format`的日志输出

<details>
<summary>Debian的Docker映像中预装软件包列表</summary>
<pre>
<code class="lang-bash">

```bash
WARNING: /usr/local/hadoop/logs does not exist. Creating.
2023-05-22 17:14:05,595 INFO namenode.NameNode: STARTUP_MSG: 
/************************************************************
STARTUP_MSG: Starting NameNode
STARTUP_MSG:   host = da62261bc436/172.17.0.2
STARTUP_MSG:   args = [-format]
STARTUP_MSG:   version = 3.3.5
STARTUP_MSG:   classpath = /usr/local/hadoop/etc/hadoop:/usr/local/hadoop/share/hadoop/common/lib/netty-all-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/jetty-servlet-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/common/lib/kerb-simplekdc-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/kerb-identity-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-redis-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/kerby-pkix-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-haproxy-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-xml-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/jsch-0.1.55.jar:/usr/local/hadoop/share/hadoop/common/lib/snappy-java-1.1.8.2.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-resolver-dns-classes-macos-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/jackson-annotations-2.12.7.jar:/usr/local/hadoop/share/hadoop/common/lib/kerb-core-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/curator-framework-4.2.0.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-compress-1.21.jar:/usr/local/hadoop/share/hadoop/common/lib/protobuf-java-2.5.0.jar:/usr/local/hadoop/share/hadoop/common/lib/j2objc-annotations-1.1.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-beanutils-1.9.4.jar:/usr/local/hadoop/share/hadoop/common/lib/listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar:/usr/local/hadoop/share/hadoop/common/lib/jackson-databind-2.12.7.1.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-logging-1.1.3.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-udt-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/slf4j-reload4j-1.7.36.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-text-1.10.0.jar:/usr/local/hadoop/share/hadoop/common/lib/hadoop-annotations-3.3.5.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/jetty-xml-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/common/lib/slf4j-api-1.7.36.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-memcache-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-native-epoll-4.1.77.Final-linux-aarch_64.jar:/usr/local/hadoop/share/hadoop/common/lib/guava-27.0-jre.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-math3-3.1.1.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-resolver-dns-native-macos-4.1.77.Final-osx-x86_64.jar:/usr/local/hadoop/share/hadoop/common/lib/jaxb-impl-2.2.3-1.jar:/usr/local/hadoop/share/hadoop/common/lib/jul-to-slf4j-1.7.36.jar:/usr/local/hadoop/share/hadoop/common/lib/reload4j-1.2.22.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-collections-3.2.2.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-daemon-1.0.13.jar:/usr/local/hadoop/share/hadoop/common/lib/nimbus-jose-jwt-9.8.1.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-resolver-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/woodstox-core-5.4.0.jar:/usr/local/hadoop/share/hadoop/common/lib/hadoop-shaded-guava-1.1.1.jar:/usr/local/hadoop/share/hadoop/common/lib/jackson-core-asl-1.9.13.jar:/usr/local/hadoop/share/hadoop/common/lib/kerb-admin-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/jersey-servlet-1.19.4.jar:/usr/local/hadoop/share/hadoop/common/lib/metrics-core-3.2.4.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-configuration2-2.8.0.jar:/usr/local/hadoop/share/hadoop/common/lib/kerby-util-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/hadoop-auth-3.3.5.jar:/usr/local/hadoop/share/hadoop/common/lib/httpcore-4.4.13.jar:/usr/local/hadoop/share/hadoop/common/lib/animal-sniffer-annotations-1.17.jar:/usr/local/hadoop/share/hadoop/common/lib/jsp-api-2.1.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-classes-kqueue-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/javax.servlet-api-3.1.0.jar:/usr/local/hadoop/share/hadoop/common/lib/asm-5.0.4.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-stomp-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/curator-recipes-4.2.0.jar:/usr/local/hadoop/share/hadoop/common/lib/failureaccess-1.0.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-socks-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/token-provider-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/re2j-1.1.jar:/usr/local/hadoop/share/hadoop/common/lib/jersey-json-1.20.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-smtp-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/httpclient-4.5.13.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-io-2.8.0.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-http2-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/jersey-server-1.19.4.jar:/usr/local/hadoop/share/hadoop/common/lib/jetty-webapp-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-resolver-dns-native-macos-4.1.77.Final-osx-aarch_64.jar:/usr/local/hadoop/share/hadoop/common/lib/avro-1.7.7.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-native-epoll-4.1.77.Final-linux-x86_64.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-mqtt-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-cli-1.2.jar:/usr/local/hadoop/share/hadoop/common/lib/gson-2.9.0.jar:/usr/local/hadoop/share/hadoop/common/lib/kerby-config-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/checker-qual-2.5.2.jar:/usr/local/hadoop/share/hadoop/common/lib/jakarta.activation-api-1.2.1.jar:/usr/local/hadoop/share/hadoop/common/lib/kerby-xdr-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/kerb-common-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/jcip-annotations-1.0-1.jar:/usr/local/hadoop/share/hadoop/common/lib/jsr311-api-1.1.1.jar:/usr/local/hadoop/share/hadoop/common/lib/hadoop-shaded-protobuf_3_7-1.1.1.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-codec-1.15.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-net-3.9.0.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-http-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/commons-lang3-3.12.0.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-native-kqueue-4.1.77.Final-osx-x86_64.jar:/usr/local/hadoop/share/hadoop/common/lib/paranamer-2.3.jar:/usr/local/hadoop/share/hadoop/common/lib/kerb-server-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-common-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-codec-dns-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-handler-proxy-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-sctp-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-rxtx-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/jetty-util-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/common/lib/jetty-security-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/common/lib/kerb-crypto-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/jetty-server-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/common/lib/jetty-util-ajax-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-native-kqueue-4.1.77.Final-osx-aarch_64.jar:/usr/local/hadoop/share/hadoop/common/lib/audience-annotations-0.5.0.jar:/usr/local/hadoop/share/hadoop/common/lib/jsr305-3.0.2.jar:/usr/local/hadoop/share/hadoop/common/lib/dnsjava-2.1.7.jar:/usr/local/hadoop/share/hadoop/common/lib/jetty-io-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/common/lib/jersey-core-1.19.4.jar:/usr/local/hadoop/share/hadoop/common/lib/jackson-core-2.12.7.jar:/usr/local/hadoop/share/hadoop/common/lib/jackson-mapper-asl-1.9.13.jar:/usr/local/hadoop/share/hadoop/common/lib/jettison-1.5.3.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-handler-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/zookeeper-3.5.6.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-resolver-dns-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/kerb-util-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/zookeeper-jute-3.5.6.jar:/usr/local/hadoop/share/hadoop/common/lib/json-smart-2.4.7.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-buffer-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-classes-epoll-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/lib/jetty-http-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/common/lib/kerby-asn1-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/jaxb-api-2.2.11.jar:/usr/local/hadoop/share/hadoop/common/lib/kerb-client-1.0.1.jar:/usr/local/hadoop/share/hadoop/common/lib/stax2-api-4.2.1.jar:/usr/local/hadoop/share/hadoop/common/lib/curator-client-4.2.0.jar:/usr/local/hadoop/share/hadoop/common/lib/accessors-smart-2.4.7.jar:/usr/local/hadoop/share/hadoop/common/lib/netty-transport-native-unix-common-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/common/hadoop-common-3.3.5.jar:/usr/local/hadoop/share/hadoop/common/hadoop-registry-3.3.5.jar:/usr/local/hadoop/share/hadoop/common/hadoop-common-3.3.5-tests.jar:/usr/local/hadoop/share/hadoop/common/hadoop-kms-3.3.5.jar:/usr/local/hadoop/share/hadoop/common/hadoop-nfs-3.3.5.jar:/usr/local/hadoop/share/hadoop/hdfs:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-all-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jetty-servlet-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerb-simplekdc-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerb-identity-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-redis-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerby-pkix-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-haproxy-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-xml-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jsch-0.1.55.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/snappy-java-1.1.8.2.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-resolver-dns-classes-macos-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/json-simple-1.1.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jackson-annotations-2.12.7.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerb-core-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/curator-framework-4.2.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-compress-1.21.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/protobuf-java-2.5.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/j2objc-annotations-1.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-beanutils-1.9.4.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jackson-databind-2.12.7.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-logging-1.1.3.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-udt-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-3.10.6.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-text-1.10.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/hadoop-annotations-3.3.5.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jetty-xml-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-memcache-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-native-epoll-4.1.77.Final-linux-aarch_64.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/guava-27.0-jre.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-math3-3.1.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-resolver-dns-native-macos-4.1.77.Final-osx-x86_64.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jaxb-impl-2.2.3-1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/reload4j-1.2.22.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-collections-3.2.2.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-daemon-1.0.13.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/nimbus-jose-jwt-9.8.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-resolver-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/woodstox-core-5.4.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/hadoop-shaded-guava-1.1.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jackson-core-asl-1.9.13.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerb-admin-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jersey-servlet-1.19.4.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-configuration2-2.8.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerby-util-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/hadoop-auth-3.3.5.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/httpcore-4.4.13.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/animal-sniffer-annotations-1.17.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/leveldbjni-all-1.8.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-classes-kqueue-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/javax.servlet-api-3.1.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/asm-5.0.4.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-stomp-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/curator-recipes-4.2.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/failureaccess-1.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-socks-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/token-provider-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/re2j-1.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jersey-json-1.20.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-smtp-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/httpclient-4.5.13.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-io-2.8.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-http2-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jersey-server-1.19.4.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jetty-webapp-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-resolver-dns-native-macos-4.1.77.Final-osx-aarch_64.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/avro-1.7.7.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kotlin-stdlib-common-1.4.10.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-native-epoll-4.1.77.Final-linux-x86_64.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-mqtt-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-cli-1.2.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/gson-2.9.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerby-config-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/checker-qual-2.5.2.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jakarta.activation-api-1.2.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerby-xdr-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerb-common-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jcip-annotations-1.0-1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jsr311-api-1.1.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/hadoop-shaded-protobuf_3_7-1.1.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-codec-1.15.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-net-3.9.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-http-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/commons-lang3-3.12.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-native-kqueue-4.1.77.Final-osx-x86_64.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/paranamer-2.3.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerb-server-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-common-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kotlin-stdlib-1.4.10.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-codec-dns-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-handler-proxy-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-sctp-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-rxtx-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jetty-util-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jetty-security-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerb-crypto-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jetty-server-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jetty-util-ajax-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-native-kqueue-4.1.77.Final-osx-aarch_64.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/audience-annotations-0.5.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/okio-2.8.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/okhttp-4.9.3.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jsr305-3.0.2.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/dnsjava-2.1.7.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jetty-io-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jersey-core-1.19.4.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jackson-core-2.12.7.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jackson-mapper-asl-1.9.13.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jettison-1.5.3.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-handler-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/zookeeper-3.5.6.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-resolver-dns-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerb-util-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/zookeeper-jute-3.5.6.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/json-smart-2.4.7.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-buffer-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-classes-epoll-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jetty-http-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerby-asn1-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/jaxb-api-2.2.11.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/kerb-client-1.0.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/stax2-api-4.2.1.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/curator-client-4.2.0.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/accessors-smart-2.4.7.jar:/usr/local/hadoop/share/hadoop/hdfs/lib/netty-transport-native-unix-common-4.1.77.Final.jar:/usr/local/hadoop/share/hadoop/hdfs/hadoop-hdfs-client-3.3.5-tests.jar:/usr/local/hadoop/share/hadoop/hdfs/hadoop-hdfs-nfs-3.3.5.jar:/usr/local/hadoop/share/hadoop/hdfs/hadoop-hdfs-native-client-3.3.5.jar:/usr/local/hadoop/share/hadoop/hdfs/hadoop-hdfs-3.3.5-tests.jar:/usr/local/hadoop/share/hadoop/hdfs/hadoop-hdfs-rbf-3.3.5-tests.jar:/usr/local/hadoop/share/hadoop/hdfs/hadoop-hdfs-native-client-3.3.5-tests.jar:/usr/local/hadoop/share/hadoop/hdfs/hadoop-hdfs-client-3.3.5.jar:/usr/local/hadoop/share/hadoop/hdfs/hadoop-hdfs-httpfs-3.3.5.jar:/usr/local/hadoop/share/hadoop/hdfs/hadoop-hdfs-rbf-3.3.5.jar:/usr/local/hadoop/share/hadoop/hdfs/hadoop-hdfs-3.3.5.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-jobclient-3.3.5-tests.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-shuffle-3.3.5.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-nativetask-3.3.5.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-common-3.3.5.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-hs-3.3.5.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-core-3.3.5.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-uploader-3.3.5.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-app-3.3.5.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-hs-plugins-3.3.5.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.5.jar:/usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-jobclient-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn:/usr/local/hadoop/share/hadoop/yarn/lib/HikariCP-java7-2.4.12.jar:/usr/local/hadoop/share/hadoop/yarn/lib/snakeyaml-1.32.jar:/usr/local/hadoop/share/hadoop/yarn/lib/guice-servlet-4.0.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jackson-module-jaxb-annotations-2.12.7.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jetty-client-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jline-3.9.0.jar:/usr/local/hadoop/share/hadoop/yarn/lib/asm-tree-9.3.jar:/usr/local/hadoop/share/hadoop/yarn/lib/javax.websocket-client-api-1.0.jar:/usr/local/hadoop/share/hadoop/yarn/lib/websocket-server-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jna-5.2.0.jar:/usr/local/hadoop/share/hadoop/yarn/lib/javax.websocket-api-1.0.jar:/usr/local/hadoop/share/hadoop/yarn/lib/aopalliance-1.0.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jakarta.xml.bind-api-2.3.2.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jackson-jaxrs-base-2.12.7.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jersey-guice-1.19.4.jar:/usr/local/hadoop/share/hadoop/yarn/lib/json-io-2.5.1.jar:/usr/local/hadoop/share/hadoop/yarn/lib/metrics-core-3.2.4.jar:/usr/local/hadoop/share/hadoop/yarn/lib/geronimo-jcache_1.0_spec-1.0-alpha-1.jar:/usr/local/hadoop/share/hadoop/yarn/lib/asm-commons-9.3.jar:/usr/local/hadoop/share/hadoop/yarn/lib/websocket-common-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/lib/fst-2.50.jar:/usr/local/hadoop/share/hadoop/yarn/lib/guice-4.0.jar:/usr/local/hadoop/share/hadoop/yarn/lib/mssql-jdbc-6.2.1.jre7.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jackson-jaxrs-json-provider-2.12.7.jar:/usr/local/hadoop/share/hadoop/yarn/lib/javax-websocket-server-impl-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/lib/websocket-servlet-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/lib/objenesis-2.6.jar:/usr/local/hadoop/share/hadoop/yarn/lib/websocket-client-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/lib/bcprov-jdk15on-1.68.jar:/usr/local/hadoop/share/hadoop/yarn/lib/javax.inject-1.jar:/usr/local/hadoop/share/hadoop/yarn/lib/ehcache-3.3.1.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jetty-plus-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/lib/asm-analysis-9.3.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jersey-client-1.19.4.jar:/usr/local/hadoop/share/hadoop/yarn/lib/java-util-1.9.0.jar:/usr/local/hadoop/share/hadoop/yarn/lib/websocket-api-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/lib/swagger-annotations-1.5.4.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jetty-annotations-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/lib/javax-websocket-client-impl-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/lib/bcpkix-jdk15on-1.68.jar:/usr/local/hadoop/share/hadoop/yarn/lib/jetty-jndi-9.4.48.v20220622.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-server-tests-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-api-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-services-api-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-server-common-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-server-applicationhistoryservice-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-registry-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-client-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-server-nodemanager-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-applications-distributedshell-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-server-resourcemanager-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-server-sharedcachemanager-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-applications-mawo-core-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-server-router-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-server-web-proxy-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-common-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-services-core-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-applications-unmanaged-am-launcher-3.3.5.jar:/usr/local/hadoop/share/hadoop/yarn/hadoop-yarn-server-timeline-pluginstorage-3.3.5.jar
STARTUP_MSG:   build = https://github.com/apache/hadoop.git -r 706d88266abcee09ed78fbaa0ad5f74d818ab0e9; compiled by 'stevel' on 2023-03-15T15:56Z
STARTUP_MSG:   java = 11.0.18
************************************************************/
2023-05-22 17:14:05,608 INFO namenode.NameNode: registered UNIX signal handlers for [TERM, HUP, INT]
2023-05-22 17:14:05,711 INFO namenode.NameNode: createNameNode [-format]
2023-05-22 17:14:06,455 INFO namenode.NameNode: Formatting using clusterid: CID-a4ea0573-7af8-4f0d-b9e8-ef59910dc155
2023-05-22 17:14:06,547 INFO namenode.FSEditLog: Edit logging is async:true
2023-05-22 17:14:06,610 INFO namenode.FSNamesystem: KeyProvider: null
2023-05-22 17:14:06,611 INFO namenode.FSNamesystem: fsLock is fair: true
2023-05-22 17:14:06,612 INFO namenode.FSNamesystem: Detailed lock hold time metrics enabled: false
2023-05-22 17:14:06,673 INFO namenode.FSNamesystem: fsOwner                = root (auth:SIMPLE)
2023-05-22 17:14:06,673 INFO namenode.FSNamesystem: supergroup             = supergroup
2023-05-22 17:14:06,673 INFO namenode.FSNamesystem: isPermissionEnabled    = true
2023-05-22 17:14:06,673 INFO namenode.FSNamesystem: isStoragePolicyEnabled = true
2023-05-22 17:14:06,674 INFO namenode.FSNamesystem: HA Enabled: false
2023-05-22 17:14:06,783 INFO common.Util: dfs.datanode.fileio.profiling.sampling.percentage set to 0. Disabling file IO profiling
2023-05-22 17:14:06,962 INFO blockmanagement.DatanodeManager: dfs.block.invalidate.limit : configured=1000, counted=60, effected=1000
2023-05-22 17:14:06,962 INFO blockmanagement.DatanodeManager: dfs.namenode.datanode.registration.ip-hostname-check=true
2023-05-22 17:14:06,964 INFO blockmanagement.BlockManager: dfs.namenode.startup.delay.block.deletion.sec is set to 000:00:00:00.000
2023-05-22 17:14:06,964 INFO blockmanagement.BlockManager: The block deletion will start around 2023 May 22 17:14:06
2023-05-22 17:14:06,965 INFO util.GSet: Computing capacity for map BlocksMap
2023-05-22 17:14:06,965 INFO util.GSet: VM type       = 64-bit
2023-05-22 17:14:06,978 INFO util.GSet: 2.0% max memory 3.9 GB = 79.7 MB
2023-05-22 17:14:06,978 INFO util.GSet: capacity      = 2^23 = 8388608 entries
2023-05-22 17:14:07,005 INFO blockmanagement.BlockManager: Storage policy satisfier is disabled
2023-05-22 17:14:07,005 INFO blockmanagement.BlockManager: dfs.block.access.token.enable = false
2023-05-22 17:14:07,009 INFO blockmanagement.BlockManagerSafeMode: dfs.namenode.safemode.threshold-pct = 0.999
2023-05-22 17:14:07,009 INFO blockmanagement.BlockManagerSafeMode: dfs.namenode.safemode.min.datanodes = 0
2023-05-22 17:14:07,009 INFO blockmanagement.BlockManagerSafeMode: dfs.namenode.safemode.extension = 30000
2023-05-22 17:14:07,010 INFO blockmanagement.BlockManager: defaultReplication         = 1
2023-05-22 17:14:07,010 INFO blockmanagement.BlockManager: maxReplication             = 512
2023-05-22 17:14:07,010 INFO blockmanagement.BlockManager: minReplication             = 1
2023-05-22 17:14:07,010 INFO blockmanagement.BlockManager: maxReplicationStreams      = 2
2023-05-22 17:14:07,010 INFO blockmanagement.BlockManager: redundancyRecheckInterval  = 3000ms
2023-05-22 17:14:07,010 INFO blockmanagement.BlockManager: encryptDataTransfer        = false
2023-05-22 17:14:07,010 INFO blockmanagement.BlockManager: maxNumBlocksToLog          = 1000
2023-05-22 17:14:07,106 INFO namenode.FSDirectory: GLOBAL serial map: bits=29 maxEntries=536870911
2023-05-22 17:14:07,107 INFO namenode.FSDirectory: USER serial map: bits=24 maxEntries=16777215
2023-05-22 17:14:07,107 INFO namenode.FSDirectory: GROUP serial map: bits=24 maxEntries=16777215
2023-05-22 17:14:07,107 INFO namenode.FSDirectory: XATTR serial map: bits=24 maxEntries=16777215
2023-05-22 17:14:07,123 INFO util.GSet: Computing capacity for map INodeMap
2023-05-22 17:14:07,124 INFO util.GSet: VM type       = 64-bit
2023-05-22 17:14:07,124 INFO util.GSet: 1.0% max memory 3.9 GB = 39.8 MB
2023-05-22 17:14:07,124 INFO util.GSet: capacity      = 2^22 = 4194304 entries
2023-05-22 17:14:07,135 INFO namenode.FSDirectory: ACLs enabled? true
2023-05-22 17:14:07,135 INFO namenode.FSDirectory: POSIX ACL inheritance enabled? true
2023-05-22 17:14:07,135 INFO namenode.FSDirectory: XAttrs enabled? true
2023-05-22 17:14:07,135 INFO namenode.NameNode: Caching file names occurring more than 10 times
2023-05-22 17:14:07,143 INFO snapshot.SnapshotManager: Loaded config captureOpenFiles: false, skipCaptureAccessTimeOnlyChange: false, snapshotDiffAllowSnapRootDescendant: true, maxSnapshotLimit: 65536
2023-05-22 17:14:07,145 INFO snapshot.SnapshotManager: SkipList is disabled
2023-05-22 17:14:07,150 INFO util.GSet: Computing capacity for map cachedBlocks
2023-05-22 17:14:07,150 INFO util.GSet: VM type       = 64-bit
2023-05-22 17:14:07,150 INFO util.GSet: 0.25% max memory 3.9 GB = 10.0 MB
2023-05-22 17:14:07,150 INFO util.GSet: capacity      = 2^20 = 1048576 entries
2023-05-22 17:14:07,160 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.window.num.buckets = 10
2023-05-22 17:14:07,160 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.num.users = 10
2023-05-22 17:14:07,160 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.windows.minutes = 1,5,25
2023-05-22 17:14:07,163 INFO namenode.FSNamesystem: Retry cache on namenode is enabled
2023-05-22 17:14:07,163 INFO namenode.FSNamesystem: Retry cache will use 0.03 of total heap and retry cache entry expiry time is 600000 millis
2023-05-22 17:14:07,165 INFO util.GSet: Computing capacity for map NameNodeRetryCache
2023-05-22 17:14:07,165 INFO util.GSet: VM type       = 64-bit
2023-05-22 17:14:07,165 INFO util.GSet: 0.029999999329447746% max memory 3.9 GB = 1.2 MB
2023-05-22 17:14:07,165 INFO util.GSet: capacity      = 2^17 = 131072 entries
2023-05-22 17:14:07,197 INFO namenode.FSImage: Allocated new BlockPoolId: BP-633437213-172.17.0.2-1684775647175
2023-05-22 17:14:07,340 INFO common.Storage: Storage directory /tmp/hadoop-root/dfs/name has been successfully formatted.
2023-05-22 17:14:07,425 INFO namenode.FSImageFormatProtobuf: Saving image file /tmp/hadoop-root/dfs/name/current/fsimage.ckpt_0000000000000000000 using no compression
2023-05-22 17:14:07,561 INFO namenode.FSImageFormatProtobuf: Image file /tmp/hadoop-root/dfs/name/current/fsimage.ckpt_0000000000000000000 of size 399 bytes saved in 0 seconds .
2023-05-22 17:14:07,676 INFO namenode.NNStorageRetentionManager: Going to retain 1 images with txid >= 0
2023-05-22 17:14:07,699 INFO namenode.FSNamesystem: Stopping services started for active state
2023-05-22 17:14:07,699 INFO namenode.FSNamesystem: Stopping services started for standby state
2023-05-22 17:14:07,702 INFO namenode.FSImage: FSImageSaver clean checkpoint: txid=0 when meet shutdown.
2023-05-22 17:14:07,702 INFO namenode.NameNode: SHUTDOWN_MSG: 
/************************************************************
SHUTDOWN_MSG: Shutting down NameNode at da62261bc436/172.17.0.2
************************************************************/
```

</code>
</pre>
</details>

Knighthana

2023/05/30
