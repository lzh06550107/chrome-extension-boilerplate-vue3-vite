# 共享包（Shared Package）

该包包含可与其他包共享的代码。  
如果需要在项目中使用该包中的代码，需要在 `package.json` 文件中添加以下内容：

```json
{
  "dependencies": {
    "@extension/shared": "workspace:*"
  }
}
```