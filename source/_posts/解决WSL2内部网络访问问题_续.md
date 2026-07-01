---
title: 解决WSL2内部网络访问问题_续
date: 2026-06-10 23:52:00
updated: 2026-06-10 23:59:00
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

解决WSL2内部网络访问问题
======================

在[上一篇]()文章《解决WSL2内环境无法通过localhost读取到Windows的localhost的问题》中，我给出了一个`socat`+`supervisor`的方案；关于这个问题，还可以进一步探索；

主要是两个方面，
一是，除了用`socat`转发，Linux有自带的`iptables`相关的功能；
二是，在有`systemd`的情况下，使用`supervisor`的必要性；

# Linux的`iptables`功能

`iptables`只是一种工具集合的说法，实际上，目前的Linux在底层已经用`netfilter`(`nft`)功能替换了`iptables`；

为了防止网上所说的"不兼容"问题，可以先行检查：
```shell
lsmod | grep -E 'nf_|nft_|xt_|ip_tables|iptable_'
```
如果能够显示相关功能，那么基本上可以用Linux内核自建的表完成转发功能，而不需要应用层进程解决网络问题；

# WSL的`systemd`真的拿不到`1`的pid吗？

上篇文章中提到“WSL由于内核设计问题，`systemd`拿不到为1的pid，因此`systemd`的很多功能是废的，因此不要用”

这个结论是错的，对于Debian Trixie on WSL，通过命令
```shell
ps --no-headers -o comm 1
```
可以看到，结果是
```shell
systemd
```
这说明，在Debian on WSL中，`systemd`的功能一切正常；

--------------------------------

由此，引出这篇文章；

# 方案整体构架

目前的方案是，用`dummy ip`与`nft`配合，将本地的`10.254.254.254`上的`7890`和`7897`全部转发到`$WIN_IP:7890`；
任务写进一个`bash`脚本中，放在`/usr/local/bin/`中，由`systemd`负责开机时拉起；

## fallback方案

### 当宿主机为Windows11时

当宿主机为Win11这种支持`mirrored`WSL网络配置的Windows时，这个功能自身不必用这些方案，直接开启mirrored就能实现双向通信；

此时不建议，也无法折腾iptables，因为启用了mirrored之后，不支持这些功能；

### 当WSL内核不支持`nft`时

当WSL内核不支持nft时，可以换成两种方案：
1. 放弃内核路由，改为应用层支持，也就是`socat`转发；
2. 改用传统的`iptables-legacy`；

### 当WSL内核不能提供正常的`systemd`时

当WSL内核不能提供`systemd`时，可改为由bash脚本拉起supervisor，由supervisor管理相关功能；

# 步骤

## 检查`nft`相关功能

上面提到了，iptables功能已经被nft取代，因此，通过一些命令检查nft工作的状态很有必要；

对于WSL2，Microsoft已经在`/proc/config.gz`中公开了编译配置文件，可以从此处拿到针对内核情况的判断：

```shell
zgrep -i 'NF_TABLES' /proc/config.gz
zgrep -E 'CONFIG_NFT_(NAT|REDIRECT)' /proc/config.gz
```
此两条命令，主要是为了检查是否有把功能编译进去；

在我的Debian Trixie上试一下：
```shell
➜  ~ zgrep -i 'NF_TABLES' /proc/config.gz
CONFIG_NF_TABLES=y
CONFIG_NF_TABLES_INET=y
CONFIG_NF_TABLES_NETDEV=y
CONFIG_NF_TABLES_IPV4=y
CONFIG_NF_TABLES_ARP=y
CONFIG_NF_TABLES_IPV6=y
# CONFIG_NF_TABLES_BRIDGE is not set
➜  ~ zgrep -E 'CONFIG_NFT_(NAT|REDIRECT)' /proc/config.gz
CONFIG_NFT_NAT=y
➜  ~
```

结果很好，`y`代表功能是"内建"的，它甚至不是可加载模块的`m`，而是内核本体的一部分；

然后可以再仅看看`REDIRECT`：
```shell
zgrep -i 'REDIRECT' /proc/config.gz
```

在我的Debian 13上结果是：
```shell
➜  ~ zgrep -i 'REDIRECT' /proc/config.gz
CONFIG_NET_REDIRECT=y
CONFIG_NF_NAT_REDIRECT=y
CONFIG_NETFILTER_XT_TARGET_REDIRECT=m
CONFIG_IP_NF_TARGET_REDIRECT=m
CONFIG_BRIDGE_EBT_REDIRECT=m
# CONFIG_OVERLAY_FS_REDIRECT_DIR is not set
CONFIG_OVERLAY_FS_REDIRECT_ALWAYS_FOLLOW=y
➜  ~
```

既然内核的基础设施没有问题，那么最大的阻塞因素就没有了，接下来安装相关的前端配置工具：
```shell
sudo apt update && sudo apt install nftables -y
```

首先，`nftables`上关于此配置是一串命令，因此最好不要把它们塞进`systemd`来处理，而是做成一个单独的脚本，由`systemd`拉起；

其次，由于`zsh`与`bash`的语法有一些细微差别，尤其是对于花括弧`{`和`}`的处理上，且`bash`是更加通用的shell，因此尽量将配置写成`bash`语法，并指定由`bash`解析脚本；

不过，在把命令写成脚本，设定由bash每次开机时解析之前，先在`zsh`中检测一下效果：
```shell
# 1. 彻底清空可能存在的旧表
sudo nft delete table ip wsl_to_win 2>/dev/null || true
# 2. 获取当前 Windows 宿主机的 IP
WIN_IP=$(awk '/nameserver/ {print $2}' /etc/resolv.conf)
# 3. 创建一个名为 wsl_to_win 的 nat 表
sudo nft add table ip wsl_to_win
# 4. 创建 output 链（用单引号包裹，防止 zsh 报错）
sudo nft add chain ip wsl_to_win output '{ type nat hook output priority mangle; }'
# 5. 创建 prerouting 链（用单引号包裹）
sudo nft add chain ip wsl_to_win prerouting '{ type nat hook prerouting priority mangle; }'
# 6. 核心规则：DNAT 转发到 Windows 的 7897 端口
sudo nft add rule ip wsl_to_win output tcp dport 7890 dnat to $WIN_IP:7897
sudo nft add rule ip wsl_to_win output tcp dport 7897 dnat to $WIN_IP:7897
sudo nft add rule ip wsl_to_win prerouting tcp dport 7890 dnat to $WIN_IP:7897
sudo nft add rule ip wsl_to_win prerouting tcp dport 7897 dnat to $WIN_IP:7897
```
如无例外，结果会是无法连接——这是预料中的，一步一步排查，最后我将揭晓答案：
```shell
# 1. 看看变量拿到了什么
awk '/nameserver/ {print $2}' /etc/resolv.conf
# 2. 看看当前 nftables 实际写入的 DNAT 目标是谁
sudo nft list table ip wsl_to_win
```
nftable中的ip地址应该符合`$WIN_IP`；

然后检查Windows的防火墙是否拦截了请求：
```shell
# 请将下面的 172.x.x.x 替换为第一步查到的真实 Windows IP
nc -zv 172.x.x.x 7897
```

> 如果提示没有 nc，可以运行 sudo apt install netcat-openbsd

不出意外的话，结果应该是`Connection to 172.x.x.x 7897 port [tcp/*] succeeded!`

既然链路都没有断，那么问题出在哪里呢？这就引出了另一个问题，`nftables`的安全机制：

Linux内核识别到本地环回`127.0.0.1`流量被路由到外部的时候，会认为这是一个非法路由，触发安全机制`rp_filter`和`route_localnet`，将包丢弃；理由也很简单，本地环回的包，凭什么路由出去，这会造成信息泄露；

检查方法是，用如下指令检测功能的开关情况：
```shell
# 查看所有网卡的本地网卡路由限制状态
sysctl net.ipv4.conf.all.route_localnet
sysctl net.ipv4.conf.lo.route_localnet
```
或者
```shell
cat /proc/sys/net/ipv4/conf/all/route_localnet
cat /proc/sys/net/ipv4/conf/lo/route_localnet
```

如果两个值为0，那么“果然如此”；

## 如何突破限制

将这两个值设为1是绝对不应该的方案，即便那能够制造便利，但思考这样的问题，“127001的包是不是应该离开本地环回？”

答案是不应该；

那么问题要怎么解决？

1. 能不能伪造包地址？

答案是“不能”，只要涉及到127001到外部地址的路由，就会被内核干掉；

2. 用`dummy ip`；

```shell
# 1. 清理掉刚才的 dummy0 
sudo ip link delete dummy0 2>/dev/null || true
sudo nft delete table ip wsl_secure_proxy 2>/dev/null || true

# 2. 重新创建 dummy0，换上干净、无争议的 10.254.254.254/32
sudo ip link add dummy0 type dummy 2>/dev/null || true
sudo ip address add 10.254.254.254/32 dev dummy0 2>/dev/null || true
sudo ip link set dummy0 up

# 3. 获取 Windows 的 IP
WIN_IP=$(awk '/nameserver/ {print $2}' /etc/resolv.conf)

# 4. 创建全新的 nftables 结构
sudo nft add table ip wsl_secure_proxy
sudo nft add chain ip wsl_secure_proxy output '{ type nat hook output priority mangle; }'
sudo nft add chain ip wsl_secure_proxy postrouting '{ type nat hook postrouting priority srcnat; }'

# 5. 核心规则：精准劫持发往 10.254.254.254 端口的流量
sudo nft add rule ip wsl_secure_proxy output ip daddr 10.254.254.254 tcp dport 7890 dnat to $WIN_IP:7897
sudo nft add rule ip wsl_secure_proxy output ip daddr 10.254.254.254 tcp dport 7897 dnat to $WIN_IP:7897

# 6. 安全源地址伪装
sudo nft add rule ip wsl_secure_proxy postrouting ip daddr $WIN_IP tcp dport 7897 masquerade
```
此时，尝试
```shell
curl -ILv https://commercial.encrypted.intranet -x http://10.254.254.254:7890
```
应该会从对方主机得到响应；
到这一步，方案的设计和验证就完成了，接下来是持久化的实现；

## `supervisor`中的实现

supervisor中需要由`root`来执行这些指令；

考虑到在内核中转发网络数据包，本来就是`root`才应该做的事情，与具体的用户无关，因此这也没有造成`root`泄露污染；
`/etc/supervisor/conf.d/wsl-proxy.conf`
```ini
[program:wsl-kernel-proxy]
; 由 root 直接执行，免去一切 sudo 和密码烦恼
command=/bin/bash -c '\
ip link delete dummy0 2>/dev/null || true && \
ip link add dummy0 type dummy && \
ip address add 10.254.254.254/32 dev dummy0 && \
ip link set dummy0 up && \
WIN_IP=$(awk '\''/nameserver/ {print $2}'\'' /etc/resolv.conf) && \
nft delete table ip wsl_secure_proxy 2>/dev/null || true && \
nft add table ip wsl_secure_proxy && \
nft add chain ip wsl_secure_proxy output { type nat hook output priority mangle\; } && \
nft add chain ip wsl_secure_proxy postrouting { type nat hook postrouting priority srcnat\; } && \
nft add rule ip wsl_secure_proxy output ip daddr 10.254.254.254 tcp dport 7890 dnat to $WIN_IP:7897 && \
nft add rule ip wsl_secure_proxy output ip daddr 10.254.254.254 tcp dport 7897 dnat to $WIN_IP:7897 && \
nft add rule ip wsl_secure_proxy postrouting ip daddr $WIN_IP tcp dport 7897 masquerade'

; 瞬间完成的单次任务
startsecs=0
autorestart=false

; 核心安全调整：使用 root 运行底层网络配置
user=root
autostart=true
redirect_stderr=true
stdout_logfile=syslog
```
注意不要用普通用户和sudoers去执行，因为脚本拉起来的时候没人帮忙输入密码；

之后将`supervisord`自己挂在某个开机启动的地方，比如shell脚本或者其他开机启动的进程下面让其他进程顺手拉起来就可以了；

## `systemd`方案

新一些的WSL内核基本还原了`systemd`的功能，可以在`/etc/wsl.conf`中做出如下修改：
```toml
[boot]
systemd=true
```
用来启用`systemd`.pid == 1

鉴于我的Debian Trixie WSL已经有这项功能了，因此直接创建相关文件(注意，不要在`systemd`的配置文件直接写脚本，容易造成潜在问题)：
先创建这件事情的承包商：
`sudo nano /usr/local/bin/wsl-kernel-proxy.sh`
在其中输入：
```shell
#!/bin/bash
# 1. 彻底清理并重建 dummy0 网卡
/usr/bin/ip link delete dummy0 2>/dev/null || true
/usr/bin/ip link add dummy0 type dummy
/usr/bin/ip address add 10.254.254.254/32 dev dummy0
/usr/bin/ip link set dummy0 up

# 【升级：双重保险】循环等待，直到 resolv.conf 生成并包含 nameserver（最多等5秒）
for i in {1..5}; do
    WIN_IP=$(awk '/nameserver/ {print $2}' /etc/resolv.conf)
    if [ ! -z "$WIN_IP" ]; then
        break
    fi
    sleep 1
done

# 如果真的极度极端情况下还是没拿到 IP，直接退出，防止写入错误的空规则
if [ -z "$WIN_IP" ]; then
    exit 1
fi

# 3. 清理旧规则，注入全新的 nftables 核心树
/usr/sbin/nft delete table ip wsl_secure_proxy 2>/dev/null || true
/usr/sbin/nft add table ip wsl_secure_proxy
/usr/sbin/nft add chain ip wsl_secure_proxy output '{ type nat hook output priority mangle; }'
/usr/sbin/nft add chain ip wsl_secure_proxy postrouting '{ type nat hook postrouting priority srcnat; }'

# 4. 写入规则
/usr/sbin/nft add rule ip wsl_secure_proxy output ip daddr 10.254.254.254 tcp dport 7890 dnat to $WIN_IP:7897
/usr/sbin/nft add rule ip wsl_secure_proxy output ip daddr 10.254.254.254 tcp dport 7897 dnat to $WIN_IP:7897
/usr/sbin/nft add rule ip wsl_secure_proxy postrouting ip daddr $WIN_IP tcp dport 7897 masquerade
```

然后是负责拉起承包商的启动脚本：
`sudo nano /etc/systemd/system/wsl-kernel-proxy.service`
内容为：
```toml
[Unit]
Description=WSL2 Kernel Level Proxy Forwarding (nftables)
DefaultDependencies=no
After=network.target

[Service]
Type=oneshot
RemainAfterExit=yes
# 5 秒强行超时锁，绝对不阻塞开机
TimeoutStartSec=5
Restart=no

# 简单纯粹：直接运行我们写好的高能脚本
ExecStart=/usr/local/bin/wsl-kernel-proxy.sh

[Install]
WantedBy=multi-user.target
```

注意，这个配置文件应该在`/etc/systemd/system/`中，而不是`/etc/systemd/network/`中，因为，

>📂 1. `/etc/systemd/network/` 是用来干嘛的？
>
> 这个目录不是用来存放“脚本”或“服务”的，它是现代 Linux 中 systemd-networkd（网络守护进程）的专用配置文件目录。
>
> 它的里面通常存放的是以 .network、.netdev 或 .link 结尾的静态属性配置文件。
>
> - 比如你想给某个网卡固定一个 IP，你会在这里写一个 eth0.network 文件。
> - 比如你想创建一个 VLAN 或网桥，你会在这里写一个 br0.netdev 文件。
>
> 为什么它不能满足我们的需求？
>
> 1. 它不支持动态脚本：它是纯声明式的配置文件。而我们的核心痛点是每次开机必须通过 awk 去动态计算 Windows 那台电脑变来变去的 IP 变量（$WIN_IP），并将它实时塞进防火墙里。这种“流式命令”是无法在静态网络配置文件里执行的。
> 2. 它管不到 nftables：这个目录只负责网卡本身的网线通不通、IP 对不对，它没有权限也无法管理内核防火墙的规则树（NFT 路由劫持）。
>
> 📂 2. 为什么一定要放在 `/etc/systemd/system/`？
>这个目录是整个 Linux 系统存放自定义服务、脚本和计划任务（Oneshot）的核心圣地。
>
> 凡是涉及“开机我要执行一段 Bash 命令”、“开机我要拉起一个自定义服务”的需求，其对应的 .service 文件都必须安放在这里。

最后是任务本身的软链，这个我们自己不搞，让`systemctl`去做：
```shell
# 强制重新建立开机自启的软链接
sudo systemctl disable wsl-kernel-proxy.service
sudo systemctl enable wsl-kernel-proxy.service
```

一切顺利的话，会提示：
> Created symlink `/etc/systemd/system/multi-user.target.wants/wsl-kernel-proxy.service` → `/etc/systemd/system/wsl-kernel-proxy.service`.

如果马上就要跑，可以：
```shell
sudo systemctl start wsl-kernel-proxy.service
```

否则的话，还是建议在powershell里面`wsl --shutdown`一下，开机后
```shell
# 检查状态
sudo systemctl status wsl-kernel-proxy.service
```
查看功能是否为`enabled`和`active`；

如果`systemd`遇到了`Assignment outside of section`类的报错，那就需要检查`/etc/systemd/system/wsl-kernel-proxy.service`的内容，最简单的方案是：
```shell
sudo tee /etc/systemd/system/wsl-kernel-proxy.service << 'EOF'
[Unit]
Description=WSL2 Kernel Level Proxy Forwarding (nftables)
DefaultDependencies=no
After=network.target

[Service]
Type=oneshot
RemainAfterExit=yes
TimeoutStartSec=5
Restart=no
ExecStart=/usr/local/bin/wsl-kernel-proxy.sh

[Install]
WantedBy=multi-user.target
EOF
```
然后让`systemd`重新加载，并再测试一遍：
```shell
# 1. 强行刷新 systemd 配置
sudo systemctl daemon-reload

# 2. 重新进行一次自启绑定（彻底洗掉之前的 disabled 状态）
sudo systemctl disable wsl-kernel-proxy.service
sudo systemctl enable wsl-kernel-proxy.service

# 3. 立即手动启动它
sudo systemctl start wsl-kernel-proxy.service
```

如果一切顺利，现在无论如何关机开机WSL，都可以正常地从`10.254.254.254:7890` `10.254.254.254:7897`得到来自Windows的服务了；

# 防止IP和Port冲突

注意，`supervisor`和`systemd`方案只留一个，否则IP和Port肯定会发生冲突；

```shell
sudo rm -f /etc/supervisor/conf.d/wsl-proxy.conf
# 告知 Supervisor 重新扫描配置目录并移除已被删除的任务
sudo supervisorctl update
```

或者类似的
```shell
sudo rm -f /etc/systemd/system/wsl-kernel-proxy.service
sudo systemctl daemon-reload
```

至此，获得了内核级别的`ip:port`稳定转发，且兼顾了localhost的安全性，收工！

# 总结`systemd`方案

1. 分为两个空间，一部分是`nft`的转发配置，另一部分是`dummy`的IP；两个流程，一个开机启动流程，另一个实际工作流程；
2. 这两个空间，可以由一个脚本实现，把脚本放在`/usr/local/bin/`中；两个流程，分成脚本和开机启动配置；
3. 为脚本在`/etc/systemd/system/`中写配置脚本；
4. 用`systemctl enable`让其创建所需要的软链接；
5. 用`curl -ILv https://commercial.encrypted.intranet -x http://dummy:port`来测试`systemctl`是否能做出符合预期的动作；

------------------------------

Knighthana

2026/06/11
