import fs from 'node:fs';
import path from 'node:path';
import type { PluginOption } from 'vite';
import { WebSocket } from 'ws';
import MessageInterpreter from '../interpreter';
import { BUILD_COMPLETE, LOCAL_RELOAD_SOCKET_URL } from '../constant';
import type { PluginConfig } from '../types';

const injectionsPath = path.resolve(__dirname, '..', '..', '..', 'build', 'injections');

// 分别加载 refresh.js 和 reload.js 文件的内容。这两个文件分别实现刷新和重载逻辑。
const refreshCode = fs.readFileSync(path.resolve(injectionsPath, 'refresh.js'), 'utf-8');
const reloadCode = fs.readFileSync(path.resolve(injectionsPath, 'reload.js'), 'utf-8');

/**
 * 这段代码实现了一个名为 watchRebuildPlugin 的 Vite 插件，旨在实现浏览器扩展的热重载 (HMR, Hot Module Replacement) 或页面刷新功能
 * @param config
 */
export function watchRebuildPlugin(config: PluginConfig): PluginOption {
  // 插件通过 WebSocket 连接到开发服务器，实现通信
  // 在构建完成后，向服务器发送构建完成的消息
  let ws: WebSocket | null = null;

  const id = Math.random().toString(36);
  let reconnectTries = 0;

  // 动态注入 HMR 代码
  // 1. 根据配置动态加载刷新或重载脚本 (refresh.js 和 reload.js)。
  // 2. 将生成的 HMR 代码注入到构建的模块中。
  const { refresh, reload } = config;
  // 如果 refresh 为 true，加载刷新逻辑。如果 reload 为 true，加载重载逻辑。
  const hmrCode = (refresh ? refreshCode : '') + (reload ? reloadCode : '');

  function initializeWebSocket() {
    ws = new WebSocket(LOCAL_RELOAD_SOCKET_URL);

    ws.onopen = () => {
      console.log(`[HMR] Connected to dev-server at ${LOCAL_RELOAD_SOCKET_URL}`);
    };

    ws.onerror = () => {
      console.error(`[HMR] Failed to connect server at ${LOCAL_RELOAD_SOCKET_URL}`);
      console.warn('Retrying in 3 seconds...');
      ws = null;

      // 如果 WebSocket 连接失败，会尝试最多 3 次重新连接
      if (reconnectTries <= 2) {
        setTimeout(() => {
          reconnectTries++;
          initializeWebSocket();
        }, 3_000);
      } else {
        console.error(`[HMR] Cannot establish connection to server at ${LOCAL_RELOAD_SOCKET_URL}`);
      }
    };
  }

  return {
    name: 'watch-rebuild',
    writeBundle() {
      // 构建完成时触发，发送 BUILD_COMPLETE 消息，通知服务器刷新或重载
      config.onStart?.();
      if (!ws) {
        initializeWebSocket();
        return;
      }
      /**
       * When the build is complete, send a message to the reload server.
       * The reload server will send a message to the client to reload or refresh the extension.
       */
      ws.send(MessageInterpreter.send({ type: BUILD_COMPLETE, id }));
    },
    generateBundle(_options, bundle) {
      // 为每个模块添加一个自执行函数，将 HMR 代码注入
      for (const module of Object.values(bundle)) {
        if (module.type === 'chunk') {
          module.code = `(function() {let __HMR_ID = "${id}";\n` + hmrCode + '\n' + '})();' + '\n' + module.code;
        }
      }
    },
  };
}
