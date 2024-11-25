import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

// Theme 是一个字符串字面量类型，表示可以选择的两个主题：light 和 dark
type Theme = 'light' | 'dark';

// ThemeStorage 类型继承自 BaseStorage<Theme>，同时增加了一个 toggle 方法，用于切换主题。BaseStorage<Theme> 提供了对存储的基本操作（如 get、set、subscribe 等）
type ThemeStorage = BaseStorage<Theme> & {
  toggle: () => Promise<void>;
};

// 这段代码展示了如何基于之前定义的 createStorage 函数和存储类型创建一个 ThemeStorage 对象，用于管理用户的主题偏好（light 或 dark）。它使用了 chrome.storage.local 存储，并支持实时更新。
const storage = createStorage<Theme>('theme-storage-key', 'light', {
  storageEnum: StorageEnum.Local, // 设置为 StorageEnum.Local，表示使用浏览器的本地存储
  liveUpdate: true, // 设置为 true，表示当存储中的数据发生变化时，会自动更新
});

// You can extend it with your own methods
export const exampleThemeStorage: ThemeStorage = {
  ...storage, // 在 storage 的基础上，通过 toggle 方法扩展了主题切换的功能
  // toggle 方法通过调用 storage.set 来更新当前存储的主题。它通过传递一个函数来更新当前主题值：如果当前主题是 'light'，则切换为 'dark'，反之亦然
  toggle: async () => {
    await storage.set(currentTheme => {
      return currentTheme === 'light' ? 'dark' : 'light';
    });
  },
};
