---
title: 为Boa Web Server的CGI增添自定义链接库
date: 2023-11-17 23:16:02
updated: 2024-01-08 00:43:00
cover: http://www.boa.org/boa_banner.png
categories:
  - Dev-Code
tags:
  - C
  - 草台教程
  - BoaWebServer
---

# 为Boa Web Server传递给CGI的环境变量增添自定义内容

**请注意，这是一篇草台教程，含有半懂不懂的内容**

## 背景介绍

出于工作方面需要，得为[Boa Web Server](http://www.boa.org/)的服务器设置一个环境变量

于是我在不稳定版本`0.94.14rc21`上开始了工作

（为什么不在`0.94.13`稳定版本上开工？因为`0.94.13`版本使用了`flex`语法分析器辅助生成代码，而`flex`这个玩意搞出来的一坨东西在我的编译器上飘得满屏是`warning`，与之相比，使用了自定义Parser的`0.94.14rc21`的警告就少得多了，都是一些要求“不得忽略函数返回值”的`warning`）

显而易见的是，使用非稳定版肯定会有更多BUG，毕竟还是有很多地方写着`fixme`或者`why`一类的注释，不过相比这个快二十年的老项目的其他BUG还有已经广为人知的致命漏洞而言，这点可能会多出来的BUG不痛不痒（预感这句话未来会被打脸）

其实我个人还是比较敬佩这些写Boa代码的人的，不得不说，二十多年前写出来的这个东西，占用极其小，功能放在当年来说也是很全面的，性能也还不错

而且从注释里面都很能看出来他们的代码态度，比如`0.94.13`中的这段注释

> We (I, Jon) have declined to support absolute-path parsing
> because I see it as a major security hole.
> Location: /etc/passwd or Location: /etc/shadow is not funny.
>
> Also, the below code is borked.
> request_uri could contain /cgi-bin/bob/extra_path

我是很喜欢有脾气的人做的活的——前提是脾气得和我对得上，或者换个说法，有人管这种叫“有态度”，反正就是那么一回事

废话不多说，开始正题

## 如何找到有关环境变量传递的部分代码？

在`boa.conf`中有一个配置叫做“CGIPath”，跟随这个关键词搜索`boa`源代码目录，我们可以找到，除去`boa.conf`以外，有这么一个代码文件与它有关

**`config.c`**
```c
struct ccommand clist[] = {
    ......
    {"CGIPath", S1A, c_set_string, &cgi_path},
    ......
}
```

即便看不太懂这是什么样的结构体，也能发现这里有个`char`指针`cgi_path`和前面的`CGIPath`对应

*（其实稍微解读一下就能发现，这是一个结构体数组，结构体的四个成员分别是一个字符串，一个起枚举作用的宏定义量，一个函数指针，一个`char`指针）*

那么搜索一下`cgi_path`，除去`config.c`之外，还有`globals.h`和`cgi.c`两个文件与`cgi_path`有关

**`globals.h`**
```c
extern char *cgi_path;
```

**`cgi.c`**
```c
common_cgi_env[common_cgi_env_count++] = env_gen_extra("PATH",
                                        ((cgi_path !=
                                        NULL) ? cgi_path :
                                        DEFAULT_PATH), 0);
```

那么不难猜测，我们要修改的文件就是这三个了，就像[上次修改Linux系统调用](/Dev-Code/自己搞一个Linux系统调用的一点记录.html)一样

*ほんとうですか*

## 增加自定义环境变量，分三步走

### 第一步，增加声明

在`globals.h`中，传递`PATH`的那个变量的下面增加我们自己的声明语句

修改前
```c
extern char *cgi_path;
extern short common_cgi_env_count;
```

修改后
```c
extern char *cgi_path;
extern char *cgi_ld_library_path;
extern short common_cgi_env_count;
```

### 第二步，向结构体数组插入一个结构体

在`config.c`中添加一个类似的东西

由于我们很清楚，`LD_LIBRARY_PATH`是一个很类似`PATH`的东西，因此照抄`PATH`的结构体

修改前
```c
{"CGIPath", S1A, c_set_string, &cgi_path},
{"CGIumask", S1A, c_set_int, &cgi_umask},
```

修改后
```c
{"CGIPath", S1A, c_set_string, &cgi_path},
{"CGILdLibraryPath", S1A, c_set_string, &cgi_ld_library_path},
{"CGIumask", S1A, c_set_int, &cgi_umask},
```

### 第三步，增加函数

照抄`PATH`的写法，我的写法是这样的 

```c
common_cgi_env[common_cgi_env_count++] = env_gen_extra("LD_LIBRARY_PATH",
    ((cgi_ld_library_path != NULL) ? cgi_ld_library_path : DEFAULT_LD_LIBRARY_PATH),
    0);
```

当然不做这个三目运算判断也不是不行，但是我觉得万一`conf`里面忘了写，总不能真地传一个空的`LD_LIBRARY_PATH`给CGI程序吧，于是也写了这个宏，那就得顺便去头文件那边定义一个字符串宏

在`defines.h`里面加一行
```c
#define DEFAULT_LD_LIBRARY_PATH "/the/original/library/path:/my/custom/library/path"
```

### 第四步，增加

*一共三步的教程里面有四步不是很合理嘛！*

如果真的只干了上面三步，兴冲冲地去`make`的话就会发现`make`出来的结果不能用 *QAQ*

反正我是`make`完了才发现报错

> COMMON_CGI_COUNT not high enough.

啊这……

其实`cgi.c`的`create_common_env`的注释写得很明白

```c
/* NOTE NOTE NOTE:
    If you (the reader) someday modify this chunk of code to
    handle more "common" CGI environment variables, then bump the
    value COMMON_CGI_COUNT in defines.h UP

    Also, in the case of document_root and server_admin, two variables
    that may or may not be defined depending on the way the server
    is configured, we check for null values and use an empty
    string to denote a NULL value to the environment, as per the
    specification. The quote for which follows:

    "In all cases, a missing environment variable is
    equivalent to a zero-length (NULL) value, and vice versa."
    */
```

所以说还有个后备隐藏变量需要我们改一下，也在`defines.h`里面

在`defines.h`里面找到
```c
#ifdef USE_NCSA_CGI_ENV
#define COMMON_CGI_COUNT 8
#else
#define COMMON_CGI_COUNT 6
#endif
```
修改成
```c
#ifdef USE_NCSA_CGI_ENV
#define COMMON_CGI_COUNT 9
#else
#define COMMON_CGI_COUNT 7
#endif
```
顺带一提，我数了一下`cgi.c`里面一共是`PATH` `SERVER_SOFTWARE` `SERVER_NAME` `GATEWAY_INTERFACE` `SERVER_PORT` 共5个环境变量，但为什么这里原本写的是`6`呢？

在`cgi.c`的`create_common_env`函数开头有这么一处
```c
void create_common_env(void)
{
    int i;
    common_cgi_env = calloc((COMMON_CGI_COUNT + 1),sizeof(char *));
    common_cgi_env_count = 0;

    if (common_cgi_env == NULL) {

/* ...........blahblah.........
 * ...........blahblah.........
 * ...........blahblah.........
 */
    }

}
```

里面写道：**`common_cgi_env = calloc((COMMON_CGI_COUNT + 1),sizeof(char *));`**

为啥要这么写，咱也不知道，咱也不敢问，也不敢改

（好奇`calloc`是什么，查了一下，知道了`calloc`可以自动把分配的内存清零，顿时感觉写出`malloc();memset(0x0)`的自己非常地铁憨憨）

于是收工

```shell
make -j16
```

## 修改boa.conf

在`boa.conf`里面，靠着`CGIPath`的地方，我们修改一下，弄这么一行

```conf
CGILdLibraryPath /this/is/my/lovely/library.so/contained/path
```

就完事了

了……吗？

非也

注意看……这个代码叫`cgi.c`

```c
env_gen_extra("PATH",((cgi_path != NULL) ? cgi_path : DEFAULT_PATH), 0);
```
以及
```c
/*
 * Name: env_gen_extra
 *       (and via a not-so-tricky #define, env_gen)
 * This routine calls malloc: please free the memory when you are done
 */
static char *env_gen_extra(const char *key, const char *value,
                           unsigned int extra)
{
    char *result;
    unsigned int key_len, value_len;

    if (value == NULL)          /* ServerAdmin may not be defined, eg */
        value = "";
    key_len = strlen(key);
    value_len = strlen(value);
    /* leave room for '=' sign and null terminator */
    result = malloc(extra + key_len + value_len + 2);
    if (result) {
        memcpy(result + extra, key, key_len);
        *(result + extra + key_len) = '=';
        memcpy(result + extra + key_len + 1, value, value_len);
        *(result + extra + key_len + value_len + 1) = '\0';
    } else {
        log_error_time();
        perror("malloc");
        log_error_time();
        fprintf(stderr, "tried to allocate (key=value) extra=%u: %s=%s\n",
                extra, key, value);
    }
    return result;
}
```

我来解读一下啊，这里说的是，要是有默认的宏定义`DEFAULT_PATH`，那就用这个默认的，要是`conf`里面有写内容，让`cgi_path`不为空，那就……

把配置文件里面写的东西贴在这里然后加上等号……………………然后直接传给CGI程序

等 等 等 等 等 等 等 等 等 等 等 等 等 等 等 一下！

*ちょっと待ってください！！！*

`env`自带的`$PATH`呢？`$LD_LIBRARY_PATH`呢？

全都没有啦！

是的，直接没有了，不仅如此，连我们在宏里本来定义的`DEFAULT_PATH`和`DEFAULT_LD_LIBRARY_PATH`都没有顺便传进去

所以这里注意了……

## Boa WebServer 的环境变量配置逻辑

Boa的环境变量就是假如配置文件`boa.conf`没写，就传个默认的进去，假如写了，就只传写在`conf`里面的内容进去

所以这也解释了为什么我之前有一次CGI拿到的`PATH`变量见了鬼的事件

实际上人家的逻辑本来就是那样，写得很清楚了(而且看了代码逻辑，感觉换我来写我也这么写)

```conf
# CGIPath: The value of the $PATH environment variable given to CGI progs.
```

这里的提示写的是 **`given to`** 而不是`add to`，所以注意了，

**`boa.conf`里的环境变量要么不写，要写就一定要写全了**

## 尾声

于是我打算`fork`一个`boa web server`，碰到哪里有啥问题就改一改

*等到改不动了就弃坑跑路*

已经fork出来了 [Yet Another Boa Webserver Fork](https://github.com/Knighthana/YABWF)

----------------------------------------------

Knighthana

2023/11/17
