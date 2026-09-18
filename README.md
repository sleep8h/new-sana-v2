## 项目介绍
Sana H5 活动聚合前端（基于 Vue 3 + Vite）。本项目用于构建移动端 H5 活动页与嵌入式页面，面向快速集成、模块化资源管理和多语言支持，适合在移动端 WebView 或独立页面中运行。

## 技术栈 & 配置要点
- 框架：Vue 3（Composition API）
- 构建工具：Vite
- 路由：Vue Router 4（支持 history/hash，根据部署选择）
- 状态管理：Pinia
- 国际化：vue-i18n v11
- HTTP：axios（封装在 src/utils/http.js）
- 轮播：swiper（用于 VIP 切换等）

快速开始：

```bash
npm install
npm run dev      # 本地开发
npm run build:prod  # 生产构建
npm run preview   # 本地预览构建产物
```

## 建议的目录结构（更清晰的说明与约定）

项目根
- index.html                 # SPA 入口
- package.json               # 依赖与 npm 脚本
- vite.config.js             # Vite 配置
- README.md
- public/                    # 直接拷贝到构建产物的静态资源（favicon、静态图、robots 等）

src/
- main.js (或 main.ts)       # 应用入口，创建 app、router、pinia、i18n 等
- App.vue                    # 根组件，放置 <router-view> / keep-alive
- styles/ or style.css       # 全局样式（建议放到 styles/ 下并拆分）
- assets/                    # 组件/页面专属静态资源（按模块分文件夹）
    - p/                     # 按页面分组（你现在有很多 p/ 资源）
- components/                # 可复用组件（按钮、弹窗、navbar...）
- views/                     # 路由页面（按功能分文件夹）
    - P/                     # 原生嵌套页面集合（你的现有结构）
        - vipPrivilege/
            - index.vue
            - components/
                - vipPage.vue
        - inviteReward/
            - index.vue
    - a/                     # 活动/专题页面
    - home/                  # 首页/启动页
- router/
    - index.js                # 路由表，推荐统一使用小写/一致大小写（跨平台问题）
- pinia/ (或 store/)
    - index.js                # 状态管理入口与模块
- utils/
    - http.js                 # 封装 axios/get/post
    - message.js              # 全局提示封装
    - get-url-params.js       # URL 参数工具
- locales/                   # i18n 文案文件（en.json、zh.json、ar.json 等）

dist/                        # vite build 输出目录（部署此目录）

## 额外约定与建议
- 统一命名与大小写：模块和路由导入路径在 Windows/Mac/Linux 间可能表现不同，建议全项目保持一致（例如全部小写或与磁盘文件一致）。
- 入口与路由
  - App.vue 只渲染一次 <router-view>，用 router-view 的 slot props 包裹 keep-alive（Vue Router 4 推荐写法）。
- 缓存策略
  - 对需要保持状态的页面使用 <keep-alive> + onActivated/onDeactivated，避免频繁重复请求。
- 网络与错误处理
  - utils/http.js 中统一处理 token、ticket 等参数与错误码；接口失败时返回合理默认值，避免页面崩溃。
- 静态资源
  - public/ 放置构建时直接拷贝的资源；src/assets 用于按模块组织的图片，import 时走 Vite 处理。
- 本地脚本
  - npm run dev    # 本地开发
  - npm run build:prod  # 生产构建
  - npm run preview # 本地预览构建结果
