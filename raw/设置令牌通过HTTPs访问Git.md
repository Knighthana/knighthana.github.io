---
title: 设置令牌通过HTTPs访问Git
date: 2026-03-09 05:31:00
updated: 2026-03-09 06:00:00
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
tags:
  - Git
  - WSL
---

# 设置令牌通过HTTPs访问Git

通常访问`git`的方式是`ssh`，基于公私钥的身份验证与基于对称加密的数据传输已经足够安全了。

不过有些仓库会使用`HTTPs`，默认情况下通过`HTTPs`访问的仓库，`git`会要求用账号密码登录；

不过账号密码毕竟拥有本账号最高级别的权限，平常同步个仓库用不上不说，一旦泄露了麻烦可就大了；另外一遍遍输入账号密码确实挺麻烦，像现在账号密码都是`pwgen -yB 16`甚至`32`，或者用浏览器直接生成的，哪记得过来；

部分`git`服务器提供了令牌机制，先看看怎么配。

## 令牌是什么？

在使用令牌之前，我也不知道这是个什么玩意，看起来很麻烦，以至于我一直没配置。

实际上我们可以这么理解“令牌”，它就是“密码”，它是一个由远程Git服务器为你的账户保管的一对多密码之一，而在本地Git客户端中，它就是被作为“密码”进行处理的；

只不过，远程存储的多个“密码”中，“密码A”只能做某些事，“密码B”只能做其它的事情，“密码C”也有自己能做的和不能做的；

在某些场合，远程服务器会禁止通过账户的真正密码进行git操作，此时只能通过这些令牌，也就是“密码A”、“密码B”、“密码C”来进行操作，相比我们平常使用的密码，这些令牌会在过期后报废。

本地的`git`客户端会通过一个助手协助进行这样的工作：在你通过`HTTPs`访问`git`的时候，通过“某种方式”在本地（加密）存储了你的用户名和“密码”——也就是令牌；

之后，每当你对同一个`remote`进行同步操作时，`git`会联系助手解密还原账号“密码”之后**代填写**；不过前面也提到了，这里的“密码”其实是令牌；

希望读者能够通过这样的方式理解令牌来降低对未知的恐惧。

## 生成令牌

这一步基本只能在浏览器里面操作，按照提示设定好令牌之后，会获取到一段只能在浏览器中看见这一次的字符串，把它保存好。

对了，注意令牌的有效期，将来它过期之后，还得再来一次这样的操作。

## 存储令牌

对于令牌字符串，数字保存或者抄写保存都可以，现在谈谈怎么为`git`存储这个令牌，

`git`使用一个助手`credential.helper`辅助处理令牌，有许多方式存储令牌，常用的是`cache模式`、`store模式`、`由安全应用协助保管`：

 - `cache模式`将令牌存储在内存中，易失但安全拉满了，我也不知道啥项目需要这么干；

 - `store模式`是将令牌明文存储成文件；类似ssh私钥的存储方式，区别在于ssh私钥可以指定口令进行加密，而`git/HTTPs`令牌仅仅由文件系统访问权限保护；

 - `由安全应用协助保管`是将令牌用系统提供的加密API进行存储的方式，类似放在系统提供的保险箱中；这是一类方案的统称，具体对于Windows、macOS、Linux而言各有各的不同方案；

### 本地明文存储方式`store`

明文存储方式会将本账户所有被`git config`设定为需要进行存储的`git/HTTPs`令牌存入`~/.git-credentials`（默认，但可以通过`git config credential.helper 'store --file=/path/to/file'`手动指定，为每个仓库或是全局）中；

要全局使用这种方式，输入：
```bash
git config --global credential.helper store
```

或者在单独的仓库中不带`--global`地使用来为个别仓库启用
```bash
git config credential.helper store
```

之后进行`push`或者`pull`操作，输入用户名，

但是，

在输入密码这一步输入之前浏览器上获取的令牌字符串；

这样就完成了令牌的设定；

另一个方式也很明文，那就是将令牌通过`https://用户名:令牌字符串@example.com/user/repo.git`的方式硬编码进`.git/config`文件中，

虽然`.git/config`会一直留在本地所以没有暴露在网络中的风险，

不过本地的环境到底安不安全就自行斟酌了。

### 借用其它安全应用，通常是系统提供的密钥存储API存储令牌

系统的保险箱，比如`macOS`称之为钥匙串，是一类加密代管API，正好用来保存密码、令牌这些敏感数据。

这是一类方案的统称：

| 系统 | 凭据助手配置 |	特点 |
|---|---|---|
| Windows |	git config --global credential.helper manager-core | 存储在 Windows 凭据管理器，UI 管理 |
| macOS |	git config --global credential.helper osxkeychain | 存储在钥匙串，安全 |
| Linux | git config --global credential.helper libsecret | 需要 libsecret，存储在密钥环 |

这里只说Linux；

启用这种方式（全局，不想全局的取消掉`--global`）：
```bash
git config --global credential.helper libsecret
```

之后只要触发一次输入账号密码的操作，在密码环节输入令牌就可以了。

## 在`WSL2`中配置令牌——真正的挑战

### `WSL2`中，通用`git`令牌存储方案的问题

然而对于我正在使用的`Ubuntu 24.04 WSL2`来说，存在这么几个问题：

1. 莫得二进制，需要自己编：

> 在 Ubuntu 24.04 (WSL2) 中，Git 预设不直接包含已编译好的 libsecret 协助程式执行档。
> 
> 在 Debian/Ubuntu 系系统中，Git 通常将该工具的原始码放在文件目录下，使用者需要手动编译后才能使用。

2. 服务缺失：

> 在 WSL2 环境下使用 libsecret 存在一个核心限制：
>
> 需要 Secret Service 执行个体：libsecret 依赖于系统的「金钥环服务」（如 gnome-keyring）。
>
> WSL2 预设是纯文字模式（headless），通常没有启动这些服务。

抄一段AI对此问题有多麻烦的描述：

> **为什么它在 WSL2 中难以直接使用？**
>
> 缺少 D-Bus 会话：libsecret 需要通过 D-Bus 与后台服务通信。WSL2 默认不启动图形界面的用户会话 D-Bus，导致工具找不到通信管道。
>
> 服务未自动启动：在普通桌面版 Ubuntu 中，钥匙环服务（gnome-keyring-daemon）会在登录时通过 PAM 模块自动启动并解锁。但 WSL2 采用的是直接进入 Shell 的方式，跳过了这个自动过程。
>
> 交互式解锁难题：即便你手动启动了服务，它也需要你输入密码来「解锁」钥匙环。在没有 GUI 弹窗的情况下，这在命令行中操作非常繁琐。 
>
> **带来的后果**
>
> 如果你执意在 WSL2 中配置 libsecret 但不解决钥匙环服务问题，你会发现：
>
> 无法持久化存储：Git 每次 push/pull 仍然会提示输入密码，因为 libsecret 存不进「关闭着」的仓库。
>
> 报错信息：可能会看到 Error calling StartServiceByName 或 No such interface 等令人困惑的 D-Bus 错误。 

### 来自微软的“推荐方案”

对于WSL2来说，[推荐的做法](https://github.com/git-ecosystem/git-credential-manager/blob/release/docs/wsl.md)是[Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager)；
*源于Microsoft之前的[Git Credential Manager for Windows](https://github.com/Microsoft/Git-Credential-Manager-for-Windows)*

并不是在WSL2中安装`GCM for Linux`，那会带来一大滩不想看到的东西，这包括WSLg、一整套.NET框架，并且需要手动配置“凭据存储后端”后才能使用。虽然[并不是不能这么做](https://github.com/git-ecosystem/git-credential-manager/blob/release/docs/wsl.md#can-i-install-git-credential-manager-directly-inside-of-wsl)。

这里需要[Git for Windows](https://github.com/git-for-windows/git)。

好消息：我也不知道到底是哪年装过了`Git for Windows`，总之我的PC上面有个`Git for Windows`

坏消息：这个Git的版本是`Git for Windows 2.38.0.windows.1`，里面根本没有`Git Credential Manager`；

更坏的消息：我顺手在`powershell`里敲了个`git update-git-for-windows`而不是用浏览器下载安装包，于是只能等它下载完；

跟[网站上](https://github.com/git-ecosystem/git-credential-manager/blob/release/docs/wsl.md#can-i-install-git-credential-manager-directly-inside-of-wsl)那不知道哪年开始就一直没有修改的文档不太一样，Git现在是64位的，所以它在`C:\Program Files\Git\mingw64\bin`也就是`/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe`而不是`/mnt/c/Program\ Files\ \(x86\)/Git\ Credential\ Manager/git-credential-manager.exe`里。

因此我应该如此配置WSL2中的`git`：
```bash
git config credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe"
```

不过考虑到目前的情况，大概率所有的仓库验证都要通过GCM进行了
```bash
git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe"
```

### 凭据助手`credential.helper`的多值特性

还需要注意的一个问题是`git config credential.helper`是一个累加的多值配置项目，对同一个仓库多次执行会不断添加新的helper，叠加上按顺序的`/etc/gitconfig`、`~/.gitconfig`、`repo/.git/config`，一不留神将会制造很多个helper出来；

用
```bash
git config --show-origin --get-all credential.helper
```
检查当前项目中有多少个`helper`正在发挥作用；

如果多于一个，或者其中存在不正常的条目，执行：
```bash
git config --unset-all credential.helper
git config --global --unset-all credential.helper
```
将其全部清除。

由于凭据助手的这个奇妙特性，基本建议使用`global`进行配置，不然每个项目最后的汇总会让人戴上痛苦面具。

### 避免OAuth猜测流程

GCM会探测远端的Git仓库是一个什么类型的仓库，并尝试发起OAuth流程，甚至可能会超时弹`warning: auto-detection of host provider took too long (>2000ms)`错误；

已知远程的服务器是一个GitLab服务，因此我将其修改为：
```bash
git config --global credential.https://git.example.com.provider gitlab
```

这时出现了报告：
>warning: auto-detection of host provider took too long (>2000ms)
>
>warning: see https://aka.ms/gcm/autodetect for more information.

想到自搭的Git服务器不需要OAuth这种东西，我们只需要最基本的密码输入框，所以将GCM的Provider设置为`generic`：
```bash
git config --global credential.https://example.com.provider generic
```

然而GCM还是在贩冰，不断地报告说：
> warning: auto-detection of host provider took too long (>2000ms)
>
> warning: see https://aka.ms/gcm/autodetect for more information.
>
> Already up to date.

那我也只能对这个autodetect痛下撒手了：
```bash
git config --global gcm.autoDetect false
```

然而看到这样的画面我没招了
```bash
➜  toolset_usewhilelearn git:(master) git config --global gcm.autoDetect false
➜  toolset_usewhilelearn git:(master) git pull
warning: auto-detection of host provider took too long (>2000ms)
warning: see https://aka.ms/gcm/autodetect for more information.
Already up to date.
```
说明问题不在这里。

回忆一下过去在`MSYS2`上调用Windows原生程序传`git`能传进`WSL1`的离谱经历（当时硬盘上Windows的环境变量里面并没有存储WSL1的路径，这问题并没有看上去那么简单），我们可以做出假设：“此处调用的Windows原生程序仍然在使用一个莫名其妙的配置文件和环境变量”

现在提问：`/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe`的Windows原生程序，会认为自己的配置文件在哪？

不猜了，揭晓答案，`/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe`当然会认为自己的配置文件是
```bash
/mnt/c/Program\ Files/Git/etc/gitconfig
/mnt/c/Users/用户名/.gitconfig
```
呀？

这不是`git`运行在`windows`上的**默认行为**吗，哪里不对吗？

好了，把刀放下。

现在打开`powershell`，或者`git-bash-for-windows`，输入
```bash
git config --global credential.https://git.example.com.provider gitlab
```
于是问题“神奇地”解决了。

给我气笑了 😡😅

> Haha. Look familiar?
>
> Scenes like these are happening all over the cross-environment development in galaxy right now.
>
> You could be next.

### 造轮子的方案

另外，对于缺少`gnome-keyring`的WSL2来说，还有一个`GPG`搭配`pass`的纯文本方案，这里有他人辛勤工作的项目做了实现。查看[carlzhc git-credential-pass ](https://github.com/carlzhc/git-credential-pass)与[Xgames123 git-credential-pass](https://github.com/Xgames123/git-credential-pass)的两个项目。

## 注销令牌

令牌最长的有效期是365天，总之令牌是会失效的；

对于Linux下的标准`git`+`libsecret`来说，可以用`secret-tool`或者`git credential reject`进行管理。

对于`git`会去对接Windows上`GCM`的人来说，在Windows中按下Win键，输入`credentialmanager`会打开凭据管理器，在`Windows凭据`中寻找名为`git:https://` 的项目，进行管理即可；

虽然`GCM`提供了`erase`方法：
```bash
# 将path to替换为实际路径
echo "protocol=https
host=github.com" | /mnt/path/to/git-credential-manager.exe erase
```

## 附录

### 检查方案

如果git的表现实在很奇怪而不知道如何排查，可以执行：
```bash
git config --list --show-origin
```
检查是不是有奇怪的配置条目混进去了

### 针对路径而不是host进行crendential管理

（不建议）

在`git`中启用`credential.useHttpPath`后

例如`GCM`就可以通过
```bash
echo "protocol=https
host=github.com
path=username/projectname.git" | git-credential-manager.exe erase
```
对单个项目进行管理。

不过一般来说更多地会把令牌绑在网站上而不是具体的项目中，因此这是可以实现的，但不是建议的。

### 输入了错误的令牌怎么办？

*凉拌。*

看上一个小节，用凭据助手的`reject`或是`erase`方法移除错误的令牌。

不过我更好奇的是，如果我输入一个错误令牌，凭据助手会纠正，直到我输入正确的令牌，还是持续报错？

[GitHub HTTPS 认证失败](https://ask.csdn.net/questions/9272115)

> 排查发现本地 Git 配置中 `credential.helper` 已启用（如 macOS Keychain / Windows Credential Manager），
>
> 且缓存的凭据仍为已失效的密码或已被 GitHub 废弃的账户密码（自 2021 年 8 月起 GitHub 已全面禁用密码认证）。
>
> 此外，若曾使用过过期 PAT（Personal Access Token），而新生成的 token 未同步更新至凭据管理器，
>
> 也会触发此错误——Git 会静默复用缓存凭证，而非提示重新登录。
>
> 该问题在 macOS 和 Windows 上高频出现，Linux 用户则常因未配置 `git-credential-libsecret` 或凭据未刷新导致相同报错。

基本上来说，凭据助手不会记录有效性，它只会完成非常基本、重复性、机械性的工作。

### WSL突然无法调用Windows应用程序的问题

在迁移工作完成的几天后，我遇到了新的问题，在执行`git`操作的时候，它无法调用到GCM了，提示：

> /mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe get: 1: /mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe: Exec format error

这个问题可能是WSL突然丢失了执行`exe`能力导致的，通过下面的方法检查：
```bash
cat /proc/sys/fs/binfmt_misc/WSLInterop
```

如果结果中有`enabled`，那么问题可能就不在这里；

如果结果中有`disabled`，那么可以执行`sudo sh -c 'echo 1 > /proc/sys/fs/binfmt_misc/WSLInterop'`恢复；

而我遇到了更加离奇的问题，`cat`提示我：

> cat: /proc/sys/fs/binfmt_misc/WSLInterop: No such file or directory

屋檐了，我也不知道发生了什么导致它变成这样的，难道我的虚拟机趁我不在偷偷跑去玩了XX……？不过还好对于家用的计算机来说解决起来不算太难，保存好工作，通过PowerShell的WSL管理器重启WSL即可。

之后:
```bash
➜ ~ cat /proc/sys/fs/binfmt_misc/WSLInterop
enabled
interpreter /init
flags: PF
offset 0
magic 4d5a
➜ ~ "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe" --version
2.7.0+d1dd8a4ded75a2b1faae653157ac1699609442ad
```

可以看到问题已经解决了。

顺便，为了`git`以后的福祉，我顺便给GCM做了个软连接。
```bash
sudo ln -s "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe" /usr/local/bin/gcm_win.exe
```

现在`git`的配置可以写得更简单一点了。
```bash
git config --global --unset-all credential.helper
git config --global credential.helper /usr/local/bin/gcm_win.exe
```

### 有关`WSLInterop`

关于指令
```bash
sudo sh -c 'echo 1 > /proc/sys/fs/binfmt_misc/WSLInterop'
```

`binfmt_misc`是一个Linux内核功能"Binary Format Miscellaneous"，类似一张可以用来查询的表，它会让Linux将无法识别的二进制格式交给指定的解释器处理。

`WSLInterop`是WSL2中的一个来自微软的解释器。

WSL2在查阅`binfmt_misc`表之后，会发现`exe`对应的是`/init`，于是`exe`被传给`/init`，而`/init`会将这个请求转发给Windows宿主。

`echo 1`代表“启用”。`echo 1 > /proc/sys/fs/binfmt_misc/WSLInterop`就是将“启动信号”写入核心控制文件。

另外这个过程也可以通过`echo 1 | sudo tee /proc/sys/fs/binfmt_misc/WSLInterop`完成。

------------------------------

Knighthana

2026/03/09
