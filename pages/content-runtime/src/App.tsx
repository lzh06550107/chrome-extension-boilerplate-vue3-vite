import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    // 等效于 React 的 useEffect
    onMounted(() => {
      console.log('runtime content view loaded');
    });

    return () => <div class="runtime-content-view-text">runtime content view</div>;
  },
});
