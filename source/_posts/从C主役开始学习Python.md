---
title: 从C主役开始学习Python
date: 2023-03-28 00:00:00
cover: /img/python-screenshot.png
categories:
  - Dev-Code
tags:
  - C
  - Python
---

# 从C主役开始学习Python

*I despised Python before*

这篇博客无关程序设计基础，主要用于记录如何从C主役开始，学习如何使用Python

起因于深度学习，总结自课程PPT

*但我决定用Python搞懂深度学习的基本概念之后还是回去继续拿起C用Torch吧*

## 为什么要使用Python

Python的问题有很多，诸如是一个解释器语言，运行效率底下，至今仍然在Python2和Python3双轨制并行运用，并且不知会在何时终结这种荒谬的状态，Python下的包及其多——“多”也包括它们的版本，几条pip install命令就会炸掉本地的Python环境，用缩进控制代码块，没有游标卡尺写什么代码，所谓二进制打包就是把脚本和解释器打包......

这一切在一个C主役看来，完全就是不可理解的滑稽、荒唐、搞笑，这笑话能讲一年

但作为一个实用主义者，不得不承认，这东西是很方便——时间是一种很宝贵的资源，在学习阶段进行原理验证的时候不应该迷失在各种类型、地址和错误诊断与处理中

所以学习一下Python，铺平后续的学习之路

## 基本的变量、语法等信息

Python的变量、语法与C大同小异，如果有程序设计基础知识，阅读Python的代码应该不会感到太多困难

不过为了写出Python代码，还是需要理解一下Python的一些逻辑

首先Python的变量类型名很少，只有三个，`int`，`float`，`bool`

Python也提供了“列表”、“元组”、“集合”、“字典”这样的“序列数据”数据结构，有的类似C中的“数组”，但各有各的特点

Python和C一样以某种列表的方式提供了字符串支持，不同之处在于，Python允许用单引号或者双引号表示字符串，而C的单引号用于表示字符，字符串只用双引号表示

运算符也和C代码类似，不同的地方是，C一般用位运算符进行逻辑运算，例如与`&`，或`|`，非`^`，而Python直接使用逻辑运算符，`and`，`or`，`not`

定义函数方面，Python与C对比着看有不一样的地方，但是并不难以理解

```python
def func(para1, para2, ...):
    foo
    bar
    return output
```

## Python中的数据结构

有了C语言中对“数组”的理解，对Python的数据结构理解就不会有什么困难

当然，需要一点面向对象思想才能更好地理解，但所谓“没吃过猪肉也见过猪跑”；如果把C的结构体、函数指针、指针、变量合在一起，有过以“结构体”——“结构体”，而非始终以“变量”——“函数”的思路进行程序设计的经历，也应该不会对“面向对象”感到陌生

### 列表

列表是一种用于存储序列数据的数据结构

用中括号`[]`创建

列表的元素支持修改、删除、新增等操作

1. `list.append(*):`

    将一个项目添加到列表的末尾

2. `list.sort(reverse=False,key=None):`

    排序

    reverse: 升序或是降序

    key: 关键词（与字典有关）

3. `list.count(*):`

    返回*在列表中出现的次数

4. `list.index(*,start[,end[ ]]):`

    在'list'对象的列表中查找第一次出现*的位置索引，可选参数start与end限制搜索范围

5. `list.reverse()`

    反转列表中的元素

6. `list.pop()`

    将列表中的最后一个元素弹出来

    *（也就是说将列表当作堆栈使用）*

### 元组

用小括号`()`创建

元组由一系列按特定顺序排列的元素组成

元组是不可变序列，一旦被创建，它的元素不可更改

### 集合

用`set()`方法或大括号`{}`创建

由无序的元素构成

**没有重复的元素**

支持集合的数学运算，例如并集、交集、差集等

### 字典

字典可以存储任意数据类型

每一个元素是一个键值对，键表示元素的关键词，值表示元素的取值

键和值用冒号分割，键值对之间用逗号分割

```python
>>>tel = {'jack':4098, 'sape':4139}
>>>tel['guido']=4127
>>>tel
{'jack':4098,'sape':4139,'guido':4127}
>>>tel['jack']
4098
```

### 类(面向对象特性)

一种捆绑数据和方法的数据结构，创建一个新类将创建一种新的实例数据类型

每个类的实例拥有相应的属性以维护其状态，同时也有用于修改和访问其属性的方法

具有面向对象编程的所有标准功能，可以继承多个基类，派生类可以覆盖其一个或多个基类的任何方法

动态特性：可以在创建之后进行修改

`__init__():` 内置方法，创建并初始化实例属性

```Python
class ClassName:
	<statement-1>
	…
	<statement-N>

class MyClass
	i=12345
	def f(self):
	return "hello world"

class Complex:
	def __init__(self, realpart, imagepart):
		self.r = realpart
self.i = imagepart
```

方法可以先存储，再进行调用

## 条件语句

可以有零个或多个`elif`(else if)分支；（这样的用法有些类似C中的`switch`语句）

这种情况下，`else`写在最后

## `for`循环语句

for循环语句

与序列（如列表）配合使用，按序列所包含元素的排列顺序进行迭代

基本形式：`for element in list`

在仅指定迭代次数的情况下，可以使用内置的函数`range()`生成数字序列

`range(start,stop[,step]):` `start`, `stop`, `step`分别指定起点，终点和步长

输入参数只有一个时，指定终点，默认起点为0，步长为1

输入参数为两个时，指定起点和终点，步长为1

输入参数为三个时，起点、终点、步长分别是`start`, `stop`, `step`

如果需要根据索引来遍历一个列表，可以结合使用`range()`, `len()`

*从Runoob摘抄的组合用法示例代码如下*

```python
>>>x = 'runoob'
>>> for i in range(len(x)) :
...     print(x[i])
... 
r
u
n
o
o
b
```

## `with`语句

通常用于访问或者占用计算机资源的场合，语句结束后会执行必要的“清理操作”，释放资源

# `numpy`包

通常用于访问或者占用计算机资源的场合，语句结束后会执行必要的“清理操作”，释放资源

Numpy全称为Numerical Python，用于多维数据处理，包含大量的数学函数库

1. 强大的多维数组表示能力

2. 具备C/C++/Fortran等其他语言接口，可用于整合代码

3. 能够解决科学计算，信号处理等领域的问题

可以对数组进行基本运算

并且结果仍然满足数组的性质

*所想即所得*

## numpy中的方法举例

`arange():`

numpy中的方法，功能类似`range()`

## numpy中提供的对象举例

`shape` 数组变量的属性

`ndim` 数组的维度

`dtype.name` 数组的数据类型

`itemsize` 数组类型大小

`size` 数组元素的数量

# OpenCV 视觉库

## 图像的几何变换

### 图像缩放

```python
resize(src, dsize[, dst[, fx[, fy[, interpolation]]]])->dst
```

`src`：输入图像

`dst`：输出图像

`dsize`：目标图像大小

`fx, fy`：水平方向和垂直方向的缩放因子

`interpolation`：插值方法：最临近插值(`INTER_NEAREST`)，双线性插值(`INTER_LINEAR`)，双三次插值(`INTER_CUBIC`)

最临近插值：将最近的已知点像素的值直接赋给新产生的像素
双线性插值：最近的四个点的距离，算权重，进行加权平均获得新的像素点
双三次插值：拟合，得到二次方程，求解

### 图像的仿射变换

```python
warpAffine(src,M,dsize[,dst[,flags[,borderMode[,borderValue]]]])->dst
```

`src`

`dst`

`M`：2×3的仿射变换矩阵

`dsize`

`flags`：插值方法

`borderMode`：外扩模式

`borderValue`：当外扩模式为补充恒定值时的具体数值

### 图像滤波

#### 高斯模糊 

```python
GaussianBlur(src,ksize,sigmaX[,dst[,sigmaY[,borderType]]])->dst
```

`src`

`dst`

`ksize`：高斯核大小

`sigmaX`：高斯核水平方向标准差

`sigmaY`：高斯核垂直方向标准差

`borderType`：像素外扩方式

# Anaconda

> a python IDE and runtime

可以方便地管理多个Python版本和Python包的版本

# Jupyter Notebook

是一个Python解释器

Jupyter Notebook占用的空间非常小，模块化，可以在网页上运行

# TensorFlow

Google Brain, 2015

用于搭建和训练深度神经网络

拥有健全的生态系统

"Tensor"的含义是“张量”，张量是一个很深的话题，在tensorflow中，tensor是一个多维数组，可以认为是一个矩阵

[Tensorflow学习参考](https://trickygo.github.io/Dive-into-DL-TensorFlow2.0)

Knighthana

2023/03/28
