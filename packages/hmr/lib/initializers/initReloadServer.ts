import type { WebSocket } from 'ws';
import { WebSocketServer } from 'ws';
import { BUILD_COMPLETE, DO_UPDATE, DONE_UPDATE, LOCAL_RELOAD_SOCKET_PORT, LOCAL_RELOAD_SOCKET_URL } from '../constant';
import MessageInterpreter from '../interpreter';

const clientsThatNeedToUpdate: Set<WebSocket> = new Set();

// 这段代码实现了一个 WebSocket 服务器，用于处理客户端的热更新（HMR）。
// 它使用 ws 库来创建 WebSocket 服务器，监听客户端的连接、消息和关闭事件，并根据不同的消息类型执行相应的操作。
function initReloadServer() {
  // 建立 WebSocket 服务器：创建一个 WebSocket 服务器，监听客户端连接
  const wss = new WebSocketServer({ port: LOCAL_RELOAD_SOCKET_PORT });

  wss.on('listening', () => {
    console.log(`[HMR] Server listening at ${LOCAL_RELOAD_SOCKET_URL}`);
  });

  // 维护客户端连接：将所有需要更新的客户端 WebSocket 存储在 clientsThatNeedToUpdate 集合中
  wss.on('connection', ws => {
    // 每当有客户端连接到服务器时，connection 事件被触发。客户端的 WebSocket 连接被添加到 clientsThatNeedToUpdate 集合中，表示该客户端需要更新
    clientsThatNeedToUpdate.add(ws);

    // 如果连接关闭（close 事件），则将该连接从 clientsThatNeedToUpdate 集合中移除
    ws.addEventListener('close', () => {
      clientsThatNeedToUpdate.delete(ws);
    });

    // 处理不同类型的消息：根据消息类型（BUILD_COMPLETE 和 DONE_UPDATE）决定是否通知客户端进行更新
    // 每当接收到消息时（message 事件），会解析消息并检查其类型
    ws.addEventListener('message', event => {
      if (typeof event.data !== 'string') return;

      const message = MessageInterpreter.receive(event.data);

      // DONE_UPDATE 类型消息：表示客户端已经完成了更新。此时关闭该 WebSocket 连接
      if (message.type === DONE_UPDATE) {
        ws.close();
      }

      // BUILD_COMPLETE 类型消息：表示构建已经完成。对于所有需要更新的客户端，发送 DO_UPDATE 消息，并将消息的 id 设置为构建的标识符
      if (message.type === BUILD_COMPLETE) {
        clientsThatNeedToUpdate.forEach((ws: WebSocket) =>
          ws.send(MessageInterpreter.send({ type: DO_UPDATE, id: message.id })),
        );
      }
    });
  });

  wss.on('error', error => {
    console.error(`[HMR] Failed to start server at ${LOCAL_RELOAD_SOCKET_URL}`);
    throw error;
  });
}

initReloadServer();
