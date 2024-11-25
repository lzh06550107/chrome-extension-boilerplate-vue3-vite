// 定义了 Manifest 类型，它是 chrome.runtime.ManifestV3 类型的别名。
// chrome.runtime.ManifestV3 是 Chrome 扩展的清单文件（manifest file）版本 3 的类型定义。
// ManifestV3 是 Chrome 扩展程序的配置文件，包含了扩展的元数据、权限、背景脚本、内容脚本等信息。
// 通过这行代码，Manifest 类型可以直接用于扩展开发中的 Manifest 文件
export type Manifest = chrome.runtime.ManifestV3;

// 实现这个接口的类可能会根据传入的环境，调整清单文件的一些细节，确保它能够在目标环境下正确工作
export interface ManifestParserInterface {
  // 该方法用于将 Manifest 转换为字符串
  // 方法接受两个参数：
  //   manifest（类型为 Manifest）：传入的 Manifest 文件对象，表示一个 Chrome 或 Firefox 扩展的清单信息。
  //   env（类型为 'chrome' | 'firefox'）：指定环境，值可以是 'chrome' 或 'firefox'，决定转换的目标平台是 Chrome 还是 Firefox。
  convertManifestToString: (manifest: Manifest, env: 'chrome' | 'firefox') => string;
}
