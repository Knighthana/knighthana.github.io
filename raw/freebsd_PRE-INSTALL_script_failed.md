<meta name="created" content="2021-07-01"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

# 在FreeBSD中通过pkg安装软件时遇到pre-install script failed问题

  打开尘封了一段时间的FreeBSD，试图pkg install发现版本号跟不上了。
  
  一通换源和freebsd-update之后终于升级到了最新版本12.2-RELEASE，然后在安装软件的时候遇到了报错“pre-install script failed”

  目前尚不清楚原因，但有前人的例子：

  论坛网页1：[Solved PRE-INSTALL script failed](https://forums.freebsd.org/threads/pre-install-script-failed.69547/)

  论坛网页2：[Solved Error adding new user - pw: user 'anne' disappeared during update](https://forums.freebsd.org/threads/error-adding-new-user-pw-user-anne-disappeared-during-update.59525/#post-341447)

  根据网页2中论坛用户[SirDice](https://forums.freebsd.org/members/sirdice.1677/)的说法，这是因为有关权限和密码的数据库没有同步导致的。

  解决方案有两个：

  1. Run `/usr/sbin/pwd_mkdb -p /etc/master.passwd`.

  2. Running [vipw(8)](https://www.freebsd.org/cgi/man.cgi?query=vipw&sektion=8&manpath=freebsd-release-ports) and save-and-quit (without actually making any changes) also fixes it (easier to remember).

  vipw是用于编辑passwd文件的命令，估计是vi-passwd的缩写之类的
  
  这个问题似乎经常在更新完系统版本之后发生，但是很隐蔽，感觉不出来是一个权限方面导致的问题。

  Knighthana @ XDU

  2021/07/01
