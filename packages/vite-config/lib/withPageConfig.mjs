import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { watchRebuildPlugin } from '@extension/hmr';
import deepmerge from 'deepmerge';
import { isDev, isProduction } from './env.mjs';

export const watchOption = isDev
  ? {
      buildDelay: 100, // 这是一个基于 Vite 的配置文件，其中提供了一个用于自定义页面配置的 withPageConfig 函数，结合了 React 插件和其他扩展功能
      chokidar: {
        // 通过正则表达式忽略指定文件或目录的变化，例如忽略 packages 目录中的 .ts, .tsx, 和 .map 文件
        ignored: [/\/packages\/.*\.(ts|tsx|map)$/],
      },
    }
  : undefined;

/**
 * 这是一个基于 Vite 的配置文件，其中提供了一个用于自定义页面配置的 withPageConfig 函数，结合了 React 插件和其他扩展功能
 * @typedef {import('vite').UserConfig} UserConfig
 * @param {UserConfig} config 用户传入的自定义配置对象
 * @returns {UserConfig}
 */
export function withPageConfig(config) {
  return defineConfig(
    // 使用 deepmerge 将默认配置和用户自定义配置合并，并通过 defineConfig 生成最终的 Vite 配置
    deepmerge(
      {
        base: '', // 设置项目的基础路径，默认为根路径
        // 使用 SWC 编译器加速 React 项目
        // 在开发模式下启用热重载插件，并自动刷新浏览器。
        plugins: [
          vue(),
          vueJsx(),
          isDev && watchRebuildPlugin({ refresh: true })
        ],
        build: {
          sourcemap: isDev, // 开发模式下生成 Source Map，方便调试
          minify: isProduction, // 生产模式下启用代码压缩
          reportCompressedSize: isProduction, // 生产模式下报告压缩后的文件大小
          emptyOutDir: isProduction, // 生产模式下清空输出目录
          watch: watchOption, // 开发模式下启用文件监视
          rollupOptions: {
            // 将 chrome 标记为外部依赖，不打包到最终构建文件中
            external: ['chrome'],
          },
        },
        define: {
          // 定义全局环境变量，用于区分开发与生产环境
          'process.env.NODE_ENV': isDev ? `"development"` : `"production"`,
        },
        envDir: '../..', // 指定环境变量文件（如 .env）的路径为项目的上级目录
      },
      config,
    ),
  );
}
