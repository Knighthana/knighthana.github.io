# builder/patches —— 上游修改登记表

本目录通过 [patch-package](https://www.npmjs.com/package/patch-package) 管理对
`node_modules` 内第三方包的手工修改。`package.json` 的
`postinstall: patch-package` 会在 `npm ci` / `npm install` 后自动应用所有补丁。

## 修改原则

- 改上游（node_modules 中的第三方代码）必须登记在此处，说明"为什么改、改了什么、如何重新生成"。
- 能通过升级依赖解决的上游问题，优先升级而非打补丁。
- 若上游发布新版本，先尝试撤销补丁并升级验证，确认无需补丁后再删除登记。

## 补丁清单

### 1. hexo-theme-nexmoe+4.2.2.patch

| 项 | 内容 |
|---|---|
| 目标包 | `hexo-theme-nexmoe@4.2.2` |
| 文件 | `package.json` |
| 改动 | `dependencies.hexo: "^6.0.0"` → `"^8.1.1"` |
| 日期 | 2026-08-08 |
| 状态 | 生效中 |

**为什么改**：主题声明 hexo `^6.0.0` 过时（其代码实际兼容 hexo 8.x）。该声明在
npm `overrides` 将嵌套 hexo 提升到 8.1.2 后，触发主题自带
`include/dependency.js` 的强制版本检查——`semver.satisfies` 不满足即
`process.exit(-1)`，导致 `hexo generate` 直接崩溃。

**为什么用补丁而非其他方式**：主题仓库约 4 年未更新，无新版可升；
该检查是主题源码硬编码行为，npm overrides 只能改依赖树、改不掉包自身的运行时断言。

**如何重新生成**：

```bash
# 修改 node_modules/hexo-theme-nexmoe/package.json 后
cd builder && npx patch-package hexo-theme-nexmoe
```

**上游升级注意事项**：若 `hexo-theme-nexmoe` 发布新版本并修正了 hexo 版本声明，
应先删除本补丁（`rm patches/hexo-theme-nexmoe+4.2.2.patch`），升级后验证构建；
若新版仍有过时声明，需重新生成补丁。

---

## 其他决策记录

### pandoc 安装方案（workflow 中）—— 为何缓存官方静态 deb 而非 apt

**背景**：hexo-renderer-pandoc 需要系统 pandoc 二进制（`spawnSync` 调用）。

**为什么不用 apt**：Ubuntu 仓库的 pandoc 包（3.1.x，陈旧）依赖整个 Haskell
工具链（`libghc-*` 数十个库包）。`apt-get install pandoc` 每次都要解析、下载、
解包这一长串依赖，CI 耗时约 60s，且无缓存机制。

**为什么用官方静态 deb**：`jgm/pandoc` 官方 release 的
`pandoc-3.10.1-1-amd64.deb` 是**静态链接、自包含的单文件二进制**（`Depends:`
为空，解包后即 `/usr/bin/pandoc`）。只需缓存这一个文件，`dpkg -i` 秒级完成；
且版本最新（3.10.1 vs apt 的 3.1.x）。

**备选方案考察**：`awalsh128/cache-apt-pkgs-action`（社区流行的 apt 缓存 action，
358 stars）可缓存 apt 依赖链，但：引入第三方 action（其 README 自述作者无暇维护、
在找接盘者，有稳定性问题）；pandoc 版本仍停在 apt 的 3.1.x；命中后仍要解包
Haskell 库链。故不采用。

**维护注意**：升级 pandoc 时需同步修改 workflow 两处：cache key
（`pandoc-3.10.1`）与下载 URL 中的版本号。
