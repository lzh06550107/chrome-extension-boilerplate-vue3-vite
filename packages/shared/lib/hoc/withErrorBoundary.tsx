import { defineComponent, ref, h } from 'vue';
import type { DefineComponent, ComponentObjectPropsOptions } from 'vue';

// 代码实现了一个基于 Vue 的错误边界（Error Boundary），用于捕获组件渲染、生命周期方法或子组件中抛出的错误，并优雅地展示回退 UI，而不是让整个应用崩溃
const ErrorBoundary = defineComponent({
  name: 'ErrorBoundary',
  setup() {
    const hasError = ref(false);

    const onErrorCaptured = (err: unknown) => {
      console.error('Captured Error:', err);
      hasError.value = true;
      return false; // 阻止向上传递
    };

    return {
      hasError,
      onErrorCaptured,
    };
  },
  render() {
    // 根据 hasError 来决定渲染回退 UI 或者子组件
    return this.hasError
      ? this.$slots.fallback?.() // 如果有错误，渲染 fallback 插槽
      : this.$slots.default?.(); // 否则，渲染默认插槽
  },
});

export function withErrorBoundary<T extends Record<string, any>>(WrappedComponent: DefineComponent) {
  return defineComponent({
    name: 'WithErrorBoundary',
    setup(props: ComponentObjectPropsOptions<T>) {
      return () => (
        <ErrorBoundary>
          {{
            default: () => <WrappedComponent {...props} />,
            fallback: () => h('div', 'Error Occurred'), // 这里是 fallback 插槽的内容
          }}
        </ErrorBoundary>
      );
    },
  });
}
