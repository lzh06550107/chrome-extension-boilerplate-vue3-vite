import { createApp } from 'vue';
import '@src/index.css';
import Panel from '@src/Panel';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Cannot find #app-container');
  }

  // 创建 Vue 应用实例并挂载
  const app = createApp(() => <Panel />);
  app.mount(appContainer);
}

// 初始化应用
init();
