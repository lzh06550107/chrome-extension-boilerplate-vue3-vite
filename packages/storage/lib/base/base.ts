import type { BaseStorage, StorageConfig, ValueOrUpdate } from './types';
import { SessionAccessLevelEnum, StorageEnum } from './enums';

// 这段代码实现了一个用于创建存储区域并管理数据存储与交换的工具。它结合了 Chrome 存储 API，并使用了类型安全的设计来处理不同类型的数据存储需求
// 实现了一个基于 Chrome 存储 API 的存储工具，它支持不同类型的存储（如 localStorage、sessionStorage、syncStorage 等）以及动态更新存储数据。代码的设计具有高度的类型安全性，同时支持实时数据更新与订阅机制。

// 主要功能
// 1. 支持多种存储方式：
//
//    * 根据 config 提供的 storageEnum，可以选择不同的存储类型，如 localStorage、syncStorage、sessionStorage 等。
//
// 2. 缓存机制：
//
//    * 使用 cache 来存储从 Chrome 存储加载的数据，避免每次读取时都进行网络请求。
//    * 通过 get() 方法从 Chrome 存储中获取数据并初始化 cache。
//
// 3. 数据更新与订阅机制：
//
//    * 提供了 set() 方法来设置存储中的数据，支持直接设置值或通过更新函数进行修改。
//    * 提供 subscribe() 方法来监听存储数据的变化，当数据变化时会通知所有订阅者。
//
// 4. 动态更新数据：
//
//    * 支持 liveUpdate，即实时监听存储数据的变化，当数据在其他地方更新时，自动更新本地缓存。
//    * 使用 chrome.storage.onChanged 事件来监听存储区域的变化。
//
// 5. 数据序列化与反序列化：
//
//    * 提供了序列化与反序列化函数，确保存储数据以正确的格式存储和读取。
//
// 6. 全局 Session 存储访问：
//
//    * 通过 setAccessLevel 方法设置全局 Session 存储的访问权限，使得内容脚本能够访问特定的存储区域。

/**
 * Chrome reference error while running `processTailwindFeatures` in tailwindcss.
 *  To avoid this, we need to check if the globalThis.chrome is available and add fallback logic.
 */
const chrome = globalThis.chrome;

/**
 * Sets or updates an arbitrary cache with a new value or the result of an update function.
 * 用于更新缓存的值。根据传入的值类型（是值还是更新函数）来决定是直接设置值还是通过函数更新缓存。它还处理了是否更新为 Promise 类型的逻辑。
 * 更新缓存数据。支持两种方式：直接设置值或使用更新函数。
 */
async function updateCache<D>(valueOrUpdate: ValueOrUpdate<D>, cache: D | null): Promise<D> {
  // Type guard to check if our value or update is a function
  // isFunction 用于判断 valueOrUpdate 是否为函数
  function isFunction<D>(value: ValueOrUpdate<D>): value is (prev: D) => D | Promise<D> {
    return typeof value === 'function';
  }

  // Type guard to check in case of a function, if its a Promise
  // returnsPromise 用于判断更新函数是否返回 Promise
  function returnsPromise<D>(func: (prev: D) => D | Promise<D>): func is (prev: D) => Promise<D> {
    // Use ReturnType to infer the return type of the function and check if it's a Promise
    return (func as (prev: D) => Promise<D>) instanceof Promise;
  }

  if (isFunction(valueOrUpdate)) {
    // Check if the function returns a Promise
    if (returnsPromise(valueOrUpdate)) {
      return valueOrUpdate(cache as D);
    } else {
      return valueOrUpdate(cache as D); // 调用更新函数
    }
  } else {
    return valueOrUpdate;
  }
}

/**
 * If one session storage needs access from content scripts, we need to enable it globally.
 * @default false
 */
let globalSessionAccessLevelFlag: StorageConfig['sessionAccessForContentScripts'] = false;

/**
 * Checks if the storage permission is granted in the manifest.json.
 * 用于检查扩展是否具有指定存储区域的权限。如果没有该存储区域的权限，抛出一个错误
 */
function checkStoragePermission(storageEnum: StorageEnum): void {
  if (!chrome) {
    return;
  }

  // 如果没有权限，则抛出错误
  if (chrome.storage[storageEnum] === undefined) {
    throw new Error(`Check your storage permission in manifest.json: ${storageEnum} is not defined`);
  }
}

/**
 * 创建一个新的存储区域，支持本地存储、同步存储、会话存储等不同类型的存储方式，并允许从存储中获取数据、设置数据和订阅数据变化
 * @param key 用于标识存储的键
 * @param fallback 默认值，用于在存储为空时提供
 * @param config 存储配置，可以包括存储类型（如 local、sync）、数据序列化/反序列化方法等。
 */
export function createStorage<D = string>(key: string, fallback: D, config?: StorageConfig<D>): BaseStorage<D> {
  let cache: D | null = null; // 使用 cache 来存储从 Chrome 存储加载的数据，避免每次读取时都进行网络请求
  let initedCache = false; // 是否初始化缓存
  let listeners: Array<() => void> = []; // 监听器

  // 通过配置对象来获取存储类型、实时更新选项、序列化和反序列化函数。若配置未提供，则使用默认值
  // 根据 config 提供的 storageEnum，可以选择不同的存储类型，如 localStorage、syncStorage、sessionStorage 等
  const storageEnum = config?.storageEnum ?? StorageEnum.Local;
  const liveUpdate = config?.liveUpdate ?? false; // 通过 `liveUpdate` 标志来实现数据的实时更新

  const serialize = config?.serialization?.serialize ?? ((v: D) => v); // 默认系列化函数
  const deserialize = config?.serialization?.deserialize ?? (v => v as D); // 默认反系列化函数

  // Set global session storage access level for StoryType.Session, only when not already done but needed.
  // 如果存储类型是 Session 并且需要内容脚本访问，则会检查存储权限并设置相应的访问级别
  if (
    globalSessionAccessLevelFlag === false &&
    storageEnum === StorageEnum.Session &&
    config?.sessionAccessForContentScripts === true
  ) {
    checkStoragePermission(storageEnum);
    chrome?.storage[storageEnum]
      .setAccessLevel({
        accessLevel: SessionAccessLevelEnum.ExtensionPagesAndContentScripts,
      })
      .catch(error => {
        console.warn(error);
        console.warn('Please call setAccessLevel into different context, like a background script.');
      });
    globalSessionAccessLevelFlag = true;
  }

  // Register life cycle methods
  // get 方法从存储中获取数据，若数据不存在，则返回默认的 fallback 值
  // 通过 get() 方法从 Chrome 存储中获取数据并初始化 cache
  const get = async (): Promise<D> => {
    checkStoragePermission(storageEnum);
    // 在对象中，[key] 允许通过变量动态地访问属性，而不是使用静态的点操作符（.）
    const value = await chrome?.storage[storageEnum].get([key]);

    if (!value) {
      // 从 Chrome 存储中获取数据。如果数据为空，则返回提供的 fallback 默认值
      return fallback;
    }

    return deserialize(value[key]) ?? fallback;
  };

  // 通知所有订阅者，即调用 listeners 数组中存储的所有监听函数
  const _emitChange = () => {
    listeners.forEach(listener => listener());
  };

  // set 方法更新存储中的数据，支持直接设置值或传入一个更新函数来基于当前值更新
  const set = async (valueOrUpdate: ValueOrUpdate<D>) => {
    if (!initedCache) {
      cache = await get();
    }
    cache = await updateCache(valueOrUpdate, cache);

    await chrome?.storage[storageEnum].set({ [key]: serialize(cache) });

    _emitChange();
  };

  // 允许其他组件订阅存储变化。当数据发生变化时，会通知所有订阅者
  const subscribe = (listener: () => void) => {
    listeners = [...listeners, listener];

    // 返回的取消订阅函数会从 listeners 中移除特定的 listener
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  // 返回当前缓存的数据，该数据没有反系列化
  const getSnapshot = () => {
    return cache;
  };

  get().then(data => {
    cache = data;
    initedCache = true;
    _emitChange();
  });

  // Listener for live updates from the browser
  // 如果启用了 liveUpdate，监听 Chrome 存储区域的变化，并在数据发生变化时更新缓存
  async function _updateFromStorageOnChanged(changes: { [key: string]: chrome.storage.StorageChange }) {
    // Check if the key we are listening for is in the changes object
    if (changes[key] === undefined) return;

    const valueOrUpdate: ValueOrUpdate<D> = deserialize(changes[key].newValue);

    if (cache === valueOrUpdate) return; // 如果缓存和更新值一样，则不处理

    cache = await updateCache(valueOrUpdate, cache); // 更新缓存

    _emitChange();
  }

  // Register listener for live updates for our storage area
  // 如果启用了 liveUpdate，函数会监听存储区域的变化（通过 chrome.storage.onChanged），并在存储发生变化时自动更新本地缓存。
  // 这样可以确保在扩展程序的不同部分（如后台脚本、内容脚本或弹出页）中对数据的修改能够保持同步。
  if (liveUpdate) {
    chrome?.storage[storageEnum].onChanged.addListener(_updateFromStorageOnChanged);
  }

  return {
    get,
    set,
    getSnapshot,
    subscribe,
  };
}
