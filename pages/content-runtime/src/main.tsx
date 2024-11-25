import { createApp } from 'vue';
import App from './App'; // Vue 应用的根组件

// 模拟样式内容，可以根据需求修改
import injectedStyle from '@src/index.css?inline';

// 挂载函数
export function mount() {
  // 创建主容器
  const root = document.createElement('div');
  root.id = 'chrome-extension-boilerplate-vue-runtime-content-view-root';

  // 将主容器添加到 body
  document.body.append(root);

  // 创建 Shadow DOM 容器
  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = 'shadow-root';

  const shadowRoot = root.attachShadow({ mode: 'open' });

  // 处理样式
  if (navigator.userAgent.includes('Firefox')) {
    /**
     * Firefox 环境特殊处理：
     * 由于不支持 adoptedStyleSheets API，所以通过 <style> 标签注入样式。
     */
    const styleElement = document.createElement('style');
    styleElement.innerHTML = injectedStyle;
    shadowRoot.appendChild(styleElement);
  } else {
    /**
     * 在支持 adoptedStyleSheets 的浏览器中，使用 CSSStyleSheet 注入样式。
     */
    const globalStyleSheet = new CSSStyleSheet();
    globalStyleSheet.replaceSync(injectedStyle);
    shadowRoot.adoptedStyleSheets = [globalStyleSheet];
  }

  // 将 Shadow DOM 挂载点添加到 shadowRoot
  shadowRoot.appendChild(rootIntoShadow);

  // 使用 Vue 挂载应用
  const app = createApp(App);
  app.mount(rootIntoShadow);
}
