<meta name="created" content="2023-01-14"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

# 解决网络连接问题及网络连接工具的问题的总集

*我不知道为什么只是想写点代码，却要解决这么多网络连接问题？*

*为被浪费掉的精力旺盛期间时间难过*

# 安装proxychains4

直接通过包管理器安装`proxychains`会安装`proxychains3`，这是一个很旧的版本（其实能用；

不过我为了排除各种问题，例如解决软件过旧之类的疑虑，最后安装了`proxychains4`，也被称为`proxychains-ng`，这是一个最新的实现；

假如不慎和我一样，并非通过包管理器，而是通过下载源码并且以`sudo make install`的方式安装的话，那么在`/usr/local/bin`中可以找到它的程序，不过这种方式不受包管理器记录和控制，对于日后的维护工作来说不太方便；

另外，`proxyresolv`功能默认没有安装，需要自己从源码的`src/`中拷贝出来放到`PATH`中，我的话是和`proxychains4`的二进制文件放在一起了；

# proxychains4的四种dns_proxy设置

我目前只能说三种，因为第四种`proxy_dns_daemon`我既没用过也不清楚；

1. 不设置任何`dns proxy`项目，也即不进行dns的代理，这种情况下，被`proxychains4`代理的程序会擅自（可能程序自己不这么觉得）调用系统的DNS请求相关功能，查询自己要访问的目的主机的IP地址，交给`proxychains4`的是一个IPv4地址；(然后`proxychains4`将这个IPv4原样传给端口监听程序，那边没有识别出来，完美地走了通常的通道，仍然慢速甚至断流，鼓掌！)

*为什么不效仿浏览器，直接从socks5里面传domain-name过去，非要自己去搞那个什么IP-address？很好玩吗？*

2. `proxy_dns_old`模式，这种模式下，被代理的程序还是会发出DNS请求，只不过请求被`proxychains4`截获，并且用一个`proxychains4`程序自己的`proxyresolv`脚本代为办理了，但是可能我技术水平有限，目前发现这个脚本只能设置`DNS_SERVER=`，但是基于众所周知的原因，这种形式并不稳定；

3. `dns_proxy`模式，这种模式会发送`domain-name`给对应的`port`，但是，某些老旧的程序和脚本，例如我发现的(也是最常用的场合)，`oh-my-zsh`的`upgrade.sh`并不支持这种模式，于是会卡在`[proxychains] DLL init: proxychains-ng 4.16`这条提示，天长地久，直到海枯石烂；

# 总结

我还是需要找一些终端下更靠谱的工具，解决各种不稳定和断流的问题。

实在不行的话恐怕还得自己动手？

K

2023/01/14
