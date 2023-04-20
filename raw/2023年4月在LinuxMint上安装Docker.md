---
title: 2023年4月在LinuxMint上安装Docker
date: 2023-04-11 00:00:00
updated: 2023-04-13 00:00:00
cover: /img/Cover-Docker.png
categories:
  - Dev-Env
tags: 
  - LinuxMint
  - Docker
  - 2023
---

# 2023年4月在LinuxMint上安装Docker

为了以后少浪费一些时间在配环境上（上次的惨痛经历真是历历在目），另外也是学习一下先进的虚拟化技术，我打算在自己的开发用软件系统里面安装一个Docker。

安装软件一般要遵循官方给出的说明，[Docker的说明文档](https://docs.docker.com/)

（少看那些上来就让人从源码编译Docker的教程，搞坏环境从无视包管理器开始）

但是这里有个很坑爹的地方，Docker.com默认诱导读者去安装"Docker Desktop"，我粗略看了一遍说明，这东西是一个VM，当然Docker组织也给出了一些解释——为何Docker Desktop要使用VM的形式：为了平台移植性、为了使用最新的内核（以便享受新特性）、为了提升保全性，为了最小化变更带来的不良效应；

以及，这个所谓的Docker Desktop支持的桌面环境仅仅包含KDE、Gnome、MATE，虽然他估计到了Mint用户这让人挺开心，但是这并没有照顾到我这个xfce用户啊！（摔）

越读这个说明越觉得不对劲。花了大概有二十分钟，我搞明白了，虽然这东西虽然看起来很美好，但他不是我需要的那个容器管理器Docker，仔细在页面里找了一下，传统意义上的非VM的Docker现在应该是叫Docker-Engine了

[Docker Engine](https://docs.docker.com/engine/install/)

这个应该就是我要找的东西了

首先这个页面特地强调了一下，适用于Debian的安装与适用于Ubuntu的安装不一样，虽然不太明白为什么，

不过既然LinuxMint是从Ubuntu那边衍生出来，而非直接从Debian衍生的，那么应该是按照Ubuntu的做法来的，

（顺便了解了一下，原来还有一个LMDE项目，这个项目让Mint摆脱了Ubuntu，直接使用Debian构造Mint。但是“目前”而言应该和我没什么关系，但是假如某公司继续做让用户不高兴的事情以至于影响到这边，可能很快就和我有关系了）

## 通过官方指导安装

先研究一下官方文档怎么说的，之后在通过镜像站安装

### 第一步，卸载旧版本的Docker

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

由于没有安装过Docker，所以这一步对我没有意义。

此外

> Images, containers, volumes, and networks stored in /var/lib/docker/ aren’t automatically removed when you uninstall Docker. If you want to start with a clean installation, and prefer to clean up any existing data, read the uninstall Docker Engine section.

懒得翻译，反正就是关于`/var/lib/docker/`里面的文件，自己决定要不要保留

### 第二步，准备GPG的安装环境

GPG是一套密钥方案，Ubuntu下的APT使用它来管理软件包的密钥，Mint也不例外。

```bash
 sudo apt-get update

 sudo apt-get install \
    ca-certificates \
    curl \
    gnupg
```

### 第三步，安装Docker组织的密钥

下载

```bash
 sudo mkdir -m 0755 -p /etc/apt/keyrings

 curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

安装

```bash
 echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

#### FAQ：GPG权限错误

如果GPG密钥文件的权限错误，可能会有问题，这通常是由于umask设置错误导致的

通过下列命令解决文件没有读取权限的问题

```bash
 sudo chmod a+r /etc/apt/keyrings/docker.gpg

 sudo apt-get update
```

### 第四步，安装Docker

```bash
 sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 最后，检查安装情况

```bash
 sudo docker run hello-world
```

输出部分应当首先开始下载一个容器

之后应当展示一个欢迎页面

按照官方给出的指导，到这一步安装就算完成了

## 通过国内的镜像站安装

事实上这一部分才是国内用户需要看的。

参阅[tuna协会关于docker-ce镜像的说明](https://mirrors.bfsu.edu.cn/help/docker-ce/)，整理如下

### 卸载旧版本的docker

```bash
sudo apt remove docker docker-engine docker.io containerd runc
```

### 安装必要的工具

```bash
sudo apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common
```

gnupg和gnupg2应该是有一个就足够的

### 创建钥匙环保存目录(如果已有`keyrings/`就不用创建)

```bash
sudo mkdir -m 0755 -p /etc/apt/keyrings
```

### 下载并安装docker.com的gpg密钥

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

前一个指令下载了来自"docker.com"的密钥

后一个指令生成了二进制密钥，并将二进制密钥以名称`docker.gpg`存放在了之前建立的钥匙环保存目录中。

(名字只是一个代号，不过，如果这里不用`docker.gpg`这个名字，待会sourcelist里面也要对`signed-by`的参数做对应的修改)

### 在`sources.list.d`目录中创建一个镜像源配置文件

#### 用tuna协会提供的一条命令搞定

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

#### 手动创建方式

目前阶段我不是很喜欢上一种方式，作为一个希望尽可能多了解这个系统的人，我需要尽可能搞清楚这条命令中每个部分的含义，然后手动完成

在熟练之后，我会使用尽可能节省时间的方式完成这样的任务

但是tuan提供的这条命令给了很多参考，可以直接拿来使用

手动创建源列表的步骤如下：

在`/etc/apt/sources.list.d/`中创建一个文件，命名为`docker.list`(名字只是一个代号，但是建议命名为`docker.list`方便之后查找和修改)

然后查询：

1. 正在使用的计算机系统CPU架构

    ```bash
    dpkg --print-architecture
    ```

2. 正在使用的操作系统代号

    ```bash
    lsb_release -cs
    ```

前一个一般为`amd64`，当然，如果对于当年惨兮兮没有趁手计算机用的我来说也有可能是`i386`或者`i686`；

对于Ubuntu用户，后一个可能是`trusty` `xenial` `bionic` `focal` `jammy` `kinetic`

但是对于我这样的LinuxMint 21.1用户，这个选项的输出是`vera`，稍稍回忆一下，LinuxMint版本`vera`对应的Ubuntu版本是`jammy`

然后在`docker.list`中输入以下内容，注意替换其中的带引号的中文字符为对应的内容(连左右两侧的引号一起替换，替换后的内容不再带引号)，然后保存

```conf
deb [arch="CPU架构" signed-by=/etc/apt/keyrings/docker.gpg] https://"你所使用的镜像源网站docker-ce的目录/linux/你所使用的发行版" "操作系统代号" stable
```

特别地，对于Mint用户，请使用ubuntu的仓库，并且"操作系统代号"使用对应的ubuntu代号

比如一个来自XDU的学子，恰巧也是Mint21.1、或者Mint21用户，那么这里就应该写

```conf
deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://linux.xidian.edu.cn/mirrors/docker-ce/linux/ubuntu jammy stable
```

来自[Mint参考文件](https://linuxmint.com/download_all.php)的版本对应表格

|VERSION|CODENAME|PACKAGE BASE|
|-------|--------|------------|
|21.1|Vera|Ubuntu Jammy|
|21|Vanessa|Ubuntu Jammy|
|20.3|Una|Ubuntu Focal|
|20.2|Uma|Ubuntu Focal|
|20.1|Ulyssa|Ubuntu Focal|
|20|Ulyana|Ubuntu Focal|
|19.3|Tricia|Ubuntu Bionic|
|19.2|Tina|Ubuntu Bionic|
|19.1|Tessa|Ubuntu Bionic|
|19|Tara|Ubuntu Bionic|
|5|Elsie|Debian Bullseye|

软件源文件中的代号一律使用小写字母

对于LMDE用户，则需要使用Debian仓库以及对应的Debian代号，

比如一个XDU的LMDE5用户在文件里就应该写

```conf
deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://linux.xidian.edu.cn/mirrors/docker-ce/linux/debian bullseye stable
```

### 更新源数据库并安装docker

```shell
sudo apt update
sudo apt install docker-ce
```

### 检查安装是否成功

```shell
 sudo docker run hello-world
```

至此，docker(非VM)安装就完成了。

Knighthana

2023/04/11 动笔

2023/04/13 完稿
