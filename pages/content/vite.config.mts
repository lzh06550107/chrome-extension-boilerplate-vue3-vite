import { resolve } from 'node:path';
import { makeEntryPointPlugin } from '@extension/hmr';
import { isDev, withPageConfig } from '@extension/vite-config';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

// 这段代码是一个Vite的配置文件，主要用于为一个内容脚本（content script）构建配置。它结合了插件、路径别名和自定义设置
export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  publicDir: resolve(rootDir, 'public'),
  plugins: [isDev && makeEntryPointPlugin()], // 开发模式下插件
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'), // 设置内容脚本的入口文件为 src/index.ts
      formats: ['iife'], // 指定构建的格式为 iife（立即执行函数表达式），这种格式适合直接嵌入浏览器中
      name: 'ContentScript', // 当库加载到浏览器时，使用 ContentScript 作为全局变量名
      fileName: 'index', // 输出的文件名为 index.js
    },
    outDir: resolve(rootDir, '..', '..', 'dist', 'content'),
  },
});
