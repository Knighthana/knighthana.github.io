<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

# Linux下来自中文Windows操作系统的zip文件文件名出现乱码情况的解决方案

如何把在Windows下打包的，文件名被编码为GBK的文件转化为使用Linux下惯用的UTF-8编码的文件名的文件呢？
目前使用的可行的方法
` uzip -O cp936 * `
引用自：
[Linux 下 zip 文件解压乱码如何解决？ - Latm Ake的回答 - 知乎]https://www.zhihu.com/question/20523036/answer/35225920

> 由于zip格式中并没有指定编码格式，Windows下生成的zip文件中的编码是GBK/GB2312等，因此，导致这些zip文件在Linux下解压时出现乱码问题，因为Linux下的默认编码是UTF8。目前网上流传一种unzip -O cp936的方法，但一些unzip是没有-O这个选项的。我使用的版本 unzip 6.0 debian modified 版本有这个选项我发现另外两种解决方案可用。

> python方案
> 此方案目前来看非常完美。

```
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import zipfile

#print "Processing File " + sys.argv[1]

file=zipfile.ZipFile(sys.argv[1],"r");
for name in file.namelist():
    utf8name=name.decode('gbk')
#    print "Extracting " + utf8name
    pathname = os.path.dirname(utf8name)
    if not os.path.exists(pathname) and pathname!= "":
        os.makedirs(pathname)
    data = file.read(name)
   if not os.path.exists(utf8name):
       fo = open(utf8name, "w")
       fo.write(data)
      fo.close
file.close()
```
> Windows 用户屏蔽两条 print 语句，Linux 用户不用屏蔽7z方案
> 需要安装p7zip和convmv，在Fedora下的命令是su -c 'yum install p7zip convmv'
> 在ubuntu下的安装命令是sudo apt-get install p7zip convmv
> 安装完之后，就可以用7za和convmv两个命令完成解压缩任务。LANG=C 7za x your-zip-file.zip
> convmv -f GBK -t utf8 --notest -r .
> 第一条命令用于解压缩，而LANG=C表示以US-ASCII这样的编码输出文件名，如果没有这个语言设置，它同样会输出乱码，只不过是UTF8格式的乱码(convmv会忽略这样的乱码)。第二条命令是将GBK编码的文件名转化为UTF8编码，-r表示递归访问目录，即对当前目录中所有文件进行转换。
> 编辑于 2014-12-20

	下面的几个方法目前（2018-1-12）还没试过，将来有机会可以试试。
	不过目前系统中有很多从手机上拷贝过来的音乐文件的文件名和歌曲信息仍然是乱码，而这些文件没法用这个方法，而且conmv的话，由于文件名已经是UTF8的乱码了，所以暂时没有解决方案。如果Python方案可行的话，等我学会Python以后咕且试试。

写于2018/01/12
Knighthana@Hp-ELite in XDU
