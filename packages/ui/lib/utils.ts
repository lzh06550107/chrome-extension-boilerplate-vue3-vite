import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 这段代码定义了一个名为 cn 的实用函数，它结合了 clsx 和 tailwind-merge 库来处理类名的组合。
// 这个函数可以简化对条件类名的处理，同时确保类名在应用 Tailwind CSS 时不会发生冲突或重复

// clsx：一个用来条件性地组合类名的小工具。它接收多个参数并返回一个由符合条件的类名组成的字符串。如果一个参数是 false、null 或 undefined，它会被忽略。
// tailwind-merge：这是一个帮助函数，用于合并 Tailwind CSS 类名，确保当存在冲突时，优先级较高的类名会覆盖优先级较低的类名。例如，"text-red-500 text-green-500" 会合并为 "text-green-500"，因为 text-green-500 优先。

/**
 * cn 函数接收多个类名（可以是字符串、对象或数组），然后使用 clsx 组合这些类名。
 * 组合后的类名传递给 twMerge，这个函数会自动处理冲突的 Tailwind CSS 类，确保返回最终的合并结果。
 * @param inputs
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
