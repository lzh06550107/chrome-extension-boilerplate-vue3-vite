import { defineComponent, createApp } from 'vue';
import '@src/index.css';
import '@extension/ui/lib/global.css';
import NewTab from '@src/NewTab';

const App = defineComponent({
  name: 'App',
  setup() {
    return () => <NewTab />;
  },
});

function init() {
  createApp(App).mount('#app-container');
}

init();
