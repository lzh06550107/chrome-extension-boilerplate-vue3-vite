import { defineComponent, computed } from 'vue';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import '@src/SidePanel.css';

const SidePanel = defineComponent({
  name: 'SidePanel',
  setup() {
    const { data: theme } = useStorage(exampleThemeStorage);
    const isLight = computed(() => theme.value === 'light');
    const logo = computed(() => (isLight.value ? 'side-panel/logo_vertical.svg' : 'side-panel/logo_vertical_dark.svg'));

    const goGithubSite = () => {
      chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });
    };

    return () => (
      <div class={`App ${isLight.value ? 'bg-slate-50' : 'bg-gray-800'}`}>
        <header class={`App-header ${isLight.value ? 'text-gray-900' : 'text-gray-100'}`}>
          <button onClick={goGithubSite}>
            <img src={chrome.runtime.getURL(logo.value)} class="App-logo" alt="logo" />
          </button>
          <p>
            Edit <code>pages/side-panel/src/SidePanel.tsx</code>
          </p>
          <ToggleButton>Toggle theme</ToggleButton>
        </header>
      </div>
    );
  },
});

const ToggleButton = defineComponent({
  name: 'ToggleButton',
  props: {
    className: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    const { data: theme } = useStorage(exampleThemeStorage);
    const buttonClass = computed(() => {
      return (
        `${props.className} ` +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme.value === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      );
    });

    return () => (
      <button class={buttonClass.value} onClick={exampleThemeStorage.toggle}>
        {slots.default ? slots.default() : ''}
      </button>
    );
  },
});

export default withErrorBoundary(withSuspense(SidePanel, <div>Loading ... </div>));
