/**
 * This file is generated by generate-i18n.mjs
 * Do not edit this file directly
 * 为每种语言导入其对应的 messages.json 文件
 */
import type enMessage from '../locales/en/messages.json';
import type koMessage from '../locales/ko/messages.json';

// 生成 MessageKey 类型：包含所有语言中共有的翻译键
export type MessageKey = keyof typeof enMessage & keyof typeof koMessage;
// 生成 DevLocale 类型：列出所有支持的语言代码
export type DevLocale = 'en' | 'ko';
