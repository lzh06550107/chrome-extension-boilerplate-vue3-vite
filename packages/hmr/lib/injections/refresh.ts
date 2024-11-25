import initClient from '../initializers/initClient';

// 这段代码用于实现一个页面刷新的机制，结合 WebSocket 进行热更新处理。代码的主要功能是在收到更新通知时，刷新当前页面，并且会在标签页变为可见时重新加载页面。

function addRefresh() {
  let pendingReload = false;

  // 初始化客户端：通过 initClient 函数来处理 WebSocket 消息的接收，监听更新并触发页面刷新。
  initClient({
    // @ts-expect-error That's because of the dynamic code loading
    id: __HMR_ID, // id: __HMR_ID：客户端的唯一标识符，用于区分不同的客户端。
    // onUpdate：当收到更新消息时执行的回调函数。如果当前标签页是隐藏的（document.hidden 为 true），
    // 则设置 pendingReload 为 true，表示待更新，稍后再执行刷新操作。如果标签页可见，则直接调用 reload() 刷新页面。
    onUpdate: () => {
      // disable reload when tab is hidden
      // 处理标签页隐藏与显示：当标签页隐藏时，暂时不执行刷新操作，直到标签页再次可见时才执行刷新。
      if (document.hidden) {
        pendingReload = true;
        return;
      }
      reload();
    },
  });

  // reload
  // reload 函数用于执行页面刷新操作。在刷新之前，首先将 pendingReload 设置为 false，避免重复刷新
  function reload(): void {
    pendingReload = false;
    window.location.reload();
  }

  // reload when tab is visible
  // reloadWhenTabIsVisible 函数在标签页从隐藏状态变为可见时被触发
  // 它检查标签页是否可见（!document.hidden），如果标签页可见且有待更新（pendingReload 为 true），则调用 reload() 函数刷新页面
  function reloadWhenTabIsVisible(): void {
    !document.hidden && pendingReload && reload();
  }

  // 通过监听 visibilitychange 事件来确保当标签页的可见性发生变化时，能够执行相应的刷新操作
  document.addEventListener('visibilitychange', reloadWhenTabIsVisible);
}

addRefresh();
