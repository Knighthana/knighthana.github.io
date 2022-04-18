<meta name="created" content="2021-07-24">

# ERROR: File not found '/run/cloud-init/instance-data.json'. Provide a path to instance data json file using --instance-data

## 症状:

使用apt期间，在执行至`Setting up ubuntu-advantage-tools`时

`ERROR: File not found '/run/cloud-init/instance-data.json'. Provide a path to instance data json file using --instance-data`
`dpkg: error processing package ubuntu-advantage-tools (--configure):`
` installed ubuntu-advantage-tools package post-installation script subprocess returned error exit status 1`
`Errors were encountered while processing:`
` ubuntu-advantage-tools`
`E: Sub-process /usr/bin/dpkg returned an error code (1)`

## 解决方案：

先执行一遍`sudo cloud-init init`

## 参考：

[ubuntu-advantage-tools package in Ubuntu](https://launchpad.net/ubuntu/+source/ubuntu-advantage-tools)

[cloud-init-The-cross-cloud-Magic-Sauce-Scott-Moser-Chad-Smith-Canonical.pdf](https://events19.linuxfoundation.org/wp-content/uploads/2017/12/cloud-init-The-cross-cloud-Magic-Sauce-Scott-Moser-Chad-Smith-Canonical.pdf)

[Instance Metadata](https://cloudinit.readthedocs.io/en/18.4/topics/instancedata.html)


[capabilities](https://cloudinit.readthedocs.io/en/18.4/_sources/topics/capabilities.rst.txt)

## 其他：

"apt"和"dpkg"是系统中至关重要的包管理软件，无法理解为什么允许有这种莫名其妙的错误发生。

这个莫名其妙的新软件包"ubuntu-**advantage**-tools"因为找不到某个与另一程序"cloud-init"有关的文件就卡住了，然后dpkg也不管不问因此卡住仅仅return了一个1，进而所有的apt指令都失去效果，整个系统差点就不能用了。

查询发现cloud-init并不是什么对于操作系统运行至关重要的东西。

这套包管理系统简直是脆弱。

K.

2021-07-24
