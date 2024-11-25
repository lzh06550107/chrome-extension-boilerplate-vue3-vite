import { computed, defineComponent, onMounted } from 'vue';
import { Button } from '@extension/ui';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import '@src/NewTab.css';
import '@src/NewTab.scss';

const NewTab = defineComponent({
  name: 'NewTab',
  setup() {
    // 使用 useStorage 获取主题
    const { data: theme } = useStorage(exampleThemeStorage);
    const isLight = computed(() => theme.value === 'light'); // 判断当前主题
    const logo = computed(() => (isLight.value ? 'new-tab/logo_horizontal.svg' : 'new-tab/logo_horizontal_dark.svg'));

    // 打开 Github
    const goGithubSite = () => {
      chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });
    };

    // 生命周期钩子
    onMounted(() => {
      console.log(t('hello', 'World'));
    });

    return {
      theme,
      isLight,
      logo,
      goGithubSite,
    };
  },
  render() {
    return (
      <div class={['App', this.isLight ? 'bg-slate-50' : 'bg-gray-800']}>
        <header class={['App-header', this.isLight ? 'text-gray-900' : 'text-gray-100']}>
          <button onClick={this.goGithubSite}>
            <img src={chrome.runtime.getURL(this.logo)} class="App-logo" alt="logo" />
          </button>
          <p>
            Edit <code>pages/new-tab/src/NewTab.tsx</code>
          </p>
          <h6>The color of this paragraph is defined using SASS.</h6>
          <Button className="mt-4" onClick={exampleThemeStorage.toggle} theme={this.theme}>
            {t('toggleTheme')}
          </Button>
        </header>
      </div>
    );
  },
});

export default withErrorBoundary(withSuspense(NewTab, <div>{t('loading')}</div>));
