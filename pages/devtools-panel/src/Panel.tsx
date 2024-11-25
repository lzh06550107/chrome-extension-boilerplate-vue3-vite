import { defineComponent, computed, h } from 'vue';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import '@src/Panel.css';

const ToggleButton = defineComponent({
  name: 'ToggleButton',
  props: {
    className: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    const theme = useStorage(exampleThemeStorage);

    const handleToggle = () => {
      exampleThemeStorage.toggle();
    };

    return () => (
      <button
        class={[
          props.className,
          'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105',
          theme.value === 'light' ? 'bg-white text-black' : 'bg-black text-white',
        ]}
        onClick={handleToggle}>
        {slots.default ? slots.default() : 'Toggle'}
      </button>
    );
  },
});

const Panel = defineComponent({
  name: 'PanelDemo',
  setup() {
    const theme = useStorage(exampleThemeStorage);
    const isLight = computed(() => theme.value === 'light');
    const logo = computed(() =>
      isLight.value ? 'devtools-panel/logo_horizontal.svg' : 'devtools-panel/logo_horizontal_dark.svg',
    );

    const goGithubSite = () => {
      chrome.tabs.create({
        url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite',
      });
    };

    return () => (
      <div class={['App', isLight.value ? 'bg-slate-50' : 'bg-gray-800']}>
        <header class={['App-header', isLight.value ? 'text-gray-900' : 'text-gray-100']}>
          <button onClick={goGithubSite}>
            <img src={chrome.runtime.getURL(logo.value)} class="App-logo" alt="logo" />
          </button>
          <p>
            Edit <code>pages/devtools-panel/src/Panel.tsx</code>
          </p>
          <ToggleButton>Toggle theme</ToggleButton>
        </header>
      </div>
    );
  },
});

// 当传入 JSX 代码时，Vue JSX 插件会将 JSX 转换为 Vue 的虚拟节点，但类型系统未能正确识别
export default withErrorBoundary(withSuspense(Panel, <div>Loading...</div>));
