// keyof T 提取对象类型 T 的所有键，返回一个联合类型（包含 T 中所有键的字符串字面量）
// T[keyof T] 使用联合键类型对 T 进行索引，从而获取所有可能的值类型。它返回一个联合类型，表示 T 的所有值的类型
export type ValueOf<T> = T[keyof T];
