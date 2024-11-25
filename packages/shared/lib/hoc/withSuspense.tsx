import type { DefineComponent, VNode } from 'vue';
import { defineComponent, h, Suspense } from 'vue';

export function withSuspense<T>(Component: DefineComponent<T>, SuspenseComponent: VNode) {
  return defineComponent({
    name: 'WithSuspense',
    render() {
      return h(
        Suspense,
        {
          fallback: SuspenseComponent, // 加载时显示的组件
        },
        {
          default: () => h(Component), // 渲染传入的组件
        },
      );
    },
  });
}
