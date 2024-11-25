import type { ManifestParserInterface, Manifest } from './type';

// 这段代码实现了一个 ManifestParserImpl 类，它实现了 ManifestParserInterface 接口中的 convertManifestToString 方法，
// 用于将 Chrome 扩展的 manifest 文件转换为不同浏览器（例如 Firefox）兼容的版本。
export const ManifestParserImpl: ManifestParserInterface = {
  convertManifestToString: (manifest, env) => {
    if (env === 'firefox') {
      manifest = convertToFirefoxCompatibleManifest(manifest);
    }
    // 使用 JSON.stringify 方法将 manifest 对象转换为格式化的字符串，并返回
    return JSON.stringify(manifest, null, 2);
  },
};

/**
 * 主要是将 Chrome 扩展的 manifest 转换为 Firefox 可接受的格式。
 *
 * @param manifest
 */
function convertToFirefoxCompatibleManifest(manifest: Manifest) {
  // 通过 manifestCopy 复制原始的 manifest 对象，避免直接修改原对象
  const manifestCopy = {
    ...manifest,
  } as { [key: string]: unknown };

  // background: Chrome 扩展使用 service_worker 作为背景脚本，但 Firefox 需要将其包装成 scripts 字段，并指定 type: 'module'。
  manifestCopy.background = {
    scripts: [manifest.background?.service_worker],
    type: 'module',
  };
  // options_ui: 在 Firefox 中，options_page 需要转换为 options_ui，并禁用浏览器样式（browser_style: false）
  manifestCopy.options_ui = {
    page: manifest.options_page,
    browser_style: false,
  };
  // content_security_policy: 设置一个适用于 Firefox 的内容安全策略（CSP）
  manifestCopy.content_security_policy = {
    extension_pages: "script-src 'self'; object-src 'self'",
  };
  // browser_specific_settings: 添加了 Firefox 特定的设置，例如 gecko 相关的 id 和 strict_min_version 字段
  manifestCopy.browser_specific_settings = {
    gecko: {
      id: 'example@example.com',
      strict_min_version: '109.0',
    },
  };
  // 删除 options_page: 因为在 Firefox 中使用 options_ui，所以删除了 options_page 字段
  delete manifestCopy.options_page;
  // 最后，返回转换后的 manifestCopy，并确保它符合 Manifest 类型
  return manifestCopy as Manifest;
}
