export const LOCAL_RELOAD_SOCKET_PORT = 8081;
export const LOCAL_RELOAD_SOCKET_URL = `ws://localhost:${LOCAL_RELOAD_SOCKET_PORT}`;

// DO_UPDATE 和 DONE_UPDATE 是消息类型常量，分别表示更新请求和更新完成的消息
export const DO_UPDATE = 'do_update';
export const DONE_UPDATE = 'done_update';
export const BUILD_COMPLETE = 'build_complete';
