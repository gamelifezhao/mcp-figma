#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

// 从环境变量获取Figma访问令牌
const figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN;
if (!figmaAccessToken) {
  console.error("错误: 未设置FIGMA_ACCESS_TOKEN环境变量");
  process.exit(1);
}

async function main() {
  // 启动MCP服务
  const serverProcess = spawn("node", ["./build/index.js"], {
    env: {
      ...process.env,
      FIGMA_ACCESS_TOKEN: figmaAccessToken
    },
    cwd: process.cwd() // 使用当前工作目录
  });

  // 设置错误处理
  serverProcess.stderr.on('data', (data) => {
    console.error(`服务器错误: ${data}`);
  });

  // 创建客户端
  const transport = new StdioClientTransport(serverProcess.stdin, serverProcess.stdout);
  const client = new Client();
  
  await client.connect(transport);

  try {
    // 列出所有工具
    console.log("获取可用工具列表...");
    const toolsResponse = await client.listTools();
    console.log("可用工具:", JSON.stringify(toolsResponse.tools, null, 2));

    // 调用读取figma用户信息工具
    console.log("\n调用读取figma用户信息工具...");
    const userInfoResponse = await client.callTool("读取figma用户信息", {
      includeTeams: true
    });
    console.log("用户信息结果:", userInfoResponse.content[0].text);

    // 可以继续测试其他工具...
  } catch (error) {
    console.error("测试失败:", error);
  } finally {
    // 关闭连接和进程
    await client.disconnect();
    serverProcess.kill();
  }
}

main().catch(error => {
  console.error("测试客户端运行失败:", error);
  process.exit(1);
});
