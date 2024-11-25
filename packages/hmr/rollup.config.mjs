import sucrase from '@rollup/plugin-sucrase';

// 这段代码是一个用于配置 Rollup 打包工具的配置文件，主要使用了 @rollup/plugin-sucrase 插件来处理 TypeScript 文件。
// 它定义了两个输入文件，并将它们分别打包为 IIFE（立即调用函数表达式）格式的 JavaScript 文件。

// @rollup/plugin-sucrase 插件用于处理 TypeScript 文件，因为默认情况下 Rollup 并不直接支持 TypeScript，需要借助插件来进行转换。
// exclude: ['node_modules/**'] 选项表示排除 node_modules 中的所有文件，避免不必要的文件被转换。
// transforms: ['typescript'] 表示只对 TypeScript 文件进行转换，其他文件类型将保持原样。
const plugins = [
  sucrase({
    exclude: ['node_modules/**'],
    transforms: ['typescript'],
  }),
];

/**
 * @type {import("rollup").RollupOptions[]}
 */
export default [
  {
    plugins, // 使用上面定义的 sucrase 插件数组来处理文件
    input: 'lib/injections/reload.ts', // 输入的 TypeScript 文件路径，处理 reload.ts
    output: {
      format: 'iife', // 立即调用函数表达式，适用于直接在浏览器中加载的脚本
      file: 'build/injections/reload.js', // 输出的文件路径
    },
  },
  {
    plugins,
    input: 'lib/injections/refresh.ts', // 处理 refresh.ts
    output: {
      format: 'iife',
      file: 'build/injections/refresh.js',
    },
  },
];
