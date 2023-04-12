# 2023年4月如何在LinuxMint上安装Docker

为了以后少浪费一些时间在配环境上（上次的惨痛经历真是历历在目），另外也是学习一下先进的虚拟化技术，我打算在自己的开发用软件系统里面安装一个Docker。

安装软件一般要遵循官方给出的说明，[Docker的说明文档](https://docs.docker.com/)

（少看那些上来就让人从源码编译Docker的教程，搞坏环境从无视包管理器开始）

但是这里有个很坑爹的地方，Docker.com默认诱导读者去安装"Docker Desktop"，我粗略看了一遍说明，这东西是一个VM，当然Docker组织也给出了一些解释——为何Docker Desktop要使用VM的形式：为了平台移植性、为了使用最新的内核（以便享受新特性）、为了提升保全性，为了最小化变更带来的不良效应；

以及，这个所谓的Docker Desktop支持的桌面环境仅仅包含KDE、Gnome、MATE，虽然他估计到了Mint用户这让人挺开心，但是这并没有照顾到我这个xfce用户啊！（摔）

越读这个说明越觉得不对劲。花了大概有二十分钟，我搞明白了，虽然这东西虽然看起来很美好，但他不是我需要的那个容器管理器Docker，仔细在页面里找了一下，传统意义上的非VM的Docker现在应该是叫Docker-Engine了

[Docker Engine](https://docs.docker.com/engine/install/)

这个应该就是我要找的东西了

首先这个页面特地强调了一下，适用于Debian的安装与适用于Ubuntu的安装不一样，虽然不太明白为什么，但是既然Mint是从Ubuntu那边衍生出来，而非直接从Debian衍生的，那么应该是按照Ubuntu的做法来的。

（顺便了解了一下，原来还有一个LMDE项目，这个项目让Mint摆脱了Ubuntu，直接使用Debian构造Mint。但是“目前”而言应该和我没什么关系，但是假如某公司继续作死，可能很快就和我有关系了。）

## 通过官方指导安装

### 第一步，卸载旧版本的Docker

由于没有安装过Docker，所以这一步对我没有意义。

### 第二步，准备GPG的安装环境

GPG是一套密钥方案，Ubuntu下的APT使用它来管理软件包的密钥，Mint也不例外。

```shell
 sudo apt-get update

 sudo apt-get install \
    ca-certificates \
    curl \
    gnupg
```

### 第三步，安装Docker组织的密钥

下载

```shell
 sudo mkdir -m 0755 -p /etc/apt/keyrings

 curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

安装

```shell
 echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

#### FAQ：GPG权限错误

如果GPG密钥文件的权限错误，可能会有问题，这通常是由于umask设置错误导致的

通过下列命令解决文件没有读取权限的问题

```shell
 sudo chmod a+r /etc/apt/keyrings/docker.gpg

 sudo apt-get update
```

### 第四步，安装Docker

```shell
 sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
### 最后，检查安装情况

```shell
 sudo docker run hello-world
```

输出部分应当首先开始下载一个容器

之后应当展示一个欢迎页面

按照官方给出的指导，安装就完成了

## 通过镜像安装

