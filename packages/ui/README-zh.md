# UI Package

此软件包提供用于构建用户界面的组件。

## 安装

首先，切换到需要使用此包的页面目录。

```shell
cd pages/options
```

在 `package.json` 的 `dependencies` 中添加以下内容：

```json
{
  "dependencies": {
    "@extension/ui": "workspace:*"
  }
}
```

然后运行以下命令安装依赖：

```shell
pnpm install
```

在 `tailwind.config.ts` 文件中添加以下内容：

```ts
import baseConfig from '@extension/tailwindcss-config';
import { withUI } from '@extension/ui';

export default withUI({
  ...baseConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
});
```

在 `index.tsx` 文件中添加以下内容：

```tsx
import '@extension/ui/dist/global.css';
```

## 添加组件

在 `lib/components/index.ts` 文件中添加以下内容：

```tsx
export * from './Button';
```

在 `lib/components/Button.tsx` 文件中添加以下内容：

```tsx
import { ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils';

export type ButtonProps = {
  theme?: 'light' | 'dark';
} & ComponentPropsWithoutRef<'button'>;

export function Button({ theme, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        className,
        'mt-4 py-1 px-4 rounded shadow hover:scale-105',
        theme === 'light' ? 'bg-white text-black' : 'bg-black text-white',
      )}
      {...props}>
      {children}
    </button>
  );
}
```

## 使用示例

```tsx
import { Button } from '@extension/ui';

export default function ToggleButton() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button theme={theme} onClick={toggle}>
      Toggle
    </Button>
  );
}
```

## 修改 UI 库的 Tailwind 配置

可以通过修改 `tailwind.config.ts` 文件对此包的全局样式进行更改。

## 修改 UI 库的 CSS 变量

可以通过编辑 `ui/lib/global.css` 文件中的 CSS 变量来调整包的样式。

## 为 UI 包添加 shadcn 指南

可以参考此[手动指南](https://ui.shadcn.com/docs/installation/manual)。

### 1. 在 `packages/ui` 目录中创建 `components.json`

在 `packages/ui` 目录下创建一个名为 `components.json` 的文件，并填入以下内容：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "lib/global.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/lib/components",
    "utils": "@/lib/utils",
    "ui": "@/lib/components/ui",
    "lib": "@/lib"
  }
}
```

### 2. 安装依赖

在项目根目录下运行以下命令：

```shell
pnpm add tailwindcss-animate class-variance-authority -F ui
```

### 3. 编辑 `lib` 文件夹中的 `withUI.ts`

该文件基于手动指南配置。你可以参考指南中的[配置文件](https://ui.shadcn.com/docs/installation/manual)进行修改。

```ts
import deepmerge from 'deepmerge';
import type { Config } from 'tailwindcss/types/config';
import { fontFamily } from 'tailwindcss/defaultTheme';
import tailwindAnimate from 'tailwindcss-animate';

export function withUI(tailwindConfig: Config): Config {
  return deepmerge(
    shadcnConfig,
    deepmerge(tailwindConfig, {
      content: ['./node_modules/@extension/ui/lib/**/*.{tsx,ts,js,jsx}'],
    }),
  );
}

const shadcnConfig = {
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // 配置样式
    },
  },
  plugins: [tailwindAnimate],
};
```

### 4. 编辑 `lib` 文件夹中的 `global.css`

该文件基于手动指南中的样式配置。你可以参考[样式指南](https://ui.shadcn.com/docs/installation/manual)进行修改。

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
    /* 其他变量定义 */
  }

  .dark {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
    /* 其他变量定义 */
  }
}

@layer base {
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### 5. 添加 shadcn 组件

运行以下命令，将 shadcn 的 Button 组件添加到 UI 包中：

```shell
pnpm dlx shadcn@latest add button -c ./packages/ui
```

### 6. 导出组件

在 `components/ui` 目录下的 `index.ts` 文件中导出 Button 组件：

```ts
export * from './button';
```

在 `packages/ui` 目录下的 `index.ts` 文件中导出 shadcn 的 UI 组件：

```ts
export * from './lib/components/ui';
```

如果项目结构与本文不同，请根据实际情况调整路径或包名。