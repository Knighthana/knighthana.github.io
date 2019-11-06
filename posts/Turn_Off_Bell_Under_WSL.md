
# Turn Off Bell Under WSL

 看起来各Linux发行版默认是关掉shell的bell的，但是这其中不包括WSL。
 于是换了一个环境的我不得不面对shell又开始（又？）发出恼人的声音的问题（vim：其实我也...）。
 没关系，关bell这事不久前才做过，我只需要找一下资料就好。
 于是搜了一下，（又）找到了：

--------------

## [「VIM」关闭vim的BELL声音][https://blog.csdn.net/qq_35448976/article/details/77840841]

> 可以在 vi/vim 中使用
> `:set noeb`
> 命令（其中 `noeb` 是 `noerrorbells` 的缩写），这样当错误发生的时候将不会发出 bi 的一声。
> 这样也许已经足够了，但是当我们彻夜编程序的时候，尤其是在跟他人同住（比如学生宿舍）的时候这样的闪烁也会影响别人。这时候可以使用
> `:set vb t_vb=`
> 命令，这下 vi 的出错发声就彻底被禁止了。

 根据我试验的结果，`set vb t_vb=` 这一个命令就足够了，上面那个注释掉也没关系。
## [禁用WSL的shell提示音][https://www.jianshu.com/p/f62971cbe80b]

> zsh

> 1.sudo vi ~/.zshrc
> 2.文件末尾添加unsetopt beep
> 3.source ~/.zshrc

 由于我使用的是zsh，所以只抄了zsh的部分，bash的是 `set bell-style none`

 至此问题解决，提示音ZNMDJ（

 Knighthana@Home
 2019/06/07
