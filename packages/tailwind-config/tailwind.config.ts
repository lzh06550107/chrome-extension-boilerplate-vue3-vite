import type { Config } from 'tailwindcss/types/config';

export default {
  theme: {
    extend: {}, // 这是 Tailwind CSS 的核心配置部分。extend 用来扩展默认的主题配置。在这个例子中，extend 是一个空对象 {}，意味着没有额外的主题配置被添加
  },
  plugins: [], // 这是一个数组，用来指定 Tailwind CSS 的插件。在这个配置中，插件数组为空，表示没有启用任何插件。
} as Omit<Config, 'content'>;
