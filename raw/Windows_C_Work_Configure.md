<meta name="created" content="2019-11-06">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

# Windows下编写C语言程序的准备工作

## 在Windows上安装C编译器

1. 下载并安装[Visual Studio Installer][https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16]

2. 选中这些需要安装的功能:

    "MSVC"
    "Windows 10 SDK"
    "C++/CLI Support"

3. 等它装完（需要很长时间）;

4. 按super键，输入"developer powershell for vs 2019"就可以打开自动配置好的编译器终端了.

## 安装git

以前安装过windows的git-scm，但嫌不够优雅后来就没用过，不如直接VSC+WSL一气呵成；

以前写的英文是这么说的，懒得再写一遍了：

1. Since I have installed WSL, I don't need an extra UNIX-like environment, so I only need the git function;
2. Search and download git-scm for windows;
3. Install only git functions;
4. Copy my existing ssh file to (Windows)~/.ssh/id_rsa and exec `ssh-add /c/users/myusername/.ssh/id_rsa`;
5. Exec`ssh -T git@github.com` to check if ssh functions work well.
6. (optional) Go to regedit.exe and check"计算机\HKEY_CLASSES_ROOT\Directory\Background\shell", add a string value "Extended" in key "git-gui" and "git-shell";

----------------------------

## 把Visual Studio Code调整成顺眼的状况（可以不用了，因为现在VSC支持登陆MS账号同步设置的功能了）：

安装一些有用的组件：

1. Install Visual Studio Code;
2. Install some useful plug-ins
    "Language pack" by Microsoft
    "Remote-WSL" by Microsoft
    "Settings Sync" by Shan Khan （现在可以不用装了）
    "Git History" by Microsoft

不太喜欢那个紫色的底部，我喜欢淡蓝色的，因此直接在设置的`settings.json`里面增加如下内容：

```
 "workbench.colorCustomizations": {
        "statusBar.background" : "#1874CD",
        "statusBar.noFolderBackground" : "#1874CD",
        "statusBar.debuggingBackground": "#1874CD"
    },
```

Coding Gulog will be pushed later

Knighthana

2019年11月06日 于西电
