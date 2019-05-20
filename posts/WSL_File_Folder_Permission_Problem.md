<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

### Problem:WSL file folder permission problem ###

最近在使用WSL(WSL，那么一个WSL就是AWSL，那么就是...XD)来做开发。

遇到了一个问题，就是文件权限方面的，WSL的默认文件权限似乎是777，正常的Linux中应当是目录755文件644。

中间用了很多治标不治本的办法。

最后用一行放在"~/.zshrc"里的带有判断的用于修改umask的代码解决了。umask就是默认用于设置文件权限的，`umask "n n n"` 的作用类似默认对文件进行 `chmod "7-n 7-n 7-n"` 操作。

遗留了一个问题：为何这些代码放在"~/.profile"里的时候没有起作用，目前猜想这应当和WSL的登陆机制有关。

---

Recently I use WSL ( Windows Subsystem for Linux ) for my Linux development.

The problem cames firstly when I use "mkdir" command to creat a folder, its permission mode is 777.

I don't know what happened, the only thing I know is that it's a WSL bug.

At first I make an alias in my .bashrc file like `alias mkdir="mkdir -m 766"`, but it hits the ground target not the root.

I configed my WSL, such as changing sourcem, changing to zsh ( installing Oh-My-Zsh for sure ), opening X11.

And the hatch blowed away.

I searched for that problem, and finded that WSL makes a fault config about "umask".

I typed `umask`, to find that the umask set was 000 ( ordinarily it should be 022 ).

I input `umask 022` in "~/.profile" , but it don't help.

At last I type this in "~/.zshrc" :

`#Fix BUG 2019/5/19 17:23

`if [[ "$(umask)" == '000' ]]; then

`    umask 022

`fi

Finally the problem seems solved.

But there is still a question remains : Why it don't work in "~/.profile".

Knighthana @ XDU

2019/5/19
