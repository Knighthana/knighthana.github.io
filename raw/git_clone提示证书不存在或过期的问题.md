<meta name="created" content="2022-04-18">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

# git clone 时提示证书不存在或过期的问题

从目标服务器上向本地clone项目时，提示 fatal: unable to access '...' : server certificate verification failed. CAfile: none CRLfile: none

一个证书问题，简洁明了。

首先可以得到结论，这里连到的远程目标上的确配置了https，但是证书不存在。

是不是DNS环节出了问题？用`nslookup`在aliyunDNS，也就是本地目前正在使用的DNS，上查到了远程目标的IP，在某外国网站上验证了IP对应主机的地理位置，是Google的云服务器机房没错。

打开远程目标的网页版，查找了一下，远程目标使用的是R3签发证书，至少根据Chrome的判断，这个证书是有效的。

在网页上搜索了一下关键词"server certificate verification failed. CAfile: none CRLfile: none"

找到的结果，不是要关掉git的证书验证功能，就是要手动修改证书。要么是只管治驼背，要么看起来过于奇技淫巧。

听起来不太靠谱。如果一个项目按照规范的方法部署，一切正常，那么就不会存在只能用奇技淫巧才能解决的问题，如果用了奇技淫巧，那就像是在稳固的承重墙上打洞，迟早有一天会在这个环节崩掉。

最终，在[适用于 Windows 的 Git：SSL 证书问题：证书已过期(Git for Windows: SSL certificate problem: certificate has expired)](https://www.likecs.com/ask-443866.html)上找到了一个思路：这个话题中的本地证书过期了，那么我这边的本地证书上面是不是缺少了一些签发机构。

回忆一下，本地机的确有很久没有更新过了。

回到home，`sudo apt update`，得到结果，需要更新273个包。

于是`sudo apt upgrade git`。

更新完毕之后，顺利`git clone`。

(以及发现更新了git和git依赖的包之后，本机所有的包全都被更新了一遍)

记录一下，为将来解决某些问题留作启示。

Knightana

2022/04/18
