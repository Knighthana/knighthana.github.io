# 关于WSL1中libgc的某些故障导致Wrong __data_start/_end pair问题的描述和后续解决方案

启动w3m时遇到问题“w3m Wrong __data_start/_end pair”问题

大多数（包括中文社区和英文社区）给出的分析是“这个问题是WSL1导致的，升级到WSL2就解决啦”

我信你个鬼，WSL2的坑爹是远近闻名的

查询之后，一个网页给出了解决方案:[WSL Ubuntu guile命令报错Wrong __data_start/_end pair及guile-gi等相关编译错误的解决方法](https://blog.csdn.net/yihuajack/article/details/117166950)

溯源其中提到的[libsndfile fails to build on Ubuntu 20.04 with WSL](https://github.com/rdp/ffmpeg-windows-build-helpers/issues/452)网页，其中给出的解决方案是

`$ sudo dpkg -r --force-depends "libgc1c2" # remove old libgc`

`$ git clone git://github.com/ivmai/bdwgc.git`

`$ cd bdwgc`

`$  ./autogen.sh`

`$ ./configure --prefix=/usr && make -j # its default is the wrong directory? huh?`

`$ sudo make install`

（个人认为此顺序不妥，鉴于网络的实际情况，以及开发环境不一定配置完毕，应该先执行`git clone`等命令，直到确认`./autogen.sh`执行无误之后，再行`sudo dpkg -r --force--depends`等卸载命令，最后再执行`./configure`和`sudo make install`）

在按照这个办法执行完毕之后，虽然w3m可以正常运行（表示libgc可以被正常调用），但是dpkg表示出现了依赖未解决问题。

显然依赖未解决，因为之前已经强制dpkg remove了依赖关系。

此时如果按照推荐方式，执行`sudo apt --fix-broken install`，将会解决依赖的问题，但是同时也会重新安装旧版本的`libgc`，也即什么问题都没解决。

这时候有两种解决方案，第一种是手动修改`/var/lib/dpkg/status`文件，这种方法多少令人有些抗拒。

另一个办法是伪装系统内的库，这需要考虑linux的这套库调用系统是如何运作的

在`/usr/lib/x86_64-linux-gnu/`内有目前不适应实际情况的过时`libgc.so.1`和`libgc.so.1.3.2`两个库

而根据上述解决方案，使用`--prefix=/usr`进行`configure`并进行`make install`之后，会在`/usr/lib`下安装`libgc.so.1.5.0`库

经过检查，`/usr/lib/x86_64-linux-gnu/`内的`libgc.so.1`实际上是一个软链接，因此将其链接的目标进行更改也许是一个可行的办法

因此最终的解决方案是，在`/usr/lib/x86_64-linux-gnu/`进行了如下操作：

`sudo mv libgc.so.1 libgc.so.1.bak`

`sudo mv libgc.so.1.3.2 libgc.so.1.3.2.bak`

`sudo ln -sf /usr/lib/libgc.so.1.5.0 libgc.so.1`

`sudo ln -sf /usr/lib/libgc.so.1.5.0 libgc.so.1.3.2`

如此，一番指鹿为马的操作就完成了

（也许这么生草的办法哪天突然就炸了也说不定

（所以才要记下来防止翻车

Knighthana
2021/8/29 4:05 (UTC+8)

------------------------

更新：

刚刚在网上冲浪，发现了一篇文章，提供了修改包管理器数据库的几个方案：

[史上最硬核的 Linux 依赖问题解决方案 | 技术](https://zhuanlan.zhihu.com/p/137948822)

Knighthana
2021/8/29 4:15 (UTC+8)
