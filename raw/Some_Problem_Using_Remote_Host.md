# 使用远程机器的一些问题

## SSH的配置问题

  当一台远程机器启用SSHD服务器并且允许通过某个端口（默认22）访问之后，就可以在另一台机器（下称终端机）上通过SSH客户端进行基于SSH协议的远程访问了。

  假如配置好的远程机器的IP地址是192.168.50.34，其上有一个已经存在的本地用户ubuntu，则通过输入指令

  `ssh ubuntu@192.168.50.34`

  即可进行SSH访问请求；

  通常情况下，需要输入该远程机器上的本地用户的密码来进行认证，但如果配置了RSA公私钥对，则可以略过输入密码的步骤；

  在远程机器上的sshd配置文件位于`/etc/ssh/sshd_config`，这个文件中可以找到对于认证方式的设置，其中：

    - 以下项目规定了有关公私钥认证的设置
    
      `PubkeyAuthentication` 默认为`yes`
    
      `AuthorizedKeysFile` 默认为`.ssh/authorized_keys .ssh/authorized_keys2`

    - 以下项目规定了密码登入认证的设置

      `PasswordAuthentication` 默认为`yes`

    - 该项目作用不确定

      `ChallengeResponseAuthentication` 默认为`no`

      经过查询，该条目会进行一个“键盘交互式”认证，并指出“默认询问密码”，但没有得到进一步的有关这个过程如何进行详细配置，考虑到平常使用中不使用这个功能，因此按照默认的`no`进行设置。

值得注意的是，ssh方式是远程用户通过将自己登入为一个本地已经存在的用户来进行使用的，因此在远程机器上的配置是针对已经存在的本地用户进行的；

  [SSH的公钥是分配给某个用户的吗](https://unix.stackexchange.com/questions/315615/is-ssh-public-key-associated-with-a-user)

因此对于一个已经启用且采用默认配置的SSHd，只要在经常远程登录的用户的`.ssh`目录下配置`authorized_keys`文件，就可以直接通过publickey的方式登录。

配置的方式就是复制自己的公钥并直接粘贴到`authorized_keys`文件中

而且可以贴好几个进去

  [authorized_keys文件里面最多能放几个公钥](https://serverfault.com/questions/486598/which-is-the-maximum-number-of-keys-in-authorized-keys-file)

注意，假如在登入时公私钥验证的方式不通过，则会要求输入密码，

之前认为是设置中启用了`PasswordAuthentication`的缘故，于是将它设置为`no`，然后可喜可贺地彻底登不上去了。

之后发现是由于我直接采用终端的复制粘贴功能进行公钥的跨窗口复制粘贴，导致它把vim的换行符也复制进去了，结果就是密钥认证不通过需要手动输入密码

  值得注意的是搜索时发现了这个问题，虽然最终证明和我遇到的情况没有关系，但是还是值得留意一下，例如文件的权限问题等

  [为什么配置密钥之后还是需要输入密码](https://unix.stackexchange.com/questions/36540/why-am-i-still-getting-a-password-prompt-with-ssh-with-public-key-authentication)

并且幸运地发现了针对这个操作过程更为标准的工具[ssh-copy-id](https://www.ssh.com/academy/ssh/copy-id)，理论上讲，使用这个工具和手动操作是一样的效果，但是正确使用该工具还是有助于避免乱七八糟的问题。

  [手动复制ssh公钥和使用ssh-copy-id有何区别](https://unix.stackexchange.com/questions/419317/ssh-copy-id-versus-manual-copy-id-rsa-pub)

  [ssh-copy-id到底做了什么](https://stackoverflow.com/questions/22700818/what-exactly-does-ssh-copy-id-do)

（以此祭我在这个问题上浪费掉的四到六个小时时间，苏卡！）

另外出于安全考虑，在私有的树莓派上对默认用户"ubuntu"进行公私钥配置，在公共服务器上还是另建一个新用户，然后针对该用户进行公钥配置比较好。

## 安全网络连接

在终端下可以通过使用"proxychains"工具进行安全且私密的连接，proxychains会尝试接管单条命令的网络连接；

直接`apt`得到的`proxychains`是proxychains3，更加新的则是`proxychains4`，手动查看其版本实际为`proxychains4-NG`

同时也是出于安全原因，不应当在默认的"/etc/proxychains.conf"中留下任何信息

在个人目录下建立`~/.proxychains/proxychains.conf`文件，参考默认的`/etc/proxychains.conf`文件，可以发现其中有用的只有几行，复制粘贴然后修改一下：

`strict_chain`
`proxy_dns`
`[ProxyList]`
`socks5 192.168.50.xx xxxx`

`proxychains xxxxxxxx.sh`

然后并没有立刻获取到私密安全的资源。

ping请求接收者"192.168.50.xx"，显示延迟只有零点几毫秒。

查看请求接收者的Clash已经启动了局域网服务功能，检查网络类型，为“专用”，检查防火墙，针对Clash的设置为任意远程端口到任意本地端口的入站请求均为允许，因此理论上讲Clash监听的7890端口应当被允许。

因此看起来防火墙在这件事情上扮演的角色是人畜无害的。

然而稍后运行“wf.msc”，设置在[防火墙日志](%WINDIR%\System32\LogFiles\Firewall\pfirewall.log)中记录所有请求，包括允许的和拒绝的，并且利用远程机器在局域网上发起数次请求，发现本地机器的日志文件体积在增大。

阅读之后，发现所有ICMP-ping请求都回复了，所有到本地7890的请求都被拒绝了。

所以需要手动配置一条允许该端口的规则。

之后尝试，就正常了。

2021/10/31

Knighthana

纪念一周前在这两件破事上浪费的半个早晨
 