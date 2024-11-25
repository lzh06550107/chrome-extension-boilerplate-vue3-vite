import type { PluginOption } from 'vite';
import fg from 'fast-glob';

// watchPublicPlugin 是一个简单的 Vite 插件，用于监听 public 目录下的文件变化，并在文件发生更改时触发重新构建
export function watchPublicPlugin(): PluginOption {
  return {
    name: 'watch-public-plugin',
    // 每次构建开始时调用
    async buildStart() {
      // 使用 fast-glob (fg) 搜索 public 目录下的所有文件
      const files = await fg(['public/**/*']); // 当 public 目录下的文件发生变化时，Vite 会自动重新构建

      // 将找到的文件加入到 Vite 的文件监听系统中
      for (const file of files) {
        this.addWatchFile(file);
      }
    },
  };
}
