---
title: (KM)XML的DOM和SAX的区别
date: 2023-03-27 00:00:00
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
tags:
  - XML
  - DOM
  - SAX
---

# XML的DOM和SAX的区别

(注意：这篇速记是在没有深入了解过这两个概念的前提下写出来的，因此只能提供粗略的刻板印象)

|类型|SAX|DOM|
|---|---|---|
|在XML体积大小方面|快速扫描大型文档，在感兴趣的地方停下来|需要读入整个文档建立树，应对大型XML文档比较无力|
|读取顺序|只能对文件按照顺序从前到后解析一遍，不支持随意访问|可以随意访问文件树的任何部分，也没有次数限制|
|读写访问|只读|可以读写文件树，以此修改XML文档|
|开发工作|复杂，需要自行制作事件处理器|易于理解和开发|
|模型|灵活，可以建立自己的XML对象模型|默认提供了树形模型|

参考来源：

[XML中DOM和SAX的区别](https://www.jianshu.com/p/51ded098785d) *明文指向了下方的原始引用*

[DOM和SAX的区别](https://blog.csdn.net/imzoer/article/details/8032083)
