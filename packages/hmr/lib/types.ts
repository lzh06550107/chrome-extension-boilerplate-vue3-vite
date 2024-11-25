import type { BUILD_COMPLETE, DO_UPDATE, DONE_UPDATE } from './constant';

type UpdateRequestMessage = {
  type: typeof DO_UPDATE;
  id: string;
};

type UpdateCompleteMessage = { type: typeof DONE_UPDATE };
type BuildCompletionMessage = { type: typeof BUILD_COMPLETE; id: string };

export type SerializedMessage = string;

// 这是一个联合类型，表示 WebSocket 消息可以是三种类型之一：
// UpdateCompleteMessage: 更新完成的消息。
// UpdateRequestMessage: 更新请求的消息。
// BuildCompletionMessage: 构建完成的消息。
export type WebSocketMessage = UpdateCompleteMessage | UpdateRequestMessage | BuildCompletionMessage;

// 这个类型表示插件的配置对象，包含：
// onStart: 可选的启动回调函数，当插件启动时调用。
// reload: 可选的布尔值，表示是否需要重新加载插件。
// refresh: 可选的布尔值，表示是否需要刷新插件。
export type PluginConfig = {
  onStart?: () => void;
  reload?: boolean;
  refresh?: boolean;
};
