---
title: (KM)让shell像资源管理器一样便捷
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
date: 2026-04-25 21:59:12
tags:
  - shell
  - cd
  - ls
  - tree
  - popd
  - pushd
---

让shell像资源管理器一样便捷
========================

在传统入门级的shell操作中，主要靠`ls`和`cd`实现展示、转移工作目录的操作；

如何在shell中，尽可能用“原生”的方式让目录操作方便快捷？

# tree

`tree`可以得到目录树，但是不便捷的地方在于`tree`默认展示全部目录反而会失去重点，

因此如果获取限制方法，可以让`tree`更好用；

`tree`的组合命令顺序是`tree [选项] [路径]`；

## 排除指定名称

通过`-I`选项，可以让`tree`排除指定目录；

用一个例子展示当前对`Blog-Active`目录的管理方法，排除掉`node_modules`、`public`、`source`三个目录；
```shell
➜  workspace tree -I "node_modules|public|source" Blog-Active
Blog-Active
├── _config.nexmoe.yml
├── _config.yml
├── applychanges.sh
├── db.json
├── package-lock.json
├── package.json
├── scaffolds
│   ├── blogmaintenance.md
│   ├── dev-code.md
│   ├── dev-env.md
│   ├── draft.md
│   ├── knowledgemark.md
│   ├── page.md
│   └── post.md
└── themes

3 directories, 13 files
```

## 限制目录层级

通过`-L`选项可以让`tree`只展示指定层数的目录；

例如在忽略`node_modules`的前提下，只展示两层`-L 2`目录：
```shell
➜  workspace tree -L 2 -I "node_modules" Blog-Active
Blog-Active
├── _config.nexmoe.yml
├── _config.yml
├── applychanges.sh
├── db.json
├── package-lock.json
├── package.json
├── public
│   ├── 404.html
│   ├── Blog-Maintenance
│   ├── BlogMaintenance
│   ├── Book-Mark
│   ├── BookMark
│   ├── Cooking
│   ├── Dev-Code
│   ├── Dev-Env
│   ├── KnowledgeMark
│   ├── about.html
│   ├── archives
│   ├── archives.html
│   ├── atom.xml
│   ├── categories
│   ├── content.json
│   ├── css
│   ├── favicon.png
│   ├── img
│   ├── index.html
│   ├── js
│   ├── lib
│   ├── page
│   ├── preset
│   ├── subject-note
│   ├── tags
│   └── uncategorized
├── scaffolds
│   ├── blogmaintenance.md
│   ├── dev-code.md
│   ├── dev-env.md
│   ├── draft.md
│   ├── knowledgemark.md
│   ├── page.md
│   └── post.md
├── source
│   ├── 404.md
│   ├── _drafts
│   ├── _posts -> /home/knighthana/workspace/knighthana.github.io/raw
│   ├── about.md
│   ├── archives.md
│   ├── favicon.png
│   └── img
└── themes
```

## 其他可能要用到的

| 参数 | 作用 | 特别说明 |
| :--- | :--- | :--- |
| `-I pattern` | 忽略匹配的文件/目录 | 支持通配符，用竖线 `\|` 分隔多个模式，比如 `-I "node_modules\|.git"`。 |
| `-P pattern` | 只显示匹配的文件/目录 | 同样支持通配符，比如 `-P "*.html"` 只显示HTML文件。 |
| `-d` | 仅显示目录 | 隐藏普通文件，方便聚焦于文件夹结构。 |
| `-a` | 显示所有文件 | 包括以点开头的隐藏文件。 |
| `-h` | 以可读格式显示文件大小 | 比如显示 `4K`、`8M`，需要结合 `-s` 或 `--du` 一起用。 |
| `-o filename` | 输出结果到文件 | 比如 `tree -o output.txt`，将树状图保存下来，而不是打印在屏幕上。 |
| `--du` | 显示每个目录的累计大小 | 递归计算并显示每个目录下所有文件的总大小。 |
| `--prune` | 修剪空目录 | 在输出中不显示那些不包含任何文件的空目录。 |
| `--filelimit #` | 限制目录条目数 | 当目录下的文件/子目录数量超过 `#` 时，**不再展开**该目录。 |

# 目录栈`pushd/popd`

用`cd`切换其实很不方便，即便有`cd -`，在键盘上也挺难摸到；

明明模模糊糊记得很早之前在目录里面进行过栈操作，

查证了一些确实有这些操作；

`pushd`用来把一个路径压进目录栈，之后跳转到这个路径的目录；

`popd`用来把栈顶路径弹出，也即跳转到栈顶路径的目录，随后删掉栈顶的记录；

`dirs`用来展示栈中的记录信息情况；
