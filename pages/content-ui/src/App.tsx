import { defineComponent, onMounted } from 'vue';
import { Button } from '@extension/ui';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';

export default defineComponent({
  name: 'App',
  setup() {
    const { data, isLoading, error } = useStorage(exampleThemeStorage);

    // 模拟 React 的 useEffect，onMounted 用于组件挂载后的逻辑
    onMounted(() => {
      console.log('content ui loaded');
    });

    // 返回 setup 的数据与方法
    return {
      data,
      isLoading,
      error,
    };
  },
  render() {
    return (
      <div class="flex items-center justify-between gap-2 rounded bg-blue-100 px-2 py-1">
        <div class="flex gap-1 text-blue-500">
          Edit <strong class="text-blue-700">pages/content-ui/src/app.tsx</strong> and save to reload.
        </div>
        <Button theme={this.data} onClick={exampleThemeStorage.toggle}>
          Toggle Theme
        </Button>
      </div>
    );
  },
});
