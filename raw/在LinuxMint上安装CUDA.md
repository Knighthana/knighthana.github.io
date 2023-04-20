# 在LinuxMint上安装CUDA

安装软件务必遵守官方说明

[通过网络安装](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=22.04&target_type=deb_network)

[预下载方式安装](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=22.04&target_type=deb_local)

遵照网页下方的说明一步一步进行，在某些关键步骤记得重定向日志

在安装完毕后会提示需要重启以便检查驱动是否正常工作，先检查一下输出的日志里面有没有提示什么重要的事情，然后按照知识重启

我遇到了重启后`nvidia-smi`提示CUDA已经安装，但是`nvcc`却没有正确响应的情况

查了一下资料，这可能是因为环境变量没有正确地包含`cuda`的路径导致的：[解决nvcc --version显示command not found问题](https://blog.csdn.net/Flying_sfeng/article/details/103343813)

就很奇怪，因为我检查了一下`.bashrc`，里面也没有提到有关`nvidia`或者`cuda`的`PATH`信息

按说有关环境变量的这种事情不该发生，但是它就是发生了，那没有办法，只能自己解决了

手动在`zsh`的配置文件(`.zshrc`或者`.zprofile`)里面往环境变量中添加`cuda`的路径

这里我在重启几次之后发现我的`.zprofile`并没有正常起作用

查了一下资料，怀疑是[Solved .zprofile not sourced](https://bbs.archlinux.org/viewtopic.php?id=211162)里面提到的

> Display Managers "helpfully" ignore some of the shell initialisation files. That is why your .zprofile isn't being read...

正巧我用的就是`lightdm`

那只能继续往`.zshrc`里面塞东西了，但是这样的下去话.......我的zsh启动速度会变得越来越慢的吧

然后我又找了一番，发现`.profile`这个文件里面是有东西的，而且我发现了`torch`的语句，也就是说，之前发现的`$PATH`里有两个`torch`的未解之谜也破解了

那就使用`.profile`文件吧，虽然zsh不读取它，但看起来lightdm读取它了

为`PATH`添加`/usr/local/cuda/bin/`

为`LD_LIBRARY_PATH`添加`/usr/local/cuda/lib64`

## 卸载本地版本更换为网络版

我首次安装的时候使用了本地版安装，这样源被设定为了始终从本地读取，感觉不太好，不能保持最新，且每次读一遍本地目录浪费时间，于是在安装完成CUDA之后，我打算卸载掉本地的源，重新设定为网络源

安装时一共增添了两个文件一个包，那么倒序进行

首先查看`/etc/apt/preferences.d/`里面的`cuda-repository-pin-600`文件，发现里面没有提到“本地”，那就先不管

再查看`/usr/share/keyrings/`，删除里面的密钥文件

然后执行`apt remove cuda-repo-ubuntu2204-12-1-local_12.1.0-530.30.02-1_amd64.deb`

apt报告的依赖关系中并未提到会卸载其它的包，那就卸载

最后查看一下`/etc/apt/sources.list.d/`，里面有一个关于`file:///var`的源，把这个源删掉

按经验判断，应该没有问题了

此时再次`apt update`，提示需要更新nvidia的驱动，那必然是不敢执行的

打开
[Download Installer for Linux Ubuntu 22.04 x86_64](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=22.04&target_type=deb_network)
重新安装一遍网络版的CUDA安装程序

再次`apt update`，发现不再提示需要更新nvidia驱动了，那么就算搞完了。

Knighthana

2023/04/18
