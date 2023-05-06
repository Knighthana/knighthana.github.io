---
title: 从光电鼠标到光流法
date: 2023-05-06 22:00:00
updated: 2023-05-06 22:50:00
cover: /img/Cover-knowledge-mark.svg
categories:
  - KnowledgeMark
tags:
  - DSP
  - 鼠标
  - 互相关
  - 光流法
---

# 从光电鼠标到光流法

突然对光电鼠标的工作原理感兴趣

虽然说以前大概知道个原理，类似照相机，但是凭借如今的知识储备，已知道，即便其原理类似照相机，其实现方式不可能真的用照相机一类的东西——数据流太大。

目前搜集到的资料显示，光电鼠标搭载了一个对极小像素区域(约32×32到40×40左右的区域)进行图像分析的DSP，这些DSP分析速度达到[每秒上千帧](https://www.zhihu.com/question/29020256/answer/2447367685)或是[每秒上万帧](https://blog.csdn.net/LingLing1301/article/details/123628757)

而且，这些图像信息不会被存储，DSP只对位移信息感兴趣，也只输出位移相关的内容，所以说和相机还是有很大的不同

尽管图形界面上的光标总是以坐标的形式运用，鼠标硬件在现实中也是以坐标的形式使用，但是鼠标的电学部分并不输出坐标信息，而是位移，这些位移信息被计算机系统内部再次处理成为坐标信息，也就是说从现实到屏幕上的光标位置变化，经过了坐标→位移→坐标的转化

这里有两个非常关键的算法，

一个是“[互相关](https://zh.wikipedia.org/wiki/%E4%BA%92%E7%9B%B8%E5%85%B3)”

另一个是“[光流法](https://zh.wikipedia.org/wiki/%E5%85%89%E6%B5%81%E6%B3%95)”

光流法[在CV领域也有广泛的应用](https://zhuanlan.zhihu.com/p/384651830)

这里也有一个[鼠标光学传感器厂商的产品简介](https://www.pixart.com/products-detail/tw/129/PAW3395DM-T6QU)

普通的光电鼠标使用LED作为光源，激光型的光电鼠标使用激光器作为光源

激光是相干光，具有一致的特性，因此[激光光源相比LED光源从物品表面反射回的图像细节更加完善](https://www.engineersgarage.com/difference-between-optical-mouse-and-laser-mouse/)，这也是为什么所谓的“蓝光鼠标能在玻璃上使用而红光鼠标就不行”，这是因为鼠标里常用的激光器一般是蓝色种类的，而便宜实惠的LED一般是红色的，事实上也有使用蓝光LED的普通光电鼠标，但是[蓝光LED毕竟是LED家族中比较薄弱的一环](https://zh.wikipedia.org/zh-cn/%E8%97%8D%E5%85%89LED)，用的也没那么广泛，因此这种说法就会具有“某种意义上”的普遍适用性

## 互相关

[互相关 - Wikipedia](https://zh.wikipedia.org/wiki/%E4%BA%92%E7%9B%B8%E5%85%B3)

互相关实质上类似于两个函数的[卷积](https://zh.wikipedia.org/wiki/%E5%8D%B7%E7%A7%AF)。

### 离散

对于离散函数
$fi$
和
$gi$
来说，互相关定义为
$$
(f \star g)_i \equiv \sum _j f^*_j g_{i+j}
$$

其中和在整个可能的整数 j 区域取和，星号表示复共轭。

### 连续

对于连续信号 f(x) 和 g(x) 来说，互相关定义为
$$
(f \star g, x) \equiv \int f*(t) g(x+t) dt
$$

其中积分是在整个可能的 t 区域积分。

### 特性(节选)

互相关与卷积通过下式发生关系：

$$
f(t) \star g(t) = f^* (-t) * g(t)
$$

## 光流法

[光流法 - Wikipedia](https://zh.wikipedia.org/wiki/%E5%85%89%E6%B5%81%E6%B3%95)

光流(Optical flow or optic flow)是关于视域中的物体运动检测中的概念。用来描述相对于观察者的运动所造成的观测目标、表面或边缘的运动。光流法在样型识别、计算机视觉以及其他影像处理领域中非常有用，可用于运动检测、物件切割、碰撞时间与物体膨胀的计算、运动补偿编码，或者通过物体表面与边缘进行立体的测量等等。

### 光流的测算

光流法实际是通过检测图像像素点的强度随时间的变化进而推断出物体移动速度及方向的方法。

假设该移动很小，那么可以根据泰勒级数得出：

$$
I(x+ \Delta x, y + \Delta y, t + \Delta t)=I(x,y,t)+ \frac{\partial I}{\partial x} \Delta x +  \frac{\partial I}{\partial y} \Delta y + \frac{\partial I}{\partial t} \Delta t + HOTs
$$

HOTs: Higher-order terms

因此可以推出：
$$
\frac{\partial I}{\partial x} \Delta x + \frac{\partial I}{\partial y} \Delta y + \frac{\partial I}{\partial t} \Delta t = 0
$$
或
$$
\frac{\partial I}{\partial x} \frac{\Delta x}{\Delta t} + \frac{\partial I}{\partial y} \frac{\Delta y}{\Delta t} + \frac{\partial I}{\partial t} \frac{\Delta t}{\Delta t} = 0
$$

最终可以得出结论：
$$
\frac{\partial I}{\partial x}V_x + \frac{\partial I}{\partial y} V_y + \frac{\partial I}{\partial t} = 0
$$

这里的
$V_x$
，
$V_y$
是
$x$
和
$y$
方向上的速率，或者称为
$I(x,y,t)$
的光流。

而
$\frac{\partial I}{\partial x}$
，
$\frac{\partial I}{\partial y}$
和
$\frac{\partial I}{\partial t}$
则是图在
$(x,y,t)$
在对应方向上的偏导数。

$I_x$
、
$I_y$
和
$I_t$
的关系可用下式表述：
$$
I_xV_x + I_y V_y = - I_t
$$
或
$$
\nabla I ^T \cdot \vec{V} = -I_t
$$
这是两个未知数中的一个方程，不能这样求解。这被称为光流算法的孔径问题。为了找到光流，需要另一组方程，由附加的约束给出。所有光流方法都引入了估算实际流量的附加条件。

Knighthana

2023/05/06
