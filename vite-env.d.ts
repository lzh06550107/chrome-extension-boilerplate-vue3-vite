/// <reference types="vite/client" />

import { type VNode } from 'vue';

interface ImportMetaEnv {
  readonly VITE_EXAMPLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 声明 JSX 的 IntrinsicElements 类型
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any; // 支持 HTML 标签
    }
    type Element = VNode; // 将 JSX 元素与 Vue 的 VNode 对应
  }
}
