# 说明

## base 配置
```json5
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Base", // 配置文件的显示名称，方便团队或工具标识这个配置的用途
  "compilerOptions": {
    "allowJs": true, // 允许 TypeScript 项目中包含 .js 文件
    "noEmit": true, // 禁止生成编译输出文件（仅进行类型检查）
    "module": "esnext", // 指定模块格式为 ESNext（即使用 ES 模块语法）
    "downlevelIteration": true, // 启用对 for...of 循环和展开运算符的降级支持，适合旧版本的 JavaScript
    "isolatedModules": true, // 每个文件作为独立的模块，适用于 esbuild 或 Babel
    "strict": true, // 开启严格模式，包含以下几个严格检查选项
    "noImplicitAny": true, // 禁止隐式 any 类型，需要明确指定类型
    "strictNullChecks": true, // 不允许变量为 null 或 undefined，除非显式声明
    "moduleResolution": "node", // 模块解析策略为 Node.js 风格
    "allowSyntheticDefaultImports": true, // 允许从没有默认导出的模块中导入默认值（如 CommonJS 模块）
    "esModuleInterop": true, // 兼容 CommonJS 和 ES 模块的导入方式
    "skipLibCheck": true, // 跳过 .d.ts 文件的类型检查，能提升编译速度
    "forceConsistentCasingInFileNames": true, // 强制文件名区分大小写，避免跨平台问题
    "resolveJsonModule": true, // 支持导入 JSON 文件作为模块
    "noImplicitReturns": true, // 函数的每个分支必须显式返回值
    "jsx": "preserve", // 保留 JSX，适用于前端框架（如 React 或 Vue 3）
    // 声明支持的库：
    // DOM：支持浏览器 API（如 document、window）。
    // ESNext：支持最新的 ECMAScript 特性
    "lib": ["DOM", "ESNext"]
  }
}
```

## app 配置

```json5
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Chrome Extension App",
  "extends": "./base.json"
}
```

## utils 配置

```json5
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Chrome Extension Utils",
  "extends": "./base.json", // 继承自 base.json 文件中的配置。当前配置文件会覆盖或补充基础配置中的内容
  "compilerOptions": {
    "noEmit": false, // 禁止生成输出文件
    "declaration": true, // 是否生成 .d.ts 类型声明文件
    "module": "CommonJS", // 指定生成的模块代码格式:CommonJS：适用于 Node.js 环境，使用 require 和 module.exports;ESNext：适用于现代浏览器或支持 ES 模块的环境
    "moduleResolution": "Node", // 指定模块解析策略
    "target": "ES6", // 指定编译后的 JavaScript 目标版本
    "types": ["node"] // 指定包含的全局类型声明文件
  }
}
```

