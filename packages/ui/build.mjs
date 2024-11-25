import fs from 'node:fs';
import { replaceTscAliasPaths } from 'tsc-alias';
import { resolve } from 'node:path';
import esbuild from 'esbuild';
import vuePlugin from 'esbuild-plugin-vue';

/**
 * @type { import('esbuild').BuildOptions }
 */
const buildOptions = {
  entryPoints: ['./index.ts', './lib/**/*.ts', './lib/**/*.tsx'], // 指定了三个入口路径，包括 index.ts 和 lib 文件夹下的所有 .ts 和 .tsx 文件。支持通配符 (**) 匹配子目录中的文件
  tsconfig: './tsconfig.json', // 指定 TypeScript 配置文件的路径
  bundle: false, // 是否将所有模块打包到单个文件中
  target: 'es6', // 输出代码将兼容 ES6 规范的浏览器或运行环境
  outdir: './dist', // 定义输出目录
  sourcemap: true, // 设置为 true 会生成 Source Map 文件，用于调试和错误追踪
  jsxFactory: 'h',               // Vue 3 的 JSX 工厂函数是 h
  jsxFragment: 'Fragment',       // Vue 3 使用 Fragment 作为默认 JSX 片段
  plugins: [
    vuePlugin() // 加载 Vue 插件，支持 .vue 和 .tsx 文件
  ],
  define: {
    // 定义为字符串
    '__VUE_OPTIONS_API__': 'false', // 或者 'true'
    '__VUE_PROD_DEVTOOLS__': 'false',
  },
};

await esbuild.build(buildOptions);

/**
 * Post build paths resolve since ESBuild only natively
 * support paths resolution for bundling scenario
 * @url https://github.com/evanw/esbuild/issues/394#issuecomment-1537247216
 */
await replaceTscAliasPaths({
  configFile: 'tsconfig.json',
  watch: false,
  outDir: 'dist',
  declarationDir: 'dist',
});

fs.copyFileSync(resolve('lib', 'global.css'), resolve('dist', 'global.css'));
