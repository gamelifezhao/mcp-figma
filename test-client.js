#!/usr/bin/env node

import { spawn } from "child_process";
import { randomUUID } from "crypto";

// 从环境变量获取Figma访问令牌
const figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN;
if (!figmaAccessToken) {
  console.error("错误: 未设置FIGMA_ACCESS_TOKEN环境变量");
  process.exit(1);
}

// 启动MCP服务
const serverProcess = spawn("node", ["./build/index.js"], {
  env: {
    ...process.env,
    FIGMA_ACCESS_TOKEN: figmaAccessToken
  },
  stdio: ['pipe', 'pipe', 'pipe']
});

// 设置错误处理
serverProcess.stderr.on('data', (data) => {
  console.error(`服务器日志: ${data}`);
});

// 处理服务器响应
let pendingRequests = new Map();

serverProcess.stdout.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    console.log("收到响应:", JSON.stringify(response, null, 2));
    
    const pendingRequest = pendingRequests.get(response.id);
    if (pendingRequest) {
      if (response.error) {
        pendingRequest.reject(new Error(response.error.message));
      } else {
        pendingRequest.resolve(response.result);
      }
      pendingRequests.delete(response.id);
    }
  } catch (error) {
    console.error("解析响应失败:", error);
  }
});

// 发送请求并返回Promise
function sendRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = randomUUID();
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };
    
    pendingRequests.set(id, { resolve, reject });
    console.log("发送请求:", JSON.stringify(request, null, 2));
    serverProcess.stdin.write(JSON.stringify(request) + '\n');
  });
}

async function main() {
  try {
    // 初始化连接
    console.log("初始化连接...");
    await sendRequest("initialize", {
      clientInfo: {
        name: "figma-mcp-test-client",
        version: "0.1.0"
      },
      protocolVersion: "0.6.0",
      capabilities: {
        resources: {},
        tools: {},
        prompts: {}
      }
    });
    
    // 列出所有工具
    console.log("\n获取可用工具列表...");
    const toolsResponse = await sendRequest("mcp.tools.list");
    console.log("可用工具:", JSON.stringify(toolsResponse.tools, null, 2));
    
    // 调用读取figma用户信息工具
    console.log("\n调用读取figma用户信息工具...");
    const userInfoResponse = await sendRequest("mcp.tools.invoke", {
      name: "读取figma用户信息",
      arguments: {
        includeTeams: true
      }
    });
    
    // 解析并美化输出
    if (userInfoResponse.content && userInfoResponse.content[0] && userInfoResponse.content[0].text) {
      try {
        const userInfo = JSON.parse(userInfoResponse.content[0].text);
        console.log("\n用户信息结果:");
        console.log(`ID: ${userInfo.id}`);
        console.log(`名称: ${userInfo.name}`);
        console.log(`邮箱: ${userInfo.email}`);
        
        if (userInfo.teams && userInfo.teams.length > 0) {
          console.log("\n团队:");
          userInfo.teams.forEach(team => {
            console.log(`  - ${team.name} (${team.id})`);
          });
        } else {
          console.log("\n团队: 无");
        }
      } catch (error) {
        console.log("用户信息结果:", userInfoResponse.content[0].text);
      }
    } else {
      console.log("用户信息结果:", JSON.stringify(userInfoResponse, null, 2));
    }
    
  } catch (error) {
    console.error("测试失败:", error);
  } finally {
    // 关闭进程
    serverProcess.kill();
  }
}

main().catch(error => {
  console.error("测试客户端运行失败:", error);
  serverProcess.kill();
  process.exit(1);
});
