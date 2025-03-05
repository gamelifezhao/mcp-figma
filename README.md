# Figma MCP Service

这是一个基于MCP（Model Context Protocol）的Figma服务，允许AI助手与Figma进行交互。

## 功能

- 读取Figma用户信息
- 获取Figma文件信息
- 获取Figma组件列表
- 获取和创建Figma注释
- 获取Figma样式
- 获取Figma版本历史

## 安装

```bash
npm install
```

## 配置

在运行服务之前，需要设置Figma访问令牌：

```bash
export FIGMA_ACCESS_TOKEN=your_figma_access_token
```

## 构建

```bash
npm run build
```

## 运行

### 直接运行服务

```bash
node build/index.js
```

### 使用MCP Inspector测试

```bash
npx @modelcontextprotocol/inspector build/index.js
```

### 使用测试客户端

```bash
node direct-test.js
```
##
使用 inspector 测试
$env:FIGMA_ACCESS_TOKEN="你的tokens"; npm run inspector


## 配置MCP客户端

在`~/.codeium/windsurf-next/mcp_config.json`中添加以下配置：

```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["path/to/mcp-figma/mcp-service/build/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your_figma_access_token"
      }
    }
  }
}
```

## 许可证

MIT
