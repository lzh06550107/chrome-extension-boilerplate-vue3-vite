// 这段代码定义了两个枚举类型：StorageEnum 和 SessionAccessLevelEnum，它们用于管理和配置浏览器扩展中的存储区域和访问权限
/**
 * Storage area type for persisting and exchanging data.
 * @see https://developer.chrome.com/docs/extensions/reference/storage/#overview
 */
export enum StorageEnum {
  /**
   * Persist data locally against browser restarts. Will be deleted by uninstalling the extension.
   * 描述：用于持久化存储数据，数据会在浏览器重启后依然存在，但当用户卸载扩展时会被删除。
   * 默认值：该值是默认的存储类型，适合存储不需要同步的数据，如用户的本地设置或缓存。
   * 应用场景：常用于浏览器扩展的本地存储。
   * @default
   */
  Local = 'local',
  /**
   * Uploads data to the users account in the cloud and syncs to the users browsers on other devices. Limits apply.
   * 描述：将数据同步到用户的 Google 账户，并在其他设备的浏览器中进行同步。同步有一定的限制（例如，存储空间的限制）。
   * 应用场景：适用于需要跨设备同步的扩展数据，例如浏览器扩展中的用户设置或状态。
   */
  Sync = 'sync',
  /**
   * Requires an [enterprise policy](https://www.chromium.org/administrators/configuring-policy-for-extensions) with a
   * json schema for company wide config.
   * 描述：为企业环境设计，需要配置企业策略并使用 JSON 模式进行管理。此存储区域通常用于公司范围的配置数据。
   * 应用场景：适用于公司或组织级的配置存储，需要通过企业的管理工具进行管理。
   */
  Managed = 'managed',
  /**
   * Only persist data until the browser is closed. Recommended for service workers which can shutdown anytime and
   * therefore need to restore their state. Set {@link SessionAccessLevelEnum} for permitting content scripts access.
   * @implements Chromes [Session Storage](https://developer.chrome.com/docs/extensions/reference/storage/#property-session)
   * 描述：只在浏览器会话期间存储数据，浏览器关闭后数据会丢失。推荐用于服务工作者（Service Worker），因为它们可能会在任何时候关闭，因此需要恢复其状态。
   * 应用场景：适用于短期存储需求，如会话数据或临时状态。配合 SessionAccessLevelEnum 使用，可以控制哪些页面和脚本可以访问该存储区域。
   */
  Session = 'session',
}

/**
 * Global access level requirement for the {@link StorageEnum.Session} Storage Area.
 * @implements Chromes [Session Access Level](https://developer.chrome.com/docs/extensions/reference/storage/#method-StorageArea-setAccessLevel)
 * SessionAccessLevelEnum 枚举用于定义 StorageEnum.Session 存储区域的访问级别。
 */
export enum SessionAccessLevelEnum {
  /**
   * Storage can only be accessed by Extension pages (not Content scripts).
   * 描述：此存储区域只能由扩展的页面（如 popup、background 页等）访问，内容脚本（content scripts）无法访问。
   * 默认值：如果不指定，默认是此值，意味着只有扩展的页面能够访问该存储区域。
   * 应用场景：适用于仅限扩展页面使用的存储需求。
   * @default
   */
  ExtensionPagesOnly = 'TRUSTED_CONTEXTS',
  /**
   * Storage can be accessed by both Extension pages and Content scripts.
   * 描述：此存储区域既可以由扩展页面访问，也可以由内容脚本访问。
   * 应用场景：适用于需要让扩展的页面和内容脚本共享数据的场景，例如，扩展需要在网页上下文中操作时共享存储。
   */
  ExtensionPagesAndContentScripts = 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
}
