<meta name="created" content="2021-08-11">

# VirtualBox扩容磁盘之后在虚拟机中未发现磁盘空间扩大的情况

在VirtualBox的虚拟机“存储”标签上直接右键磁盘是没有容量管理选项的，所以操作前先去搜索了一下。

有意思的是扩容前去搜如何操作，在启用了GG建议的搜索栏中输入“Virtualbox 磁盘”几个字之后，第一个联想结果是“VirtualBox 磁盘扩容”，不得不说这可真是个常见问题。

批判一下，目前网上的资料把扩容操作说得非常复杂，什么使用命令行，什么找到磁盘文件目录，什么输入XXX个数字。

看着要敲命令好像非常高端，但是照抄别人的命令待会虚拟机炸了怎么办？所以我最后又回到VBox界面仔细找，因为一个成熟的虚拟机软件应该有提供调整磁盘容量的功能。

最后在VirtualBox自己左上角的管理菜单找到了此项功能，名字就叫“虚拟介质管理”。

虽然这确实和VMware的思路不太一样，因为我记得VM是在单个虚拟机的菜单里管理对应虚拟机的磁盘文件，而不是VBox这样把所有虚拟盘文件集中在一起管理。

这是个GUI管理工具，操作非常直观，所以扩容过程没什么好说的。

然后打开虚拟操作系统里的磁盘管理工具就出现问题了，磁盘管理工具不认为磁盘上还存在未分配的磁盘空间。

起初我以为是系统没有刷新或者怎么样导致的，用了几次刷新磁盘按钮，反复重启，然而都没有检测到还有未分配的磁盘空间。

从VBox的菜单来看，磁盘的大小是已经扩容过的了。

问题出在哪呢？

搜了一圈，都是C**N里面的假设用户非常simple、非常naive的关键词博文，似乎所有人都不知道在软件里扩容完磁盘要进虚拟操作系统再分配一下似的，很失望。

我还等着扩容完磁盘继续设置虚拟机呢。

最后以“free space not enlarge after virtualbox disk”为关键词去GG上搜索。

顺带一提GG纠正了我的语法错误，改为了“free space not enlarged after virtualbox disk”的搜索结果。

然后就是非常精准的VBox论坛的结果：

[Windows doesn't see enlarged virtual disk.](https://forums.virtualbox.org/viewtopic.php?f=2&t=80349)

 * 顺带一提里面导向了这个解决问题的链接[How to resize a Virtual Drive](https://forums.virtualbox.org/viewtopic.php?f=35&t=50661) *
 
 直接去这里找答案就行

第一个帖子往下翻，有一个老哥一眼看破了问题的关键，直击人心：


  Re: Windows doesn't see enlarged virtual disk.

  Postby Perryg » 26. Oct 2016, 16:29
  Let me guess. You have snapshots, correct?
  If so then you need to read the third topic in the link provided.

我想了一下目前的虚拟机确实有好几个快照。

所以最后解决方案是删除快照备份。

还好这只是我自己的隔离用的虚拟机，而且虚拟机刚启用没多久，这些快照只是每次安装新软件之前习惯性的备份，不然删掉备份这种事情多少有点蛋疼。

总之，VBox的磁盘快照会影响磁盘扩容的功能，以上。

Knighthana

2021/08/11
