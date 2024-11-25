import type { StorageEnum } from './enums';

// 这段 TypeScript 代码定义了一些用于存储操作的类型，包括了存储接口 BaseStorage、存储配置 StorageConfig 和一些辅助类型。它们通常用于处理扩展程序的存储管理（例如，在浏览器扩展中管理数据存储）

// 这个类型用于表示存储值的类型，可以是存储的值本身，也可以是一个更新函数。
//
// * D 是存储值的类型。
// * 如果存储的值是一个新的值，可以直接是 D。
// * 如果需要基于之前的值进行更新，则是一个函数，接受当前的值 prev: D，并返回新的值或者一个 Promise。
export type ValueOrUpdate<D> = D | ((prev: D) => Promise<D> | D);

// 定义了一个基础存储接口 BaseStorage，它包括以下方法：
//
// * get：返回一个 Promise，解析为存储的值 D。
// * set：接受一个 ValueOrUpdate<D> 类型的值，并更新存储中的数据。返回一个 Promise，表明操作完成。
// * getSnapshot：获取存储的当前快照，如果没有数据返回 null。
// * subscribe：允许监听存储的变化。返回一个取消订阅的函数，用于移除监听。
export type BaseStorage<D> = {
  get: () => Promise<D>;
  set: (value: ValueOrUpdate<D>) => Promise<void>;
  getSnapshot: () => D | null;
  subscribe: (listener: () => void) => () => void; // 返回函数
};

// 定义存储配置，用于控制存储的行为和选项：
//
// * storageEnum：指定使用的存储类型（例如，LocalStorage 或 SessionStorage），它是一个枚举类型 StorageEnum。
// * sessionAccessForContentScripts：仅对 SessionStorage 有效，控制是否允许内容脚本访问存储。
// * liveUpdate：如果设置为 true，则存储的数据将在多个扩展实例之间保持同步，通常用于 popup、侧边栏等多个视图共享数据。
// * serialization：可选的序列化配置，用于转换存储的数据：
// ** serialize：将存储值转换为字符串以保存。
// ** deserialize：将存储的字符串数据转换回原始值。
export type StorageConfig<D = string> = {
  /**
   * Assign the {@link StorageEnum} to use.
   * @default Local
   */
  storageEnum?: StorageEnum;
  /**
   * Only for {@link StorageEnum.Session}: Grant Content scripts access to storage area?
   * @default false
   */
  sessionAccessForContentScripts?: boolean;
  /**
   * Keeps state live in sync between all instances of the extension. Like between popup, side panel and content scripts.
   * To allow chrome background scripts to stay in sync as well, use {@link StorageEnum.Session} storage area with
   * {@link StorageConfig.sessionAccessForContentScripts} potentially also set to true.
   * @see https://stackoverflow.com/a/75637138/2763239
   * @default false
   */
  liveUpdate?: boolean;
  /**
   * An optional props for converting values from storage and into it.
   * @default undefined
   */
  serialization?: {
    /**
     * convert non-native values to string to be saved in storage
     */
    serialize: (value: D) => string;
    /**
     * convert string value from storage to non-native values
     */
    deserialize: (text: string) => D;
  };
};
