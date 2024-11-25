import fs from 'node:fs';
import path from 'node:path';
import type { PluginOption } from 'vite';

/**
 * make entry point file for content script cache busting
 * 这段代码实现了一个 Vite 插件 makeEntryPointPlugin，
 * 其功能是为浏览器扩展的内容脚本（Content Script）生成入口点文件，主要目的是支持开发模式的缓存清除以及兼容 Firefox 的加载方式
 *
 * 插件主要功能
 * 1. 生成带 _dev.js 后缀的入口文件
 *
 *   内容脚本在开发模式下需要避免缓存，因此生成独立的入口文件，文件名以 _dev.js 结尾。
 *
 * 2. 兼容 Firefox 和 Chrome 加载机制
 *
 *   Firefox 使用 browser.runtime.getURL 加载脚本。
 *   Chrome 使用相对路径 import('./filename')。
 *
 * 3. 处理 Source Map
 *
 *   清理 .map 文件并重新生成其内容，使其与新的入口文件对应。
 *
 * 4. 开发模式清理文件
 *
 *   在 closeBundle 阶段清理不需要的临时文件。
 */
export function makeEntryPointPlugin(): PluginOption {
  // cleanupTargets：用于存储需要删除的 .map 文件路径
  const cleanupTargets = new Set<string>();
  // isFirefox：通过环境变量判断是否在 Firefox 环境下
  const isFirefox = process.env.__FIREFOX__ === 'true';

  return {
    name: 'make-entry-point-plugin',
    generateBundle(options, bundle) {
      const outputDir = options.dir;

      if (!outputDir) {
        throw new Error('Output directory not found');
      }

      // 遍历打包结果 bundle，对 chunk 和 asset 类型分别处理
      for (const module of Object.values(bundle)) {
        const fileName = path.basename(module.fileName);
        // 将原文件名的 .js 替换为 _dev.js 作为新的文件名
        const newFileName = fileName.replace('.js', '_dev.js');

        switch (module.type) {
          case 'asset':
            if (fileName.endsWith('.map')) {
              // 如果是 .map 文件
              // 记录路径到 cleanupTargets，后续删除
              cleanupTargets.add(path.resolve(outputDir, fileName));

              const originalFileName = fileName.replace('.map', '');
              const replacedSource = String(module.source).replaceAll(originalFileName, newFileName);

              // 清空 module.source，将新内容写入文件
              module.source = '';
              fs.writeFileSync(path.resolve(outputDir, newFileName), replacedSource);
              break;
            }
            break;

          case 'chunk': {
            // 对 chunk 类型的模块，生成 _dev.js 文件并调整加载方式
            fs.writeFileSync(path.resolve(outputDir, newFileName), module.code);

            if (isFirefox) {
              // Firefox：通过 browser.runtime.getURL 加载脚本，以保证路径兼容性
              const contentDirectory = extractContentDir(outputDir);
              module.code = `import(browser.runtime.getURL("${contentDirectory}/${newFileName}"));`;
            } else {
              // Chrome：使用相对路径 import('./filename') 加载脚本
              module.code = `import('./${newFileName}');`;
            }
            break;
          }
        }
      }
    },
    closeBundle() {
      // 在 closeBundle 阶段删除之前记录的 .map 文件
      cleanupTargets.forEach(target => {
        fs.unlinkSync(target);
      });
    },
  };
}

/**
 * Extract content directory from output directory for Firefox
 * 从输出路径中提取内容目录，用于生成 Firefox 加载脚本所需的路径
 * @param outputDir
 */
function extractContentDir(outputDir: string) {
  const parts = outputDir.split(path.sep);
  const distIndex = parts.indexOf('dist');

  if (distIndex !== -1 && distIndex < parts.length - 1) {
    return parts.slice(distIndex + 1);
  }
  // 如果路径中未包含 dist，抛出错误
  throw new Error('Output directory does not contain "dist"');
}
