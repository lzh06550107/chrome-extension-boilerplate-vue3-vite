# I18n 包

此包提供了一套工具，用于帮助您为 Chrome 扩展进行国际化。

[Chrome 官方 i18n 文档](https://developer.chrome.com/docs/extensions/reference/api/i18n)

---

这段代码实现了一个用于 Chrome 扩展的国际化工具，自动生成类型文件 (lib/type.ts) 和根据语言代码获取翻译数据的工具文件 (lib/getMessageFromLocale.ts)

## 安装

如果您希望在每个页面中使用 i18n 翻译功能，需要在 `package.json` 文件中添加以下内容：

```json
{
  "dependencies": {
    "@extension/i18n": "workspace:*"
  }
}
```

然后运行以下命令安装此包：

```bash
pnpm install
```

---

## 管理翻译内容

您可以在 `locales` 目录中管理翻译内容。

`locales/en/messages.json` 示例：

```json
{
  "helloWorld": {
    "message": "Hello, World!"
  }
}
```

`locales/ko/messages.json` 示例：

```json
{
  "helloWorld": {
    "message": "안녕하세요, 여러분!"
  }
}
```

---

## 删除或添加新语言

如果需要删除或添加新语言，无需手动编辑像 `lib/types.ts` 或 `lib/getMessageFromLocale.ts` 这样的工具文件。  
我们提供了一个脚本，可通过运行 `generate-i18n.mjs` 自动生成工具文件。

按照以下步骤删除或添加新语言：

### 删除语言

如果要删除不需要的语言，可以删除 `locales` 目录中的相应文件夹。

```
locales
├── en
│   └── messages.json
└── ko // 删除此目录
    └── messages.json 
```

然后运行以下命令（或者直接运行根目录下的 `pnpm dev` 或 `pnpm build`）：

```bash
pnpm genenrate-i8n
```

### 添加语言

如果要添加新语言，可以在 `locales` 目录中创建一个新文件夹。

```
locales
├── en
│   └── messages.json
├── ko
│   └── messages.json
└── ja // 创建此目录
    └── messages.json // 并创建此文件
```

同样，运行以下命令（或者直接运行根目录下的 `pnpm dev` 或 `pnpm build`）：

```bash
pnpm genenrate-i8n
```

---

## 使用方法

### 翻译函数

只需引入 `t` 函数并使用它来翻译指定的键值：

```typescript
import { t } from '@extension/i18n';

console.log(t('loading')); // 输出：Loading...
```

```typescript jsx
import { t } from '@extension/i18n';

const Component = () => {
  return (
    <button>
      {t('toggleTheme')} // 输出：Toggle Theme
    </button>
  );
};
```

---

### 占位符

如果需要使用占位符，可以按照以下格式设置：

> 详情请参考 [Chrome 本地化占位符文档](https://developer.chrome.com/docs/extensions/how-to/ui/localization-message-formats#placeholders)

`locales/en/messages.json` 示例：

```json
{
  "greeting": {
    "description": "Greeting message",
    "message": "Hello, My name is $NAME$",
    "placeholders": {
      "name": {
        "content": "$1",
        "example": "John Doe"
      }
    }
  },
  "hello": {
    "description": "Placeholder example",
    "message": "Hello $1"
  }
}
```

`locales/ko/messages.json` 示例：

```json
{
  "greeting": {
    "description": "인사 메시지",
    "message": "안녕하세요, 제 이름은 $NAME$입니다.",
    "placeholders": {
      "name": {
        "content": "$1",
        "example": "서종학"
      }
    }
  },
  "hello": {
    "description": "Placeholder 예시",
    "message": "안녕 $1"
  }
}
```

如果需要替换占位符，可以将值作为第二个参数传入：

`t` 函数的接口与 `chrome.i18n.getMessage` 函数完全一致：

```typescript
import { t } from '@extension/i18n';

console.log(t('greeting', 'John Doe')); // 输出：Hello, My name is John Doe
console.log(t('greeting', ['John Doe'])); // 输出：Hello, My name is John Doe

console.log(t('hello')); // 输出：Hello
console.log(t('hello', 'World')); // 输出：Hello World
console.log(t('hello', ['World'])); // 输出：Hello World
```

---

### 开发环境设置语言

如果希望在开发环境中显示指定语言，可以设置 `devLocale` 属性（仅限开发模式）。

```typescript
import { t } from '@extension/i18n';

t.devLocale = "ko";

console.log(t('hello')); // 输出：안녕
```

---

### 类型安全

如果忘记在所有语言的 `messages.json` 文件中添加某个键值，TypeScript 会报错。

`locales/en/messages.json` 示例：

```json
{
  "hello": {
    "message": "Hello World!"
  }
}
```

`locales/ko/messages.json` 示例：

```json
{
  "helloWorld": {
    "message": "안녕하세요, 여러분!"
  }
}
```

TypeScript 报错示例：

```typescript
import { t } from '@extension/i18n';

// 错误：TS2345：类型 "hello" 不可分配给参数类型。
console.log(t('hello'));
```

---

此 I18n 包提供了强大的国际化工具，支持动态语言切换、占位符替换，并保证了类型安全，非常适合 Chrome 扩展的多语言开发需求。