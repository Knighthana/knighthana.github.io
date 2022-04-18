<meta name="created" content="2019-05-19">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

# Shell Buffer Redirection

Under WSL, if I want to run xfce4, the terminal will give a lot of information.

The information is very useful when developing, or errors accured, but not neccessary when I using it as the other days.

I knew that the output can be redirect to files, but I didn't know what should I do if I don't want to keep it, so I went to find ways for redirecting the stdout and stderr to null.

Try `command > /dev/null` to redirect stdout. But it won't help on stderr.

Try `command > /dev/null 2>&1` to redirect stdout and stderr. It said that "注意：0 是标准输入（STDIN），1 是标准输出（STDOUT），2 是标准错误输出（STDERR）。" on [Runnob](https://www.runoob.com/linux/linux-shell-io-redirections.html).

Knighthana @ XDU

2019/05/19

--------------------------------------------------------

## 注释

原来我WSL历史命令里面最早的那条`startxfce4 > /dev/null 2>&1`是从这里来的啊。

今天编译Craft的时候还纳闷了半天当初咋想到的。

Knighthana

2021年3月24日 于西电
