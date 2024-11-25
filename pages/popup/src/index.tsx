import '@src/index.css';
import Popup from '@src/Popup';
import { defineComponent, createApp } from 'vue';

const App = defineComponent({
  name: 'App',
  setup() {
    return () => <Popup />;
  },
});

function init() {
  createApp(App).mount('#app-container');
}

init();
