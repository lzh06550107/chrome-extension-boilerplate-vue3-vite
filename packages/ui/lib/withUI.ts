import deepmerge from 'deepmerge';
import type { Config } from 'tailwindcss/types/config';

export function withUI(tailwindConfig: Config): Config {
  return deepmerge(tailwindConfig, {
    // content 是 Tailwind CSS 中的一个配置项，用来指定哪些文件需要被扫描，以便从这些文件中提取出用于生成 CSS 的类。
    // 这里，content 配置指定了一个文件匹配模式：./node_modules/@extension/ui/lib/**/*.{tsx,ts,js,jsx}，
    // 这意味着 Tailwind 会扫描 @extension/ui 包中的 .tsx, .ts, .js, .jsx 文件，提取出其中的类。
    content: ['./node_modules/@extension/ui/lib/**/*.{tsx,ts,js,jsx}'],
  });
}
