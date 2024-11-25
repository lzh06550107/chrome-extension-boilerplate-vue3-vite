import type { ValueOf } from '@extension/shared';

// ColorType 是日志类型的联合类型，表示四种预定义的日志类型 ('success', 'info', 'error', 'warning') 和 COLORS 对象的键（keyof typeof COLORS），
// 这意味着 ColorType 还可以是 COLORS 中的任何键，如 'FgGreen'，'FgBlue' 等
type ColorType = 'success' | 'info' | 'error' | 'warning' | keyof typeof COLORS;

/**
 * 定义了一个 colorLog 函数，用于将不同类型的日志信息打印到控制台，并通过 ANSI 转义码为不同的日志类型设置颜色
 * @param message
 * @param type
 */
export function colorLog(message: string, type: ColorType) {
  let color: ValueOf<typeof COLORS>;

  switch (type) {
    case 'success':
      color = COLORS.FgGreen;
      break;
    case 'info':
      color = COLORS.FgBlue;
      break;
    case 'error':
      color = COLORS.FgRed;
      break;
    case 'warning':
      color = COLORS.FgYellow;
      break;
    default:
      color = COLORS[type];
      break;
  }

  console.log(color, message);
}

// COLORS 是一个包含多个 ANSI 转义码的对象，用于设置不同颜色的文本和背景。它使用了 \x1b 字符（ESC 字符）来表示控制台颜色格式。
// Fg 系列表示前景色（文本颜色），Bg 系列表示背景色。
const COLORS = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',
  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
} as const;
