---
title: (KM)快速获取规定格式时间日期
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
date: 2026-04-19 09:40:53
tags:
  - Datetime
---

快速获取规定格式时间日期
===========

YYYY-mm-dd HH:MM:SS

# `date`

最容易被想起的方案
```shell
date "+%Y-%m-%d %H:%M:%S"
```

# `bash`

**Bash5.0+**之后支持的方案
```shell
printf "%(%Y-%m-%d %H:%M:%S)T\n" -1
```

只想稳定从`bash`获取时间，不关心开销
```shell
	bash -c 'printf "%(%Y-%m-%d %H:%M:%S)T\n" -1'
```

# `zsh`

ZSH模块方案
```shell
zmodload zsh/datetime && strftime "%Y-%m-%d %H:%M:%S" $EPOCHSECONDS
```
由于datetime模块只需要加载一次，或许应该写成，此时分号只表示顺序，不要求成功
```shell
zmodload zsh/datetime ; strftime "%Y-%m-%d %H:%M:%S" $EPOCHSECONDS
```
或者模块加载之后直接调用
```shell
strftime "%Y-%m-%d %H:%M:%S" $EPOCHSECONDS
```

ZSH内建函数方案
```shell
print -P '%D{%Y-%m-%d %H:%M:%S}'
```
