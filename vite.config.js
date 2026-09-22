import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver"; // 关键解析器

import postCssPxToRem from "postcss-pxtorem";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Vue 相关 API（如 ref, reactive）
    AutoImport({
      resolvers: [VantResolver()], // 关联 Vant 解析器
      imports: ["vue", "vue-router"], // 按需导入的模块
      dts: "src/auto-imports.d.ts", // 生成类型声明文件
    }),
    // 自动注册组件
    Components({
      resolvers: [VantResolver()], // 自动识别 Vant 组件
      dts: "src/components.d.ts", // 生成组件类型声明
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          // 配置在将px转化为rem时 16px等于多少px(因为我们搭配使用了amfe-flexible插件 此处我们需要设置的值应是UI设计稿全屏基准宽度的十分之一)
          // 当UI设计稿的全屏基准宽度是1920px时 此处设置的值为192
          rootValue: 37.5, // UI设计稿的宽度/10
          unitPrecision: 5, // 转rem精确到小数多少位
          propList: ["*"], //需要转换的属性 ， *代表所有属性
          selectorBlackList: ["ignore", "html"], //需要忽略的属性 ， ignore代表忽略
          replace: true, //是否替换属性
          mediaQuery: false, //是否处理媒体查询
          minPixelValue: 0, //设置要替换的最小像素值
          exclude: /node_modules/i, //排除的文件
        }),
        // pxToViewport({
        //   unitToConvert: 'px', // 需要转换的单位，默认为'px'
        //   viewportWidth: 1920,  // 基准视口宽度（对应设计稿的宽度）
        //   unitPrecision: 6,    // px转换为vw的小数位数（很多情况下用5）
        //   propList: ['*'],     // 指定需要转换的属性，'*'表示全部转换，'font-size'表示只转换font-size属性
        //   viewportUnit: 'vw',  // 指定需要转换成的视口单位，默认vw
        //   fontViewportUnit: 'vw', // 字体使用的视口单位，改为vw保持一致
        //   selectorBlackList:  ['ignore-'], // 指定不转换为视口单位的类名，用逗号隔开
        //   minPixelValue: 1,    // 小于或等于1px不转换为视口单位，默认1
        //   mediaQuery: false,   // 允许在媒体查询中转换px
        //   replace: true,       // 是否直接替换而不是添加后缀
        //   exclude: /node_modules/, // 设置忽略文件，用正则表达式匹配路径
        //   include: [], // 包含那些文件或者特定文件
        //   landscape: false, // 是否处理横屏情况
        // }),
      ],
    },
  },

  base: "/v1/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
    // 解决 Vant 样式文件路径问题（关键！）
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  // 代理配置（核心）
  server: {
    proxy: {
      // 规则1：代理所有以 /api 开头的请求
      "/api": {
        target: "https://apitest.makilive.com", // 目标服务器地址
        changeOrigin: true, // 改写请求源为目标域名
        rewrite: (path) => path.replace(/^\/api/, ""), // 移除路径中的 /api
        secure: false, // 避免SSL证书验证（对HTTPS目标）
      },
      // 规则2：自定义路径代理（根据需求添加）
      "/h5doings": {
        // ✅ 与请求路径一致
        target: "https://apitest.makilive.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/h5doings/, ""), // 按需重写
      },
    },
  },
});
