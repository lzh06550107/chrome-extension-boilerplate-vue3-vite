<div align="center">

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/99cb6303-64e4-4bed-bf3f-35735353e6de" />
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/a5dbf71c-c509-4c4f-80f4-be88a1943b0a" />
    <img alt="Logo" src="https://github.com/user-attachments/assets/99cb6303-64e4-4bed-bf3f-35735353e6de" />
</picture>

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)

![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/build-zip.yml/badge.svg)
![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/lint.yml/badge.svg)

<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/Jonghakseo/chrome-extension-boilerplate-react-viteFactions&count_bg=%23#222222&title_bg=%23#454545&title=😀&edge_flat=true" alt="hits"/>
<a href="https://discord.gg/4ERQ6jgV9a" target="_blank"><img src="https://discord.com/api/guilds/1263404974830915637/widget.png"/></a>

> This boilerplate
> has [Legacy version](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/tree/legacy)

</div>

> [!NOTE]
> This project is listed in the [Awesome Vite](https://github.com/vitejs/awesome-vite)

> [!TIP]
> Share storage state between all pages
>
> https://github.com/user-attachments/assets/3b8e189f-6443-490e-a455-4f9570267f8c

## Table of Contents

- [Intro](#intro)
- [Features](#features)
- [Structure](#structure)
    - [ChromeExtension](#structure-chrome-extension)
    - [Packages](#structure-packages)
    - [Pages](#structure-pages)
- [Getting started](#getting-started)
    - [Chrome](#getting-started-chrome)
    - [Firefox](#getting-started-firefox)
- [Install dependency](#install-dependency)
    - [For root](#install-dependency-for-root)
    - [For module](#install-dependency-for-module)
- [Community](#community)
- [Reference](#reference)
- [Star History](#star-history)
- [Contributors](#contributors)

## Intro <a name="intro"></a>

这个模板是为了使用 Vue3 和 TypeScript 创建 Chrome 扩展而制作的。

> 其重点是通过 Vite（Rollup）和 Turborepo 提高构建速度和开发体验。

## 功能 <a name="features"></a>

- [vue3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Turborepo](https://turbo.build/repo)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Custom I18n Package](/packages/i18n/)
- [Custom HMR(Hot Module Rebuild) Plugin](/packages/hmr/)
- [End to End Testing with WebdriverIO](https://webdriver.io/)

## 入门: <a name="getting-started"></a>

1. 当你使用 Windows 时，运行这个：
   - `git config --global core.eol lf`
   - `git config --global core.autocrlf input`
   #### 这将把行尾符（EOL）更改为与 Linux/Mac 相同，如果没有这个，你将与使用这些系统的队友产生冲突，并且我们的 bash 脚本将无法正常工作。
2. 克隆这个仓库。
3. 在 `packages/i18n/locales` 文件夹中的 `messages.json` 文件中更改 `extensionDescription` 和 `extensionName`。
4. 全局安装 pnpm：`npm install -g pnpm`（检查你的 Node 版本 >= 18.19.1）。
5. 运行 `pnpm install`。

### 然后，根据需要操作:

### 对于 Chrome: <a name="getting-started-chrome"></a>

1. 运行:
    - 开发环境: `pnpm dev` (在 windows 环境中，你需要以管理员身份运行 [(Issue#456)](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/456)
    - 生产环境: `pnpm build`
2. 在浏览器中打开 - `chrome://extensions`
3. 开启 - `Developer mode`
4. 点击 - `Load unpacked extension`
5. 选择 - `dist` 文件夹作为扩展插件的根目录

### 对于 Firefox: <a name="getting-started-firefox"></a>

1. 运行:
    - 开发环境: `pnpm dev:firefox`
    - 生产环境: `pnpm build:firefox`
2. 在浏览器中打开 - `about:debugging#/runtime/this-firefox`
3. 点击 - `Load Temporary Add-on...`
4. 选择 - `dist` 文件夹中的 `manifest.json` 作为根

<h3>
<i>请记住，在 Firefox 中，插件是在临时模式下添加的，这意味着每次浏览器关闭后，它会消失。 你必须在每次浏览器启动时重新添加。</i>
</h3>

## 为 turborepo 安装依赖: <a name="install-dependency"></a>

### 对于根目录: <a name="install-dependency-for-root"></a>

1. 运行 `pnpm i <package> -w`

### 对于模块: <a name="install-dependency-for-module"></a>

1. Run `pnpm i <package> -F <module name>`

`package` - 要安装的包的名称，例如 `nodemon` \
`module-name` - 可以在每个 `package.json` 文件中的 `name` 键下找到，例如 `@extension/content-script`，你可以仅使用 `content-script`，去掉 `@extension/` 前缀

## 环境变量

1. 复制 `.example.env` 到相同路径下并粘贴为 `.env`
2. 在 `.env` 中添加新的记录
3. 将此键及其类型添加到 `vite-env.d.ts`（根目录）中的 `ImportMetaEnv`。
4. 然后，你可以像使用标准 [Vite Env](https://vitejs.dev/guide/env-and-mode) 变量一样，通过 `import.meta.env.{YOUR_KEY}` 来使用它。

#### 如果你希望为每个包独立设置环境变量：

1. 在该包内创建 `.env` 文件。
2. 打开相关的 `vite.config.mts` 并在配置末尾添加 `envDir: '.'`。
3. 其余步骤同上

#### 请记住，同一包不能同时使用全局和本地环境变量（本地变量会覆盖全局变量）

## 项目结构 <a name="structure"></a>

### ChromeExtension <a name="structure-chrome-extension"></a>

主应用程序及背景脚本，清单文件：

- `manifest.js` - Chrome 扩展的清单文件
- `src/background` - Chrome 扩展的 [background script](https://developer.chrome.com/docs/extensions/mv3/background_pages/)（在 manifest.json 中是 `background.service_worker`）
- `public/content.css` - 用户页面注入的内容 CSS

### Packages <a name="structure-packages"></a>

一些共享包：

- `dev-utils` - 用于 Chrome 扩展开发的工具（例如清单解析器、日志记录器）
- `i18n` - Chrome 扩展的自定义 i18n 包，提供带类型安全和其他验证的 i18n 函数
- `hmr` - 用于 Vite 的自定义 HMR 插件，注入脚本以进行重新加载/刷新，HMR 开发服务器
- `shared` - 项目全局共享代码（类型、常量、自定义钩子、组件等）
- `storage` - 帮助更容易集成 [storage](https://developer.chrome.com/docs/extensions/reference/api/storage)，例如本地存储、会话存储
- `tailwind-config` - 项目全局共享的 Tailwind 配置
- `tsconfig` - 项目全局共享的 TypeScript 配置
- `ui` - 这里有一个函数可以将你的 Tailwind 配置与全局配置合并，你可以在此处保存组件
- `vite-config` - 项目全局共享的 Vite 配置
- `zipper` - 使用 ```pnpm zip``` 可以将 ```dist``` 文件夹打包成 ```extension.zip```，并存放在新创建的 ```dist-zip``` 文件夹中
- `e2e` - 使用 ```pnpm e2e``` 可以在不同浏览器上运行打包好的扩展的端到端测试

### Pages <a name="structure-pages"></a>

- `content` - Chrome 扩展的 [content script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)（manifest.json 中是 `content_scripts`）
- `content-ui` - 渲染用户页面 UI 的 [content script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)（manifest.json 中是 `content_scripts`）
- `content-runtime` - [content runtime script](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#functionality)，可以像标准 `content` 脚本一样从 `popup` 窗口注入
- `devtools` - Chrome 扩展的 [devtools](https://developer.chrome.com/docs/extensions/mv3/devtools/#creating)（manifest.json 中是 `devtools_page`）
- `devtools-panel` - [devtools](pages/devtools/src/index.ts) 开发工具面板
- `new-tab` - Chrome 扩展的 [new tab](https://developer.chrome.com/docs/extensions/mv3/override/)（manifest.json 中是 `chrome_url_overrides.newtab`）
- `options` - Chrome 扩展的 [options](https://developer.chrome.com/docs/extensions/mv3/options/)（manifest.json 中是 `options_page`）
- `popup` - Chrome 扩展的 [popup](https://developer.chrome.com/docs/extensions/reference/browserAction/)（manifest.json 中是 `action.default_popup`）
- `side-panel` - Chrome 扩展的侧边面板 [sidepanel(Chrome 114+)](https://developer.chrome.com/docs/extensions/reference/sidePanel/)（manifest.json 中是 `side_panel.default_path`）

## Community <a name="community"></a>

To chat with other community members, you can join the [Discord](https://discord.gg/4ERQ6jgV9a) server.
You can ask questions on that server, and you can also help others.

Also, suggest new features or share any challenges you've faced while developing Chrome extensions!

## Reference <a name="reference"></a>

- [Vite Plugin](https://vitejs.dev/guide/api-plugin.html)
- [ChromeExtension](https://developer.chrome.com/docs/extensions/mv3/)
- [Rollup](https://rollupjs.org/guide/en/)
- [Turborepo](https://turbo.build/repo/docs)
- [Rollup-plugin-chrome-extension](https://www.extend-chrome.dev/rollup-plugin)

## Turborepo 

Turborepo 是一个用于 JavaScript 和 TypeScript 项目的高效构建工具，专为 monorepo（多仓库管理）设计。它可以帮助开发者在单个代码库中管理多个包（例如前端、后端、库等），并通过智能的缓存和并行执行来加速构建过程。

### 主要功能和特点：
1. **增量构建**：Turborepo 通过缓存和增量构建，确保只有发生变化的部分需要重新构建，而其他未改动的部分可以跳过，从而提高构建速度。
2. **并行执行**：支持并行执行多个任务，充分利用多核处理器，提高构建效率。
3. **智能缓存**：Turborepo 允许缓存构建结果，避免重复构建相同的内容，减少不必要的计算。
4. **多平台支持**：Turborepo 可以与现有的工具链如 Vite、Webpack、Next.js 等兼容工作，帮助开发者在多种环境中实现更高效的开发流程。
5. **工作流优化**：支持定义工作流，自动化执行常见的开发任务，例如测试、构建、部署等。

Turborepo 通常用于管理多个模块或包的项目，特别是在大型项目或团队合作中，能够提供高效的构建与工作流管理，减少开发和部署的时间。

## 区别

| **特性**      | **Content Script**                                    | **Content Runtime (后台/服务工作者)**                                      |
|---------------|--------------------------------------------------------|-------------------------------------------------------------------------|
| **作用范围**   | 运行在网页中，可以访问网页的 DOM                        | 运行在扩展的后台，管理扩展的状态和生命周期                               |
| **与网页交互** | 可以直接修改网页内容，操作 DOM                          | 不直接与网页交互，主要处理扩展的全局任务                                 |
| **生命周期**   | 生命周期与网页相同，页面加载时注入，页面卸载时销毁      | 在扩展的生命周期内持续存在，可以在后台执行任务                           |
| **通信**       | 通过消息传递与后台页或弹出窗口通信                      | 通过消息传递与内容脚本、弹出窗口、或其他后台部分通信                      |
| **权限**       | 访问网页的 DOM 和 JS，但不具备扩展权限                  | 具备访问扩展 API 和浏览器权限，管理全局设置和存储                         |


## 参考

- https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite

