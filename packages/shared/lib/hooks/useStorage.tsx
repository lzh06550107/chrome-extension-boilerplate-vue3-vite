import { type Ref, ref, watchEffect } from 'vue';

// 定义存储接口
interface BaseStorage<Data> {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => Data | null;
  get: () => Promise<Data>;
}

// WeakMap 用于缓存数据的异步加载状态，避免重复请求
const storageStateMap = new WeakMap<BaseStorage<any>, { isLoading: Ref<boolean>; error: Ref<unknown> }>();

// 核心函数：将存储实例与 Vue 响应式系统集成，并支持 Suspense
export function useStorage<
  Storage extends BaseStorage<Data>,
  Data = Storage extends BaseStorage<infer T> ? T : unknown,
>(
  storage: Storage,
): { data: Ref<Exclude<Data, PromiseLike<unknown>> | null>; isLoading: Ref<boolean>; error: Ref<unknown> } {
  // Exclude<Data, PromiseLike<unknown>>：从 Data 中排除所有 PromiseLike 类型的部分，确保最终类型不是 Promise 或类 Promise 的类型
  const data = ref<Data | null>(storage.getSnapshot());
  const isLoading = ref(true);
  const error = ref<unknown>(null);

  // 设置初始状态到 WeakMap 中
  if (!storageStateMap.has(storage)) {
    storageStateMap.set(storage, { isLoading, error });
  }

  // 同步外部存储的数据
  watchEffect(onCleanup => {
    const unsubscribe = storage.subscribe(() => {
      data.value = storage.getSnapshot();
    });

    onCleanup(() => unsubscribe());
  });

  // 加载数据
  const load = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      data.value = await storage.get();
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  // 如果数据为空，触发加载
  if (data.value === null) {
    load();
  }

  return {
    data: data as Ref<Exclude<Data, PromiseLike<unknown>> | null>, // 确保类型正确
    isLoading: isLoading,
    error: error,
  };
}
