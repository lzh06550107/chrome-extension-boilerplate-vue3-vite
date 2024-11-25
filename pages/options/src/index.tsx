import '@src/index.css';
import '@extension/ui/dist/global.css';
import Options from '@src/Options';
import { defineComponent, createApp } from 'vue';

const App = defineComponent({
  name: 'App',
  setup() {
    return () => <Options />;
  },
});

function init() {
  createApp(App).mount('#app-container');
}

init();
