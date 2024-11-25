import initClient from '../initializers/initClient';

// 这段代码的核心功能是通过 WebSocket 通信实现 Chrome 扩展的热重载（Hot Module Reloading, HMR）。
// 在检测到更新时，调用 Chrome 扩展的 chrome.runtime.reload() 方法来重新加载扩展。
function addReload() {
  const reload = () => {
    chrome.runtime.reload();
  };

  initClient({
    // @ts-expect-error That's because of the dynamic code loading
    id: __HMR_ID, // id: __HMR_ID：扩展的唯一标识符，用于区分不同的模块或客户端
    onUpdate: reload, // onUpdate: reload：当接收到更新通知时触发 reload，调用 chrome.runtime.reload() 来重新加载扩展
  });
}

addReload();
