import esbuild from 'esbuild';

/**
 * @type { import('esbuild').BuildOptions }
 */
const buildOptions = {
  entryPoints: ['./index.ts', './lib/**/*.ts'], // 指定入口文件，这里包括 index.ts 和 lib 文件夹中所有 .ts 和 .tsx 文件
  tsconfig: './tsconfig.json', // 指定 tsconfig.json 文件路径，用于 TypeScript 配置
  bundle: false, // 设置为 false，表示不对文件进行打包，而是单独输出文件
  target: 'es6', // 指定编译的目标环境，这里为 es6
  outdir: './dist', // 指定输出文件夹为 dist
  sourcemap: true, // 生成源码映射（source map），方便调试
};

await esbuild.build(buildOptions);
