<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

### Windows C Work Configure ###

#### Install only C compiler on Windows: ####
1. Get Visual Studio Installer @ [Download][https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16]
2. Select functions to install:
    "MSVC"
    "Windows 10 SDK"
    "C++/CLI Support"
3. Wait until installation is finished;
4. Input "developer powershell for vs 2019" in windows start menu, and open it.

### Install Git ###
1. Since I have installed WSL, I don't need an extra UNIX-like environment, so I only need the git function;
2. Search and download git-scm for windows;
3. Install only git functions;
4. Copy my existing ssh file to (Windows)~/.ssh/id_rsa and exec `ssh-add /c/users/myusername/.ssh/id_rsa`;
5. Exec`ssh -T git@github.com` to check if ssh functions work well.
6. (optional) Go to regedit.exe and check"计算机\HKEY_CLASSES_ROOT\Directory\Background\shell", add a string value "Extended" in key "git-gui" and "git-shell";
### Deploy Visual Studio Code ###
1. Install Visual Studio Code;
2. Install some useful plug-ins
    "Language pack" by Microsoft
    "Remote-WSL" by Microsoft
    "Settings Sync" by Shan Khan
    "Git History" by Microsoft

By the way, I don't know why MS like purple so much, so I added
```
 "workbench.colorCustomizations": {
        "statusBar.background" : "#1874CD",
        "statusBar.noFolderBackground" : "#1874CD",
        "statusBar.debuggingBackground": "#1874CD"
    },
```
in settings.json
Coding Gulog will be pushed later

Knighthana@XDU
2019/11/06
