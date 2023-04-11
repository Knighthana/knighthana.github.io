# 解决apt update时出现“Key is stored in legacy trusted.gpg keyring”的问题

这个问题是因为`/etc/apt/trusted.gpg`中包含了过时的密钥导致的

典型如Slack，2023年4月份仍然在使用一个2019年就过期的密钥

找到了一篇文章，通过向`trusted.gpg.d/`中添加了一个密钥文件，解决了这个问题。

虽然麻烦（感觉……不如手动编译软件包），但是我不想在自己使用的开发环境里面埋雷。

奇怪的是，这些步骤里面没有移除过时密钥的操作，但是好像它确实不报错了，也不知道到底是解决了还是怎么回事。

此外，放在`trusted.gpg.d/`,感觉还是不安全，但是slack的更新规则又不是我写的，所以对此暂时没有办法。

也许可以参照docker的方案，新建`keyrings\`目录保存密钥，在list文件里面写清楚信赖关系什么的，但是既然Slack官方没这么做，也许有什么原因（也许只是因为懒）。

参考：

中译本：

[修复 Ubuntu 中的 “Key is stored in legacy trusted.gpg keyring” 问题](https://linux.cn/article-15565-1.html)

原版：

[Fixing "Key is stored in legacy trusted.gpg keyring" Issue in Ubuntu](https://itsfoss.com/key-is-stored-in-legacy-trusted-gpg/)

Knighthana

2023/04/11

# Tag

MaintenanceLog; GPG; APT
