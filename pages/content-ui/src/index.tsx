import { defineComponent, onMounted, createApp } from 'vue';
import App from '@src/App';
import tailwindcssOutput from '../dist/tailwind-output.css?inline';

export default defineComponent({
  name: 'ContentView',
  setup() {
    onMounted(() => {
      const root = document.createElement('div');
      root.id = 'chrome-extension-boilerplate-vue-content-view-root';
      document.body.appendChild(root);

      const rootIntoShadow = document.createElement('div');
      rootIntoShadow.id = 'shadow-root';

      const shadowRoot = root.attachShadow({ mode: 'open' });

      if (navigator.userAgent.includes('Firefox')) {
        /**
         * 在 Firefox 环境中，`adoptedStyleSheets` 存在兼容性问题。
         * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
         *
         * 通过插入 `<style>` 标签注入样式，可能导致与主页面样式冲突。
         */
        const styleElement = document.createElement('style');
        styleElement.innerHTML = tailwindcssOutput;
        shadowRoot.appendChild(styleElement);
      } else {
        // 将样式注入 Shadow DOM
        const globalStyleSheet = new CSSStyleSheet();
        globalStyleSheet.replaceSync(tailwindcssOutput);
        shadowRoot.adoptedStyleSheets = [globalStyleSheet];
      }

      shadowRoot.appendChild(rootIntoShadow);

      // 创建 Vue 应用并挂载到 Shadow DOM 中
      const app = createApp(App);
      app.mount(rootIntoShadow);
    });
  },
});
