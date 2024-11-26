import { defineComponent, computed } from 'vue';
import { useStorage } from '@extension/shared'; // 假设 useStorage 在 Vue 中可用
import { exampleThemeStorage } from '@extension/storage';
import '@src/Popup.css';

// notificationOptions 定义
const notificationOptions = {
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon-34.png'),
  title: 'Injecting content script error',
  message: 'You cannot inject script here!',
};

const Popup = defineComponent({
  name: 'PopupDemo',
  setup() {
    const { data: theme } = useStorage(exampleThemeStorage);
    const isLight = computed(() => theme.value === 'light');
    const logo = computed(() => (isLight.value ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg'));

    // 打开 Github 页面
    const goGithubSite = () => {
      chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });
    };

    // 注入内容脚本
    const injectContentScript = async () => {
      const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

      if (tab.url!.startsWith('about:') || tab.url!.startsWith('chrome:')) {
        chrome.notifications.create('inject-error', notificationOptions);
      }

      await chrome.scripting
        .executeScript({
          target: { tabId: tab.id! },
          files: ['/content-runtime/index.iife.js'],
        })
        .catch(err => {
          if (err.message.includes('Cannot access a chrome:// URL')) {
            chrome.notifications.create('inject-error', notificationOptions);
          }
        });
    };

    return () => (
      <div class={`App ${isLight.value ? 'bg-slate-50' : 'bg-gray-800'}`}>
        <header class={`App-header ${isLight.value ? 'text-gray-900' : 'text-gray-100'}`}>
          <button onClick={goGithubSite}>
            <img src={chrome.runtime.getURL(logo.value)} class="App-logo" alt="logo" />
          </button>
          <p>
            Edit <code>pages/popup/src/Popup.tsx</code>
          </p>
          <button
            class={`font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ${
              isLight.value ? 'bg-blue-200 text-black' : 'bg-gray-700 text-white'
            }`}
            onClick={injectContentScript}>
            Click to inject Content Script
          </button>
          <ToggleButton>Toggle theme</ToggleButton>
        </header>
      </div>
    );
  },
});

// ToggleButton 组件
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
        (theme.value === 'light' ? 'bg-white text-black shadow-black' : 'bg-black text-white')
      );
    });

    const handleClick = async () => {
      await exampleThemeStorage.toggle();
    };

    return () => (
      <button class={buttonClass.value} onClick={handleClick}>
        {slots.default ? slots.default() : ''}
      </button>
    );
  },
});

export default Popup;
