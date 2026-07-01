---
title: bash脚本的“参数扩展”中双井号与双百分号的妙用
date: 2024-04-17 22:43:00
cover: /img/Cover-elsecode.jpg
categories:
  - Dev-Code
tags:
  - shell
---

# bash脚本的“参数扩展”中双井号与双百分号的妙用

## 缘起

在某项工作中，需要将一个`cfg`文件（作用类似`ini`文件）交给脚本自动化执行，

然而遇到了配置文件的注释问题，体现为以`#`开头的行会被符合预期地忽略，但是行中从`#`开始的内容并没有被正确地忽略，

这个`cfg`的解析是完全通过自写脚本进行的，现有脚本中是怎么处理的这个`cfg`配置文件的呢？

```shell
while read line; do
    # 处理注释
    if [[ $line == \#* ]]; then
        continue
    fi
    # 执行后面的动作
    blahblah()
done < $filepathname
```

很显然这里只做了`#`开头情况的处理，但是缺少了对`#`在变量`line`内的情况进行处理的语句，没关系，设法写一个出来，

向GPT提问：

> now I use shell script `read` has read a line with `read line`,
>
> I wish to get rid of the `#` and the rest of the line from this line,
>
> what should the script be?


它很快给出了一个方案：

```shell
#!/bin/bash

# Read a line from input
read -r line

# Remove everything after the first occurrence of #
line="${line%%#*}"

# Output the modified line
echo "$line"
```

于是需求得到了解决，但是问题才刚刚开始，这个句子`line="${line%%#*}"`到底做了什么？

## 探寻

起初，我认为这是某种正则表达式，于是以`regular expression`为关键词进行了大量的查找，然而大多数答案只是说`%%`在正则表达式中表示一个字面意义的`%`，并没有找到满意的答案

最后还是得靠`manpage`：`man bash`，然后用`/`搜索`%`，我很快找到了答案，就在“Parameter Expansion”一节中：

```
${parameter#word}
${parameter##word}
    Remove matching prefix pattern. The word is expanded to produce a pattern just as in pathname expansion. If the pattern matches the beginning of the value of parameter, then the result of the expansion is the expanded value of parameter with the shortest matching pattern (the ``#'' case) or the longest matching pattern (the ``##'' case) deleted. If parameter is @ or *, the pattern removal operation is applied to each positional parameter in turn, and the expansion is the resultant list. If parameter is an array variable subscripted with @ or *, the pattern removal operation is applied to each member of the array in turn, and the expansion is the resultant list. 

${parameter%word}
${parameter%%word}
    Remove matching suffix pattern. The word is expanded to produce a pattern just as in pathname expansion. If the pattern matches a trailing portion of the expanded value of parameter, then the result of the expansion is the expanded value of parameter with the shortest matching pattern (the ``%'' case) or the longest matching pattern (the ``%%'' case) deleted. If parameter is @ or *, the pattern removal operation is applied to each positional parameter in turn, and the expansion is the resultant list. If parameter is an array variable subscripted with @ or *, the pattern removal operation is applied to each member of the array in turn, and the expansion is the resultant list. 
```

也就是说，这里的`%`与`#`是`bash`解析脚本时使用的，它们作为`bash`的参数扩展进行使用；

其中，`##`用于清理前缀，`%%`用于清理后缀，而且允许搭配`*`来选中任意内容；

顺便，单井号`#`和单百分号`%`也是可以的，但是为了代码的辨识度，还是用双井号与双百分号吧；

## 实践

作为实验，我们撰写一个shell脚本，命名为`syousyuuzai.sh`：

```shell
#!/usr/bin/env bash

# Read a line from input
read -r line

# Remove everything stinky
line="${line%%stink*}"
line="${line##*yajuu}"

# Output the modified line
echo "$line"
```

然后执行它，随便输入一行字符，可以看到如下的效果：
```shell
➜  ~ ./syousyuuzai.sh
yajuuasdfghjkl
asdfghjkl
```

同理：
```shell
➜  ~ ./syousyuuzai.sh
asdfghjklstink
asdfghjkl
```

前后同时输入也是可以的：
```shell
➜  ~ ./syousyuuzai.sh
yajuuasdfghjklstink1919810
asdfghjkl
```

## 实验中的两个事件

### 不能把`%`与`#`组合起来写在同一行中

实验时发现，并不能把`%`与`#`组合起来写在同一行中，也就是这样`line="${line##*yajuu%%stink*}`达到前后同时除臭的效果，如果不信邪的话我们可以写个`copy_syousyuuzai.sh`出来：

```shell
#!/usr/bin/env bash

read -r line
line="${line##*yajuu%%stink*}"
echo "$line"
```

这样写脚本的话，运行的时候会变成这样：
```shell
➜  ~ ./copy_syousyuuzai.sh
yajuuasdfghjklstink
yajuuasdfghjklstink
```

以及这样：
```shell
➜  ~ ./copy_syousyuuzai.sh
yajuu%%stinkasdfghjkl
(空荡荡)
```

所以，如果要对前后缀同时做匹配，只能分次进行；

### `*`做前后缀

另外，相信从上面的文本中不难观察到这样的规律，那就是如果把`*`作为`prefix`的后缀，或者把`*`作为`suffix`的前缀，都是可以被正常理解并执行的，但是效果是把所有的内容都移除掉了

比如做一个最简单的实验脚本`copy_syousyuuzai,sh`：

```shell
#!/usr/bin/env bash

read -r line

line="${line##yajuu*}"

echo "$line"
```

第一次，测试没有直接以恶臭数字开头
```shell
➜  ~ ./copy_syousyuuzai.sh
asdfhyajuujklmn
asdfhyajuujklmn
```

显而易见地，由于没有直接以恶臭数字开头，且没有写通配符，于是没有通过比对，整个字符串不做筛选就输出了，除臭大失败；

第二次试验，以恶臭数字开头
```shell
➜  ~ ./copy_syousyuuzai.sh
yajuuasdfghjkl
(空荡荡)
```

显而易见地，整个字符串全没了，虽然我们失去了整个字符串，但我们除臭了；

第三次试验，我们修改了脚本如下：
```shell
#!/usr/bin/env bash

read -r line

line="${line%%*yajuu}"

echo "$line"
```

然后进行了这样的输入，获取了这样的输出：
```shell
➜  ~ ./copy_syousyuuzai.sh
asdfghjklyajuu
(空荡荡)
```

相信不难从中看出规律

掌握了这个技巧，就可以轻松地在脚本中除臭杀菌了；

虽然`bash`的`Parameter Expansion`特性有很多，不过这次就只学这些了。

## 关于`read`的`-r`选项的解释

> -r
>
>     Backslash does not act as an escape character. The backslash is considered to be part of the line. In particular, a backslash-newline pair may not be used as a line continuation. 

也就是说，用`-r`时，`read`会忽略反斜杠的`escape`含义也就是转义含义，会把反斜杠作为句子的一部分处理；

特别地，即便使用了`-r`选项，每行输入仍然被视为独立的行，而不能使用反斜杠和换行符来试图将它们组合成单个逻辑行。

Knighthana

2024/04/12
