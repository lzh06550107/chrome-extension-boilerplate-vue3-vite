import '@src/index.css';
import SidePanel from '@src/SidePanel';
import { defineComponent, createApp } from 'vue';

const App = defineComponent({
  name: 'App',
  setup() {
    return () => <SidePanel />;
  },
});

function init() {
  createApp(App).mount('#app-container');
}

init();
