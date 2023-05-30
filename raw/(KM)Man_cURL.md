---
title: (KM)Manual page of cURL
date: 2023-04-16 00:00:00
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
tags:
  - man
  - cURL
---

# Manual page of cURL

```shell
curl -fsSL
```

含义是静默地下载文件

```bash
curl -fsSL -O $URL
```

则是从URL处下载一个原名的文件

那么常用的无外乎两种情况

从国内下载文件时，使用

```bash
curl -fsSL -O $URL
```

可以快速且静默地下载完文件

下载国外的文件时，应该使用

```bash
curl -fSL -O $URL
```

以便监视是不是下着下着就断线了

-f, --fail

(HTTP) Fail silently (no output at all) on server errors. This is mostly done to enable scripts etc to better deal with failed attempts. In normal cases when an HTTP server fails to deliver a
document, it returns an HTML document stating so (which often also describes why and more). This flag will prevent curl from outputting that and return error 22.

-s, --silent

Silent or quiet mode. Do not show progress meter or error messages. Makes Curl mute. It will still output the data you ask for, potentially even to the terminal/stdout unless you redirect it.

-S, --show-error

When used with -s, --silent, it makes curl show an error message if it fails.

-L, --location

(HTTP) If the server reports that the requested page has moved to a different location (indicated with a Location: header and a 3XX response code), this option will make curl redo the request
on  the  new place. If used together with -i, --include or -I, --head, headers from all requested pages will be shown. When authentication is used, curl only sends its credentials to the ini‐
tial host. If a redirect takes curl to a different host, it will not be able to intercept the user+password. See also --location-trusted on how to change this. You can  limit  the  amount  of
redirects to follow by using the --max-redirs option.

When  curl  follows  a  redirect  and if the request is a POST, it will send the following request with a GET if the HTTP response was 301, 302, or 303. If the response code was any other 3xx
code, curl will re-send the following request using the same unmodified method.

You can tell curl to not change POST requests to GET after a 30x response by using the dedicated options for that: --post301, --post302 and --post303.

The method set with -X, --request overrides the method curl would otherwise select to use.

-O, --remote-name

Write output to a local file named like the remote file we get. (Only the file part of the remote file is used, the path is cut off.)

The file will be saved in the current working directory. If you want the file saved in a different directory, make sure you change the current working directory before invoking curl with this
option.

The remote file name to use for saving is extracted from the given URL, nothing else, and if it already exists it will be overwritten. If you want the server to be able  to  choose  the  file
name refer to -J, --remote-header-name which can be used in addition to this option. If the server chooses a file name and that name already exists it will not be overwritten.

There is no URL decoding done on the file name. If it has %20 or other URL encoded parts of the name, they will end up as-is as file name.

You may use this option as many times as the number of URLs you have.
