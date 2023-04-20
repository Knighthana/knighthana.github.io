---
title: 进行Minecraft Fabric MOD开发的经验记录
date: 2021-09-23 00:00:00
cover: /img/logo-minecraft.svg
categories:
  - Dev-Code
tags:
  - Minecraft
  - Fabric
  - Java
---

# 进行Minecraft Fabric MOD开发的经验记录

*在没有任何Java基础的前提下进行Minecraft Fabric MOD开发，一边学MOD开发，一边学Java*

[Fabric项目的教程主页](https://fabricmc.net/wiki/zh_cn:tutorial:introduction)

## 09/23

开发前的环境配置也即Java开发环境的配置+对Minecraft开发的特化配置

JRE和JDK早已经安装，因此只需要考虑编辑器和项目管理一类装置的问题。

起初计划在Visual Studio Code上直接进行Java的开发，但个人认为VSC不是一个IDE，也没必要安装一堆插件降低VSC的启动速度，所以直接安装了专门用于Java开发的IDE。

使用过Eclipse，但谈不上对Eclipse有很大的使用依赖，因此按照教程的推荐，也是本着尝试新工具的目的安装了IntelliJ IDEA并且安装了中文插件和Minecraft插件。

插一嘴，将本地化工作交给社区是一个很值得参考并且效仿的思路，VSC如是，IDEA如是。虽然这几个项目都是开源项目，但是个人觉得即使是闭源项目也应当考虑将i18n工作作为项目以外的部分开放给社区。

Fabric在Github上有一个[Fabric MOD模板项目](https://github.com/FabricMC/fabric-example-mod/)，(尤其是对于我这种没有任何Java开发经验的人来说)可以用来参考。

项目使用了Gradle进行管理，在我认知范围内这是一个用于管理项目的工具，也许类似于make，IDEA对于Gradle的支持非常好，完全在无感知的情况下读取并应用了Gradle。

在国内，想要正常的通过Gradle进行Fabric for Minecraft开发，需要更换其中的源。

这需要打开`settings.gradle`，并更改其中的源为由[hanbings.io](https://hanbings.io)提供的[镜像源](https://repository.hanbings.io/proxy)。

然后打开`build.gradle`，在`repositories`中添加[aliyun maven](https://maven.aliyun.com/nexus/content/groups/public)和[hanbings maven](https://repository.hanbings.io/proxy)

在安装了Minecraft Dev插件的IDEA中，新建一个minecraft项目，使用Yarn映射，也会得到一个类似example-mod的环境，同时也需要进行类似的换源。

`src/main/java/name.modID/modID.java`是主要的项目文件。

`public class modID implements ModInitializer`是主要的类，由于不太清楚Java的设计，根据名称判断这是一个有关MOD初始化的类，根据教程，将MOD想要实现功能的代码放入这个类中就可以进行实现了。

类中有一个函数，`onInitialize()`，属性为`public`，根据名称，这是在初始化时调用的函数。

一个物品组`ItemGroup`可藉由`FabricItemGroupBuilder`提供的`build`方法或者`create`方法创建，在这些方法中都有一个`Identifier`函数，这个函数需要传入两个`string`，例如一个分别传入`modID`和`general`两个`string`，稍后将会在游戏中看到这个物品组被命名为`itemGroup.modID.general`。

需要注意的是，这里的string只能传入由小写字母a_z以及数字下划线和横杠组成的字符串，所以直接写"modID"肯定是会引发游戏无法启动的问题的。

后来发现wiki上的原文中有小字部分对此限制做了如下描述:

> 请记住，传递给Identifier构造函数的参数只能包含某些字符。
>
> 两个参数（命名空间namespace和路径path）都可以包含小写字母、数字、下划线、点和横杠。[a-z0-9_.-]
>
> 第二个参数（path）还可以包含斜杠。[a-z0-9/_.-]
>
> 避免使用其他符号，否则将引发InvalidIdentifierException！

经过我个人的尝试，这里也无法`new`一个`TranslatableText()`来提供字符串，IDEA将会提示“这里需要一个string但是传入了一个text”。

但经过尝试，在lang文件中直接对`itemGroup.modID.general`进行翻译，游戏中在标签页提示处是可以读取到并进行翻译的，但目前尚不清楚如何为下面的灰色字体提供翻译。

可以通过在主类中用类似创建物品组的方法创建新的物品，例如我通过`public static final Item M1911_ITEM = new Item(new Item.Settings().group(ctmMOD.GUNS_GROUP));`在属于ctmMOD的GUNS_GROUP中创建了一个叫做M1911_ITEM的类。

对于自定义的物品而言，需要一个额外的注册过程，在主类的`onInitialize`方法中，为每个自定义建立的物品类进行注册，例如对刚刚建立的M1911_ITEM类，通过`Registry.register(Registry.ITEM, new Identifier("ctmmod", "m1911_pistol"), M1911_ITEM);`将之注册成标识符为`item.ctmmod.m1911_pistol`的物品。

每个物品在`src\main\resources\assets\ctmmod\textures\item`中设置材质，材质名设置为标识符的最后一个string，例如m1911_pistol.png。

同时还需要在`src\main\resources\assets\ctmmod\models\item`中设置模型，minecraft的原生方式似乎是使用json文件，在其中进行一些描述。

最简单的描述方式是

```java
{
    "parent": "builtin/generated",
    "textures": {
      "layer0": "ctmmod:item/m1911_pistol"
    }
}
```

通过这个描述方式只能将模型平铺，更加复杂的方式需要额外的描述。

另外我在某些MODD地textures文件夹发现了另外一个models文件夹，这个文件似乎是定义了某些复杂的模型材质，但这已经超出目前的理解范围了。

本日的练习就到这里。
