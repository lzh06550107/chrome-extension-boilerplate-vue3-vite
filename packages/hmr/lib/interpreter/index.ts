import type { SerializedMessage, WebSocketMessage } from '../types';

// MessageInterpreter 负责对 WebSocket 消息的解析和发送
export default class MessageInterpreter {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  // send：将消息对象转换为字符串，准备发送回服务器
  static send(message: WebSocketMessage): SerializedMessage {
    return JSON.stringify(message);
  }

  // receive：将接收到的消息数据转换为对应的消息对象
  static receive(serializedMessage: SerializedMessage): WebSocketMessage {
    return JSON.parse(serializedMessage);
  }
}
