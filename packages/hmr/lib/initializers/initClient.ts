import { DO_UPDATE, DONE_UPDATE, LOCAL_RELOAD_SOCKET_URL } from '../constant';
import MessageInterpreter from '../interpreter';

// 初始化一个 WebSocket 客户端，并在接收到特定类型的消息时执行更新操作。代码中使用了常量、消息解释器，并且依赖于 WebSocket 来进行通信
// initClient 是默认导出的函数，接收一个对象参数，包含：
//
//  id: 客户端标识符，用于与消息中的 id 匹配。
//  onUpdate: 更新回调函数，在接收到更新请求时调用。
export default function initClient({ id, onUpdate }: { id: string; onUpdate: () => void }) {
  // 创建一个新的 WebSocket 连接，连接到 LOCAL_RELOAD_SOCKET_URL
  const ws = new WebSocket(LOCAL_RELOAD_SOCKET_URL);

  // 当 WebSocket 连接成功打开时，设置 onopen 事件处理器。
  ws.onopen = () => {
    // 监听 message 事件，每当接收到消息时，使用 MessageInterpreter.receive 解析消息内容，将 event.data 转换为字符串并传递给消息解释器。
    ws.addEventListener('message', event => {
      const message = MessageInterpreter.receive(String(event.data));

      // 如果消息类型为 DO_UPDATE 且消息中的 id 与传入的 id 匹配，则执行以下操作：
      if (message.type === DO_UPDATE && message.id === id) {
        // 调用传入的 onUpdate 回调，表示更新操作。
        onUpdate();
        // 发送一个 DONE_UPDATE 类型的消息，表示更新已完成。
        ws.send(MessageInterpreter.send({ type: DONE_UPDATE }));
        return;
      }
    });
  };
}
