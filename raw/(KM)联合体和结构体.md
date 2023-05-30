---
title: (KM)联合体和结构体
date: 2023-05-22 00:00:00
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
tags:
  - C
---

# 联合体和结构体

很久之前的某次面试被问到这个，我只是隐隐约约记得联合体是“共用”关系，而结构体则是原来熟悉的样子

而且记得有个`struct_addrin`什么的

现在想起来，查了一下，刷新一下内存 [结构体和联合体的区别](https://www.cnblogs.com/nktblog/p/4027107.html)

## `sockaddr_in` 和 `sin_addr`

顺带一提，那个结构体的名字明明是[sockaddr_in](https://pubs.opengroup.org/onlinepubs/009695399/basedefs/netinet/in.h.html)

而且它并不是联合体

看起来面试那天是猪脑过载了

虽然和本文主题无关，但是把概念搞清楚一点总没错

在[man7.org](https://man7.org/linux/man-pages/man7/ip.7.html)得到了说明

> An IP socket address is defined as a combination of an IP
>
> interface address and a 16-bit port number.  The basic IP
>
> protocol does not supply port numbers, they are implemented by
>
> higher level protocols like udp(7) and tcp(7).  On raw sockets
>
> sin_port is set to the IP protocol.

```C
struct sockaddr_in {
    sa_family_t    sin_family; /* address family: AF_INET */
    in_port_t      sin_port;   /* port in network byte order */
    struct in_addr sin_addr;   /* internet address */
};
```

```C
/* Internet address */
struct in_addr {
    uint32_t       s_addr;     /* address in network byte order */
};
```

`sockaddr_in`是一个联合体，三个成员分别指定了scoket的类型与版本、端口号、地址

在TCP/IP中，`sin_family`一般是`AF_INET`，也就是IPv4，对于IPv6则是`AF_INET6`，端口号当然是端口号，而且这一步应该还不能确定是TCP还是UDP，所以仅仅是个端口号，地址的话当然就是IP地址

是TCP或者是UDP？这是根据创建的`socket`不同来确认的，如果`socket`选择`SOCK_STREAM`那就是TCP，如果是`SOCK_DGRAM`那就是UDP

Knighthana

2023/05/26
