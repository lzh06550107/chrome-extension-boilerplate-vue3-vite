import type { DevLocale, MessageKey } from './type';
import { defaultLocale, getMessageFromLocale } from './getMessageFromLocale';

// 这段代码实现了一个轻量级的国际化翻译工具，用于基于消息键 (message key) 和占位符 (placeholders) 获取翻译文本，并提供了 Chrome 扩展相关的占位符替换支持。

type I18nValue = {
  message: string;
  placeholders?: Record<string, { content?: string; example?: string }>;
};

/**
 * 从 t.devLocale 对应的语言包中获取翻译文本。
 * 支持占位符替换，模仿 Chrome 扩展 i18n API 的行为。
 * @param key 翻译的消息键。
 * @param substitutions 可选的占位符替换值，可以是字符串或字符串数组。
 */
function translate(key: MessageKey, substitutions?: string | string[]) {
  const value = getMessageFromLocale(t.devLocale)[key] as I18nValue;
  let message = value.message;
  /**
   * This is a placeholder replacement logic. But it's not perfect.
   * It just imitates the behavior of the Chrome extension i18n API.
   * Please check the official document for more information And double-check the behavior on production build.
   *
   * @url https://developer.chrome.com/docs/extensions/how-to/ui/localization-message-formats#placeholders
   */
  if (value.placeholders) {
    // 遍历 placeholders 中的键值对 (key, content)。
    // 使用正则表达式替换消息文本中的占位符。
    Object.entries(value.placeholders).forEach(([key, { content }]) => {
      if (!content) {
        // 如果 content 为空，则跳过替换
        return;
      }
      // $key$ 是占位符的格式，区分大小写
      message = message.replace(new RegExp(`\\$${key}\\$`, 'gi'), content);
    });
  }
  if (!substitutions) {
    return message; // 如果 substitutions 为空，直接返回原始消息
  }
  // 如果 substitutions 是数组，则依次替换 $1, $2...
  if (Array.isArray(substitutions)) {
    return substitutions.reduce((acc, cur, idx) => acc.replace(`$${idx + 1}`, cur), message);
  }
  // 如果 substitutions 是字符串，则替换第一个匹配的 $n
  return message.replace(/\$(\d+)/, substitutions);
}

// 将未替换的 $n 占位符清除
function removePlaceholder(message: string) {
  return message.replace(/\$\d+/g, '');
}

/**
 * 调用 translate 进行翻译。
 * 移除未替换的占位符后返回最终消息。
 * @param args
 */
export const t = (...args: Parameters<typeof translate>) => {
  return removePlaceholder(translate(...args));
};

// t.devLocale 设置为 defaultLocale
t.devLocale = defaultLocale as DevLocale;
