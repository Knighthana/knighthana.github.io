---
title: strtoul()几个参数的含义
date: 2024-04-10 22:45:00
cover: /img/Cover-CPLang.jpg
categories:
  - Dev-Code
tags:
  - C
---

# strtoul 几个参数的含义与使用场合

`strtoul`实际上是一组声明位于`stdlib.h`中的`libc`函数，同组的函数还有`strtoull`，分别用于转换到`unsigned long`和`unsigned long long`

根据`manpage`中的说明，其原型如下：

```C
#include <stdlib.h>
unsigned long strtoul(const char *nptr, char **endptr, int base);
unsigned long long strtoull(const char *nptr, char **endptr, int base);
```

其中，`nptr`和`base`的作用都很好理解，但是`endptr`的作用是什么？

我曾经没看`manpage`使用`stroul`，按照字面意思去理解`endptr`，那一定是末尾字符吧，于是我对其作用直接进行了武断的猜想

“这一定是用来标记字符串结尾的东西，所以是一个保险！”

于是就这么用了（吐血）

```C
long value = stroul(stringtoconvert, '\0', 16);
```

然后不出意外地`clangd`报错了：

> Expression which evaluates to zero treated as a null pointer constant of type '`char **`'

难道是类型错误，确实，`'\0'`是一个字符常量，并非`char**`，那传个`"\0"`吧，

于是这下错得更离谱了

> Incompatible pointer types passing '`char[2]`' to parameter of type '`char **`'

（`"\0"`也只是一个`char*`而已，你在想什么啊 Kora ！）

由于当时的时间很紧张，只能传入一个`0x0`了事，这下没有报错了

那么，`endptr`的作用究竟是什么呢？遇事不决`manpage`

> If  `endptr`  is  not `NULL`, `strtoul()` stores the address of the first invalid character in `*endptr`.
>
> If there were no digits at all, `strtoul()` stores the original value of `nptr` in `*endptr` (and returns `0`).
>
> In particular, if `*nptr` is not `'\0'` but `**endptr` is `'\0'` on return, the entire string is valid.

那么问题就很清晰了，`endptr`确实是一个保险，但是它不是我所设想的函数执行中的防越界保险，而是一个函数执行后，调用者对值进行检查的保险；

`char** endptr`是一个用于存储`char`类型变量地址的指针的地址，提供给`stroul`用作写入，以便在执行过程中回传转换后遇到的首个非数字字符的地址，

比如说用这个例程来解释它们的用途：

```C
#include <stdio.h>
#include <stdlib.h>

int main()
{
    int value;
    char* enddragon = NULL;
    char poem[] = "12345: I see the player you mean.";
    value = strtoul(poem, &enddragon, 16);
    printf("%d\n`%c`\n", value, *enddragon);
    return 0;
}

```

执行它，可以看到打印结果是

```
74565
`:`
```

而冒号就是16进制下首个非数字的字符；

以及，"in particular"一句的含义是，如果`nptr`不指向字符串结尾但是结束后从`endptr`处拿到的是`\0`，那么整个字符串都被认为是有效的数字，

感觉这句话的初见多少有点让本来就已经很明确的含义又变得不明确了，不过大概是原本这个函数支持将某个乱七八糟字符串中的首个为数字的字符的地址传入，并截取转换出一段有用的数字串来，

但现在实际使用的时候，一般是将数字字符串单独存成一个`char[]`，并把字符串首地址传入函数，因此也没什么要注意的，

不过按照这个叙述的话，记得数字字符串末尾一定要用`\0`结尾，以免越界访问不知道跑出个什么结果来；

顺带一提，根据`manpage`

> The  string  may begin with an arbitrary amount of white space (as determined by `isspace(3)`) followed by a single optional '`+`' or '`-`' sign.

所以，`strtoul`在数字之前只接受空字符和正负号，否则直接进入返回；

Knighthana

2024/04/10
