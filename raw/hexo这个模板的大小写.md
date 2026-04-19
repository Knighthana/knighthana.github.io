---
title: hexo这个模板的大小写
cover: /img/Cover-Blog-Maintenance.jpg
categories:
  - BlogMaintenance
tags:
  - Blog
  - Hexo
date: 2026-04-19 07:00:18
updated: 2026-04-19 07:00:18
---

HEXO这个模板的大小写
==================

之前遇到了很奇妙的问题，举个例子：

我在hexo的`scaffolds`中写了`Dev-Env.md`为
```yaml
---
title: {{ title }}
date: {{ date }}
updated: {{ date }}
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
tags:
---
```
的脚手架文件，然而我执行了`hexo new Dev-Env "排列去重问题"`后，

我看到的“排列去重问题.md”是
```md
---
layout: dev-env
title: 排列去重问题
date: 2026-03-21 06:13:01
tags:
---
```

这个问题是怎么发生的呢？

# 是因为没有在YAML中写`layout`吗

查询[Hexo文档](https://hexo.io/zh-cn/docs/writing)，提到：

> 在新建文章时，Hexo 会根据 scaffolds 文件夹内相对应的文件来建立文件。 例如：
>
> `$ hexo new photo "My Gallery"`
>
> 在执行这行指令时，Hexo 会尝试在 scaffolds 文件夹中寻找 photo.md，并根据其内容建立文章。 以下是您可以在模版中使用的变量：
>
|占位符|描述|
|---|---|
|layout|布局|
|title|标题|
|date|文件建立日期|

看起来作为`scaffolds`的文档或许应该有一个`layout`？

我在`Dev-Code.md`的开头插入了`layout: Dev-Code`之后，事情并没有发生变化；

*是的，居然真的这么干了*

乍看没什么问题，细看就出现了问题：

> 您可以在模版中使用的**变量**

`layout`它是一个**变量**而不是什么**属性**；

# 难道是大小写

虽然按照[文档](https://hexo.io/zh-cn/docs/writing)的说法，总结一遍的话就会发现：
```shell
hexo new {这里} 标题
```
的`{这里}`可能是个`layout`，也可能是`scaffold`的名字；

而且，输出的`排列去重问题.md`确实有个`layout`属性，值为`dev-env`

所以说，可能性呢？有没有可能不知怎么地，`hexo`传给后续流程的是一个`dev-env`而不是一个`Dev-Env`，这导致`scaffold`机制没有正常生效呢？

为了验证这个疑问，我将`scaffolds`里的`Dev-Env.md`改名为`dev-env.md`，然后再次实验：
```shell
hexo new Dev-Env "排列去重问题"
```

这次，就成功地出现了我想要的结果：
```yaml
title: 排列去重问题
date: 当时的时间
updated: 当时的时间
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
tags:
---
```

所以问题就是这么回事：`hexo new ${3} ${4}`的参数`${3}`会被强制转换为小写；

而`${3}`代表`layout`或者`scaffold`的文件名；

因此`scaffolds`中文件名出现的字母必须**全部小写**。

# 关于那个`layout`

文档只是提了一嘴`${3}`可以是`layout`，

后面又提了一嘴`${3}`可以是`scaffold`，

甚至没有提“会被转换成小写”这么重要的事情，唯一跟“小写”有关的是这句：
|占位符|描述|
|---|---|
|:title|标题（小写，空格将会被替换为短杠）|

然而经过我的实地测试：
```shell
hexo new notexist tEstBlog
```

生成结果是`source/_posts/tEstBlog.md`：
```yaml
---
layout: notexist
title: tEstBlog
date: 2026-04-19 07:37:27
tags:
---
```

这就是我要提的第二个重要观察结论了。

当我们使用
```shell
hexo new ${3} ${4}
```
的时候，似乎遵循这样的规律（目前来看）：

1. (文档有提)当`${3}`为`draft`或`post`时，会在`source/_drafts/`或`source/`中，生成`${4}.md`或者`${4}/index.md`；

2. 当`${3}`转小写之后，为`scaffolds`中存在的文件名、或是文件名`.md`之前的部分时，则会套用该脚手架生成标题为`${4}`的文章；

3. 当`${3}`转小写后，与`scaffolds`中的任何文件名、即便去掉`.md`也不匹配时，会产生一个头部有`layout: ${3}`的标题为`${4}`的文章；

# new文章时与`scaffold`们有关的特性

- 如果`scaffolds`中存在一个空白内容的文件，而`hexo new`的时候指定了这个文件，文档没有说会怎么样，实验结论是`hexo`会崩溃；
- 如果`scaffolds`的文件中，头部显性含有一个`layout:`标签，那么生成的文章头中也会有一个`layout:`标签；
- 若`scaffolds`头部含有`{{ title }}`，那么这一部分会被`${4}`以**原样**替换；

然后总结一下（注意，这只是满足我的好奇心，推测其实现方式，而不是为未定义行为寻找标准）：
|命令|`scaffolds`已有的文件特征|创建的新文章所在位置|新文章文件名|新文章的特征|
|---|---|---|---|---|
|`hexo new draft tEstBlog`|有`draft.md`（默认）|`source/_draft/`|`tEstBlog.md`|遵循`draft.md`的规定|
|`hexo new post tEstBlog`|有`post.md`（默认）|`source/_post/`|`tEstBlog.md`|遵循`post.md`的规定|
|`hexo new page tEstBlog`|有`page.md`（默认）|`source/tEstBlog/`|`index.md`|遵循`page.md`的规定|
|`hexo new hLwD tEstBlog`|有`hlwd`|`source/_post`|`tEstBlog.md`|遵循`hlwd`的规定|
|`hexo new HLwD tEstBlog`|有`hlwd.md`|`source/_post`|`tEstBlog.md`|遵循`hlwd.md`的规定|
|`hexo new HlWd tEstBlog`|有`HlWd`|`source/_post/`|`tEstBlog.md`|`layout: hlwd title:tEstBlog tag: date:`，不遵守`post.md`的规定|
|`hexo new hlWd tEstBlog`|同时有`hlwd`与`hlwd.md`|`source/_post/`|`tEstBlog.md`|遵循`hlwd`而不是`hlwd.md`的规定|
|`hexo new hlWD tEstBlog`|`hlwd.md`的头部有一行`somewhat: {{ layout }}`|`source/_post/`|`tEstBlog.md`|遵循`hlwd.md`规定，头部有一行`somewhat: hlwd`|
|`hexo new HlWd tEstBlog`|`hlwd.png`|`source/_post/`|`tEstBlog.md`|遵循`hlwd.png`(markdown)的规定|
|`hexo new Hlwd tEstBlog`|`hlwd.png.jpg`|`source/_post/`|`tEstBlog.md`|`layout: hlwd title: tEstBlog date: tags:`|
|`hexo new HlWD.png tEstBlog`|`hlwd.png.jpg`|`source/_post/`|`tEstBlog-png.md`|遵循`hlwd.png.jpg`(markdown)的规定，特别地，`{{ title }}`被解析为`tEstBlog.png`|

所以可以判断得出，除了`draft`和`post`有自己的特殊处理方式以外，其它的`hexo new`行为会导致：

将`scaffolds`中所有文件名取出，截断最后一个`.`及其之后的部分，将之前的部分**“原样”**与${4}**“小写变换之后”**比对，

对于匹配的，依照该脚手架文件进行**“原样”**创建，并且替换其中的`{{ title }} {{ date }}`为`${4}`和`YYYY-mm-dd HH:MM:SS`格式的创建时间，

对于`{{ layout }}`，则以`${3}`的全小写变换进行替换；

对于不匹配的，创建类似的文档`source/_post/${4}.md`：
```yaml
---
layout: ${3}
title: ${4}
date: YYYY-mm-dd HH:MM:SS
tags:
---
```
而不是从`post.md`中读取格式；

# 结论

基于这样的观察，我决定以这样的形式维护`hexo`的`scaffolds`目录：
```shell
scaffolds
├── blogmaintenance.md
├── dev-code.md
├── dev-env.md
├── draft.md
├── knowledgemark.md
├── page.md
└── post.md

1 directory, 7 files
```
没有一个大写字母。

并且类似这样写模板：
```md
---
title: {{ title }}
date: {{ date }}
updated: {{ date }}
cover: /img/Cover-Dev-Env.jpg
categories:
  - Dev-Env
tags:
---

{{ title }}
===========

```

头部之外的这个`{{ title }}`并不会被替换，但是可以留着占个位置，*方便进行CV工程*。

----------------------------------------------------

Knighthana

2026/04/19
