import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';
import { rimraf } from 'rimraf';

/**
 * @param i18nPath {string} 用于确保项目的 lib/i18n.ts 文件始终是最新的翻译配置
 */
export async function build(i18nPath) {
  // 将指定的 i18n 文件路径 (i18nPath) 复制到项目的 lib 目录下，并重命名为 i18n.ts
  fs.cpSync(i18nPath, path.resolve('lib', 'i18n.ts'));

  await esbuild.build({
    entryPoints: ['./index.ts'], // 使用 esbuild 对项目的主入口文件 index.ts 进行打包
    tsconfig: './tsconfig.json', // 指定 TypeScript 配置文件路径为 ./tsconfig.json
    bundle: true, // 启用打包模式，将所有依赖文件打包为一个文件
    packages: 'bundle', // 用于处理依赖包的打包（可能是为独立打包非 Node 环境中的代码）
    target: 'es6', // 指定目标输出为 ES6
    outdir: './dist', // 输出文件夹路径为 dist
    sourcemap: true, // 生成 sourcemap 文件，便于调试
    format: 'esm', // 输出格式为 ES 模块
  });

  // 清理旧的本地化文件夹
  const outDir = path.resolve('..', '..', 'dist');
  const localePath = path.resolve(outDir, '_locales');
  // 使用 rimraf 库递归删除目标路径 dist/_locales，以确保重新构建时不会遗留旧的文件
  rimraf.sync(localePath);
  // 将项目中的 locales 文件夹递归复制到 dist/_locales，确保所有语言文件被正确打包到构建目录中
  fs.cpSync(path.resolve('locales'), localePath, { recursive: true });

  console.log('I18n build complete');
}
