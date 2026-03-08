---
title: 解决WSL2内环境无法通过localhost读取到Windows的localhost的问题
date: 2026-03-09 01:54:00
updated: 2026-03-09 01:54:00
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
tags:
  - Linux
  - Network
  - Proxy
  - Ubuntu
  - WSL
  - WSL2
  - Windows
---

# 解决WSL2内环境无法通过localhost读取到Windows的localhost的问题

在WSL1屡屡吃瘪之后，我终于还是很不情愿地换到了WSL2上。

（没事别玩什么WSL1*还有MSYS*了，会被两个系统上各种交叉问题和“默认假设”坑死的）

关于怎么迁移不同的WSL，之后有兴趣的话写一篇博客（挖坑），目前先来说说迁移到WSL2之后遇到的问题吧。

简单来说，WSL2比起WSL1“更加虚拟机”了，这也导致了一个问题，WSL2默认用NAT转发的方式处理它和主机之间的网络问题。

大概微软还知道自己搞得这玩意有多难看，于是修补了一下，至少我们能够通过Windows的`localhost`也就是`127.0.0.1`访问到Linux内部跑在`0.0.0.0`上的程序。

然而对于WSL2内的Linux来说，它却无法像WSL1一样通过`localhost`也就是`127.0.0.1`直接访问到Windows。

这看起来或许“不是什么大问题”，但用WSL的初衷是什么，除了不用重启计算机以外，就是看重它能够很便捷地与Windows上的应用“实时”沟通。

微软大概也知道这点，因此为WSL2提供了一个**`Mirrored`**模式，方便互相沟通。

很不巧，Windows10作为版本弃子，目前并没有被允许支持这项功能。如果你在Windows10的WSL2中修改`/etc/wsl.conf`为这样

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

那么就会喜提
> wsl: Hyper-V 防火墙不受支持
>
> wsl: 不支持镜像网络模式： Windows 版本 19045。6466 没有所需的功能。
>
> 正在回退到 NAT 网络。
>
> wsl: DNS 隧道不受支持

由于无法进行双向通信，当我被要求只能通过特定的服务器访问公司内部资源的时候，我在WSL2中的`proxychains`就无法像在WSL1中那样地正常工作了

## 思考

首先推理一下，我们遇到了什么问题？

WSL不能在`localhost`上通信？不是，只是不能“双向通信”；

那么是哪一方向出了问题？WSL内的服务器能够监听到外面的请求，但是Windows不能从`localhost`监听到WSL的请求。

Windows能够监听到WSL吗？是的，虽然用了NAT方案导致内外无法通过`localhost`互相监听，然而二者在同一个局域网内。

我有办法获取到这个局域网内Windows的IP地址吗？是的，WSL2提供了一个方案，未特别修改`wsl.conf`中`generateResolvConf`的情况下，`/etc/resolv.conf`中记录有当前Windows主机的IP地址。

那么都可以通过什么方式解决呢？

1. 配置一个自动脚本，每次开虚拟机时自动修改`~/.proxychains/proxychains.conf`中`[ProxyList]`的内容，将`/etc/resolv.conf`中的`nameserver`的IP地址填写在此处；

2. 在WSL中设置一个开机启动的自动转发服务，使之监听`localhost`上的通信，并原样转发到Windows；

如何选择？

方案1虽然快，但是这个路径只对`proxychains`有效，对其他服务无法复用，不一定每次都恰好有这么个能填写IP的配置文件给我用，由于我以后基本上都只能用WSL2且不打算更换Win10为Win11，也无法指望**M$**将`mirrored`模式适配给Win10，这种套兼容层的方案虽然会降低效率，但是基本能做到对应用层不可见，也就是能够稳定复用，以后其他应用也出毛病了的话，照猫画虎就能解决问题。

如何转发呢？本想用C之类的写个简单的转发程序，不过这种事还是不要造轮子为妙，虽然任务很简单，但是“符合标准”很难。正好Linux下有个很好用的小东西叫`socat`，这只小猫很好地胜任转发TCP的任务。

```bash
# 获取 Windows IP
WIN_IP=$(awk '/nameserver/ {print $2}' /etc/resolv.conf)
# 将本地 1080 端口转发到 Windows 的 1080 端口
socat TCP-LISTEN:1080,fork,reuseaddr TCP:$WIN_IP:1080
```

接下来，找个什么方案让它开机自动执行就好，“这很简单，只要它是脚本”，我当时这么想。

## 在虚拟机中“开机启动”？但是`systemd`不可用

很快我就发觉问题不太简单了。

虽然我们知道Linux中有`~/.bashrc`（`~/.zshrc`）、`~/.profile`（`~/.zprofile`）以及`/etc/profile`和它引出`/etc/profile.d`下的每一个文件（`/etc/zsh/zprofile`、`/etc/zsh/zlogin`、`/etc/zsh/zlogout`、`/etc/zsh/zshenv`、`/etc/zsh/zshrc`），对于`oh-my-zsh`还有`~/.oh-my-zsh/custom/plugins/`；

首先排除`~/.zshrc`，不可能每打开一个`zsh`就执行一次，要卡死了；

然而如果我把脚本的启动触发放在`~/.zprofile`中的话，还是涉及到了“重复尝试创建进程拖慢速度”、“会卡关键系统资源比如端口号”的问题；

如果在Linux中，可以寻求`systemd`的帮助解决问题，它可以管理这样的“守护进程”；

然而对于WSL来说，它的`systemd`的PID不为`1`，因此不要指望任何与`systemd`沾边的方案；

## 通过`supervisor`进行用户级别的守护进程管理

### `supervisor`概况

`supervisor`是一个用`python`写的应用，可以实现用户级别的守护进程管理，和我需要的方案非常契合；

`supervisor`的配置文件在`/etc/supervisor/supervisord.conf`中，不过其中有这样一行
```ini
[include]
files = /etc/supervisor/conf.d/*.conf
```

因此类似`systemd`的`/etc/systemd/system/*.service`，去`/etc/supervisor/conf.d/`管理其中的`*.conf`即可实现各种管理，这样对于`systemd`的认知也可以迁移过来灵活使用。

### 创建`supervisor`的配置文件

创建一个配置文件
```bash
sudo vim /etc/supervisor/conf.d/portwinproxy-forward.conf
```

填写以下内容
```conf
[program:portwinproxy-forward]
; 获取最新的 Windows IP
command=/bin/bash -c 'WIN_IP=$(awk '\''/nameserver/ {print $2}'\'' /etc/resolv.conf) && exec /usr/bin/socat TCP-LISTEN:1080,fork,reuseaddr TCP:$WIN_IP:1080'
; 指定工作目录
directory=/tmp
; 以普通用户身份运行（替换为实际使用的用户名）
user=WSL中的普通用户名
; 是否随着 supervisord 启动而自动启动
autostart=true
; 如果进程意外退出，自动重启
autorestart=true
; 启动失败重试次数
startretries=3
; 把标准错误重定向到标准输出
redirect_stderr=true
; 日志文件位置和大小
stdout_logfile=/var/log/port-forward.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=3
; 环境变量（如果需要可以在这里设置）
environment=PYTHONUNBUFFERED=1
```

### 测试`supervisor`的配置文件

撰写完毕之后，先手动测试这个配置文件是否正常

```bash
sudo /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
```

如果一切正常，应该能够看到`portwinproxy-forward`相关的提示。

用`ctrl-c`关闭这个进程；

### 测试`supervisor`是否能够在后台正常工作

首先检查`supervisor`是否已经完全退出；
```bash
sudo supervisorctl status
```

如果它按照预期那样退出，此时应该会产生一条关于“文件不存在”的报错；

以后台方式，也就是默认方式启动`supervisor`，这次不需要带`-n`参数
```bash
sudo /usr/bin/supervisord -c /etc/supervisor/supervisord.conf
```

执行
```bash
sudo supervisorctl status
```
以检查正在运行的自定义守护进程；

如果一切正常，那么应该能看到

> portwinproxy-forward             RUNNING   pid 12346, uptime 0:00:10

在Windows侧正确配置公司的软件，确保它能够通过局域网访问之后，回到WSL；

通过如下命令测试网络是否正常接通
```bash
curl -ILvx http://127.0.0.1:1080 https://example.com
```

也可以在本地的Git仓库中尝试
```bash
proxychains git pull
```

一切顺利！

### 将`supervisor`设置为开机启动

由于这是WSL，之前说过与`systemd`沾边的任何方案都“基本上”无法使用，不过对于WSL可以另辟蹊径，这也是WSL2提供的优雅机制：
```bash
/etc/wsl.conf
```

添加或插入如下内容：
```ini
[boot]
command = /usr/bin/supervisord -c /etc/supervisor/supervisord.conf
```

保存并退出。

切换到Windows的PowerShell，运行
```powershell
wsl --shutdown
```

再次打开WSL2，检查
```bash
sudo supervisorctl status
```

如果一切正常，那么现在就可以通过WSL2内部的`127.0.0.1:1080`访问到Windows系统上`localhost:1080`里的服务啦！

## 分支问题

### `supervisor`的`command`健壮包装

如果`/etc/resolv.conf`缺失或者文件中`nameserver`行缺失，或者别的什么问题，`awk`解析了一个古神出来塞给`socat`，最好的情况是`socat`报错退出，最坏的情况则在古神管辖的范畴；

如果需要增强健壮性，可以修改命令为：
```ini
command=/bin/bash -c 'WIN_IP=$(awk '\''/nameserver/ {print $2}'\'' /etc/resolv.conf 2>/dev/null); if [ -z "$WIN_IP" ]; then echo "ERROR: Cannot get Windows IP from /etc/resolv.conf" >&2; exit 1; fi; exec /usr/bin/socat TCP-LISTEN:1080,fork,reuseaddr TCP:$WIN_IP:1080'
```

根据AI老师的说法：
如果进程在`startsecs`（默认为1，也就是1秒钟）内退出，算作启动失败，归`startretries`管辖；
如果进程已经运行过`startsecs`的时长，那么`supervisor`认为它已经进入过`RUNNING`状态，算作中途退出，归`autorestart`管辖；

反正我跑的是虚拟机，我没这么写，相信`awk`和`socat`！

### 整个方案只能针对端口进行一对一绑定

是的，这是一个问题，但目前只是一些用户级应用开发，需要管理的端口不多，之后其他应用遇到类似问题，再开一个`socat`转发就是了；

一般来说服务器端都不会乱绑端口，而WSL2是可以正常处理虚拟机内部的`listen`绑定请求与Windows的关系的（或者说WSL2会帮忙转发Windows上的访问请求到虚拟机里面的Linux上，取决于WSL2的团队怎么实现，但我可以不用关心这个），而，虽然客户端会瞎吉尔绑端口，但是只要正常的转发程序都知道需要处理来自客户端的端口映射问题；

因此，基本可以满足日常使用的需求。

### WSL2的“开机服务”已经找到了

之前说过WSL2的`systemd`“不能指望”，不过这个`/etc/wsl.conf`倒是可以指望的，

既然WSL2的开机服务已经找到了，那么不用`supervisor`可不可以呢？一半一半。

如果我愿意，可以把为启动`socat`写个脚本文件，然后把执行脚本的命令放在`/etc/wsl.conf`，不过需要自己处理进程重复启动的问题，只有一个进程的时候还能用`ps -aux | grep socat`判断进程有没有运行，但……俺也不知道需要绑两个不同的`socat`的时候该怎么办……

### `supervisor`明明是个用户级程序，为毛那么多`sudo`

众所周知，在Linux中`sudo`是一个“能不用就别用”的玩意，那么为什么上面有这么多的`sudo`呢？

因为通过系统包管理器，比如我的`apt install supervisor`安装的`supervisor`，其配置文件在`/etc/supervisor/`中，其日志在`/var/log`中，

还有最重要的……`/var/run/supervisor.sock`这个`supervisorctl`与`supervisord`之间通讯要用的socket，默认情况下只有`supervisor`和无所不能的`root`有权限访问；

不过有些时候，我们拿不到`sudo`权限，该怎么办呢；

配置文件的问题好解决，`-c`可以重新指定；只不过还要做一些其他准备；

建好文件和目录：
```bash
~/.etc/supervisor/supervisord.conf
~/.var/log/
~/.run/
```

对于`~/.etc/supervisor/supervisord.conf`，指定其内容为
```ini
[unix_http_server]
file=/home/用户名/.run/supervisor.sock
; 不设置权限限制，只让当前用户可读写
chmod=0700

[supervisord]
logfile=/home/用户名/.var/log/supervisord.log
pidfile=/home/用户名/.run/supervisord.pid
; 以后台模式运行
nodaemon=false
; 用户自己运行，不需要切换用户
user=用户名

[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[supervisorctl]
serverurl=unix:///home/用户名/.run/supervisor.sock

[include]
files = /home/用户名/.etc/supervisor/conf.d/*.conf
```

创建此次任务的`~/.etc/supervisor/conf.d/portwinproxy-forward.conf`配置文件：
```ini
[program:portwinproxy-forward]
command=/bin/bash -c 'WIN_IP=$(awk '\''/nameserver/ {print $2}'\'' /etc/resolv.conf) && exec /usr/bin/socat TCP-LISTEN:1080,fork,reuseaddr TCP:$WIN_IP:1080'
directory=/tmp
; 不需要指定 user，因为 supervisord 已经以用户身份运行
autostart=true
autorestart=true
startretries=3
redirect_stderr=true
stdout_logfile=/home/用户名/.var/log/supervisord.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=3
```

当以普通用户身份检查属于自己的supervisord时，可以这样做
```bash
supervisorctl -c ~/.etc/supervisor/supervisord.conf status
```

如果觉得带有`-c`的命令太长，可以在`~/.zprofile`中添加：
```bash
alias myctl='supervisorctl -c ~/.etc/supervisor/supervisord.conf'
```

直接
```bash
myctl status
```
即可

此时还需要设置开虚拟机自启，不过还是离不开`/etc/wsl.conf`文件，增加或插入：
```conf
[boot]
command = su - 用户名 -c '/usr/bin/supervisord -c /home/用户名/.etc/supervisor/supervisord.conf'
```

之后重启WSL即可完成配置。

### `supervisor`支持按序唤醒但不保证按序运行

`supervisor`可以用`conf`中`[program:app-name]`下的`priority=num`（越小越优先）来设定唤醒顺序，不过它不会保证服务就绪的顺序；

因此如果打算依序唤醒一个`db-sever`和一个`db-app`，那么也许`db-app`会因为访问不到`db-server`而无法启动。

不过这不是目前需要考虑的问题。

## 附录

### WSL2的localhost与Windows网络通信问题

上面说“取决于WSL2的团队怎么实现，但我可以不用关心这个”，我还是查了一下；

> WSL2 在默认的NAT网络模式下，Linux子系统运行在一个轻量级虚拟机中，拥有自己独立的虚拟网卡和IP地址（通常以172开头）。为了让从Windows访问WSL服务变得像访问本地服务一样简单（即通过localhost），WSL2 实现了一个名为“localhost转发”的特性，这个特性默认是开启的。
> 
> 这个特性的工作流程是这样的：
> 
> 1. 监听与捕获：在WSL2 Linux内部，有一个名为 localhost 的进程在运行。它的核心工作是监控Linux中所有尝试绑定（bind）到网络端口的程序。
> 2. 通知与协商：当你在WSL2里启动一个服务（比如用Python在端口8080启动一个HTTP服务器），这个localhost进程会立即捕获到这个bind()调用，并通过虚拟化通道与Windows上的 wslrelay.exe 进程通信。
> 3. 端口占用检查：wslrelay.exe 会检查Windows主机上的8080端口是否已被其他程序占用。
> 4. 建立“管道”：如果Windows的8080端口是空闲的，wslrelay.exe 就会在Windows上开始监听这个端口。现在，一个“管道”就建立起来了：所有发送到Windows localhost:8080的流量，都会被wslrelay.exe接收，然后通过内部通道无缝地传递给WSL2里的localhost进程，最终再由它转交给真正的服务程序。
> 
> 所以，整个过程不是简单的端口共享，而是一个由WSL2系统组件负责的、自动化的、透明的端口转发。

不过，镜像网络模式`mirrored`能用Windows内核对流量进行路由，比起这种在小小的`localhost`上绑呀绑呀的方案不知道高到哪里去了，可惜Win10没有这样的内核功能来跟WSL2里面Linux的BFP谈笑风生，那就没有办法了。

### 所以最终方案还是套兼容层

可以看到，为了“兼容性”“无感知”，很多解决方案只能是反复地套兼容层。

但是这样会不会降低运行效率呢？

感觉真是硬件方案搞出多少余量，拖沓的软件方案就能吃掉多少。不过用于设计构建方案的时间的确大大减少了。

---------------------

Knighthana

2026/03/09
