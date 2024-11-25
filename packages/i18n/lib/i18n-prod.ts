import type { DevLocale, MessageKey } from './type';

/**
 * 这段代码实现了一个简单的国际化工具函数 t，它直接使用 Chrome 扩展的 chrome.i18n.getMessage API 来获取本地化消息
 * @param key 本地化消息键（MessageKey）
 * @param substitutions 占位符替换值，可选，可以是单个字符串或字符串数组
 */
export function t(key: MessageKey, substitutions?: string | string[]) {
  // 根据提供的 key，从 Chrome 的本地化消息文件中获取对应的翻译文本。从扩展的 _locales 文件夹下的 JSON 文件中获取翻译文本。
  // 如果翻译文本中包含 $n 占位符，则使用 substitutions 替换。
  return chrome.i18n.getMessage(key, substitutions);
}

t.devLocale = '' as DevLocale; // for type consistency with i18n-dev.ts
