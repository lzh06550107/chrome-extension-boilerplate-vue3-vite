import esbuild from 'esbuild';
import vuePlugin from 'esbuild-plugin-vue'; // vue 插件支持

/**
 * @type { import('esbuild').BuildOptions }
 */
const buildOptions = {
  entryPoints: ['./index.ts', './lib/**/*.ts', './lib/**/*.tsx'], // 指定入口文件，这里包括 index.ts 和 lib 文件夹中所有 .ts 和 .tsx 文件
  tsconfig: './tsconfig.json', // 指定 tsconfig.json 文件路径，用于 TypeScript 配置
  bundle: false, // 设置为 false，表示不对文件进行打包，而是单独输出文件
  target: 'es6', // 指定编译的目标环境，这里为 es6
  outdir: './dist', // 指定输出文件夹为 dist
  sourcemap: true, // 生成源码映射（source map），方便调试
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

// 使用 esbuild.build() 方法执行构建，将会根据 buildOptions 配置编译并输出结果
await esbuild.build(buildOptions);
