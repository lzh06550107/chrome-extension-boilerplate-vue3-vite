import '@src/Options.css';
import { computed, defineComponent } from 'vue';
import { Button } from '@extension/ui';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';

const Options = defineComponent({
  name: 'OptionsDemo',
  setup() {
    const { data: theme } = useStorage(exampleThemeStorage);
    const isLight = computed(() => theme.value === 'light');
    const logo = computed(() => (isLight.value ? 'options/logo_horizontal.svg' : 'options/logo_horizontal_dark.svg'));

    // 处理点击事件，跳转到 Github
    const goGithubSite = () => {
      chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });
    };

    return {
      theme,
      isLight,
      logo,
      goGithubSite,
    };
  },
  render() {
    return (
      <div class={['App', this.isLight ? 'bg-slate-50 text-gray-900' : 'bg-gray-800 text-gray-100']}>
        <button onClick={this.goGithubSite}>
          <img src={chrome.runtime.getURL(this.logo)} class="App-logo" alt="logo" />
        </button>
        <p>
          Edit <code>pages/options/src/Options.tsx</code>
        </p>
        <Button className="mt-4" onClick={exampleThemeStorage.toggle} theme={this.theme}>
          Toggle theme
        </Button>
      </div>
    );
  },
});

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>));
