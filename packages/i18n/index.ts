// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { t as t_dev_or_prod } from './lib/i18n';
// 导入开发环境的类型定义
// 这里的 t_dev 是开发环境下的 t 函数的类型定义，用于确保后续的类型推断和开发时的代码提示
import type { t as t_dev } from './lib/i18n-dev';

// 将函数类型断言为开发环境的类型
// 将 t_dev_or_prod 转换为 unknown，以绕过直接的类型检查。
// 再将其断言为 typeof t_dev，强制指定其类型为开发环境的 t 函数类型。
// 目的是保证无论是开发环境还是生产环境，t 函数的接口（签名）在代码中始终保持一致，避免出现类型冲突。
export const t = t_dev_or_prod as unknown as typeof t_dev;
