---
title: pandoc的一些用法
date: 2023-05-06 01:45:00
cover: https://pandoc.org/pandoc-cartoon.svgz
categories:
  - Dev-Code
tags:
  - pandoc
  - HTML
  - markdown
---

# pandoc的一些用法

[Pandoc](https://pandoc.org)是一个非常强大的转换文本呈现方式的转换器

*我愿称之为文本类代码编译器*

我想一般情况下，这个软件应该是用来将LaTeX文档转换成PDF，

不过我用了它的另一个用法，将markdown转换为HTML

众所周知，markdown只是一个方便书写但呈现效果随缘的语言，而HTML是一种专门设计用来呈现内容的标记语言

一般来说，支持markdown排版的程序会顺便支持html语法，以便呈现一些高级的效果

我觉得这和markdown便于书写的本质有所冲突，但如果要求创作时直接书写html，那更是和创作的本意大大地冲突了

但是目前还没有那个能力制定一套规则与对应的实现，因此闲话不多说，回到正题，我如何使用pandoc转换markdown文章到HTML

一般来说是
```bash
pandoc --mathml --from=markdown README.md --output=html README.html
```

当然，pandoc支持简单的传参方式，因此写成
```bash
pandoc --mathml -f README.md -t README.html
```
也是可以的

Pandoc手册的页面是[Pandoc User’s Guide](https://pandoc.org/MANUAL.html)

## 数学公式

科学文章内难免需要用到数学公式，这也是`--mathml`参数出现在这里的原因

pandoc提供了这几种数学公式呈现方式：

### `--mathjax[=URL]`

这种方式要求数学公式必须以
```tex
\(...\)
```
（行内）
或
```tex
\[...\]
```
（段落）
的方式记录

URL参数指向一个含有`MathJax.js`的地址，如果不指定，默认使用一个指向CloudFlare CDN的地址

这种方式需要客户端方面保证网络状况良好

### `--mathml`

这个参数会将"TeX"形式的数学公式转换成"MathML"

由于MathML在各主流浏览器中得到了广泛的支持，因此使用这种方式可以将所有呈现问题在服务端期间处理给HTML文件本身，仅仅把渲染方式交由客户端的浏览器决定

基本上，只要客户端有一个主流的浏览器，就不需要考虑诸如网络状况好坏一类的问题了

这也是我目前使用的方式

### `--webtex[=URL]`

这个参数会通过外部服务器将"TeX"形式的数学公式转换成HTML中的`<img>`标签，

URL参数指定希望调用渲染公式的服务器所提供接口的URL，例如pandoc网站上给出的例子分别是

```bash
--webtex https://latex.codecogs.com/svg.latex?
```
和
```bash
--webtex https://latex.codecogs.com/png.latex?
```

前者生成一个SVG矢量图，后者生成一个PNG位图

如果不指定，会默认采用[CODECOGS(R)](codecogs.com)提供的PNG方式，也即示例中的第二种方式

这种方式将渲染交给了远程服务器，这无疑会对公益服务器造成负担，或者需要自己建立一个兼容"webtex"解析渲染方式的服务器，也需要客户端方面保证网络状况良好

不过从另一方面来说，显然地，这种方式对那些老旧或者小众的浏览器支持较好

### `--katex[=URL]`

用KaTeX进行渲染，这里可以指定一个URL地址，这个地址应当存有`katex.min.js`和`katex.min.css`两个文件

如果不指定，将会默认使用一个指向"KaTeX CDN"的链接

这种方式需要客户端方面保证网络状况良好

顺带一提，vscode使用的渲染方式就是KaTeX

### `--gladtex`

将文件处理为一个可被[GladTex](https://humenda.github.io/GladTeX/)理解的HTML文件(扩展名为`.htex`)，需要用户稍后手动指定图像输出目录和文件后执行"GladTeX"，渲染公式为本地SVG图像

手册网站给出的示例如下
```bash
pandoc -s --gladtex input.md -o myfile.htex
gladtex -d image_dir myfile.htex
# produces myfile.html and images in image_dir
```

无疑，这种方式兼顾了客户端网络问题和客户端浏览器支持的问题，

虽然手动操作起来有点复杂，但从网站维护者的角度来看，它的稳定性极佳

## 总结

总之，pandoc真的很强大（pupil并感）

为了避免和小学生感想一样，引用一张图描述一下它有多强大：

![what pandoc do](https://pandoc.org/diagram.svgz)

以后如果还用到了其它用法，大概也会补到这篇文章里面

但目前的话就是这样了

## 参考

[1] John MacFarlane.Pandoc User’s Guide[EB/OL].(2006-2022)[2023-05-06].https://pandoc.org/MANUAL.html

Knighthana

2023/05/06
