---
title: Take Space Key In Scanf
date: 2019-06-06 00:00:00
cover: /img/Cover-CPLang.jpg
categories:
  - Dev-Code
tags:
  - C
---

# Take Space Key In Scanf

---------------

## How to colorful a C text in linux shell?

```c
printf("\033[0;32;40m%s\033[0m$",pwd(user));
```
used in my code.

```c
\033[0;32;40m
```
means ordinary text, green text, black background.

```c
\033[0m
```
means change back to default settings.

## How to take a space key while using scanf?

```c
scanf("%[^\n]",buf);
```
means that get input until a '\n', and save it into buf.

```c
scanf("%[^\n]%*c",buf);
```
means that get input until a '\n', and save it into buf, then drop next character('\n').(I will use in my function).

```c
scanf("%*[^\n]%*c");
```
means thet get input until a '\n', and drop it, then get a character('\n'), drop it too.

```c
scanf("%*[^a]%*c%c",&ch);
```
means that get input until a  'a', and drop it, then get a character( 'a'), drop it too. After that, get a character and save it into ch.

input:

  > bcdeaf

output:

  > f

Refer: [scanf读取含空格的字符串](https://blog.csdn.net/chuhe163/article/details/81048751)

Knighthana@XDU

2019/6/6
