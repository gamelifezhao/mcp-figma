#!/usr/bin/env node

import { spawn } from 'child_process';
import { randomUUID } from 'crypto';

// 从环境变量获取Figma访问令牌
const figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN || "测试令牌";

// 启动MCP服务
const serverProcess = spawn('node', ['./build/index.js'], {
  env: {
    ...process.env,
    FIGMA_ACCESS_TOKEN: figmaAccessToken
  },
  stdio: ['pipe', 'pipe', 'pipe']
});

// 输出服务器的标准错误
serverProcess.stderr.on('data', (data) => {
  console.log(`服务器日志: ${data}`);
});

// 输出服务器的标准输出
serverProcess.stdout.on('data', (data) => {
  console.log(`服务器输出: ${data}`);
  try {
    const message = JSON.parse(data.toString());
    console.log('解析的消息:', JSON.stringify(message, null, 2));
    
    // 如果收到初始化响应，发送listTools请求
    if (message.id && message.result && message.result.serverInfo) {
      console.log('收到初始化响应，发送listTools请求');
      sendListToolsRequest();
    }
  } catch (e) {
    console.log('无法解析JSON:', e.message);
  }
});

// 发送初始化请求
setTimeout(() => {
  const initRequest = {
    jsonrpc: '2.0',
    id: randomUUID(),
    method: 'initialize',
    params: {
      clientInfo: {
        name: "test-client",
        version: "1.0.0"
      },
      protocolVersion: "0.6.0",
      capabilities: {
        resources: {},
        tools: {},
        prompts: {}
      }
    }
  };
  
  console.log('发送初始化请求:', JSON.stringify(initRequest, null, 2));
  serverProcess.stdin.write(JSON.stringify(initRequest) + '\n');
}, 1000);

// 发送listTools请求
function sendListToolsRequest() {
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: randomUUID(),
    method: 'mcp.tools.list',
    params: {}
  };
  
  console.log('发送listTools请求:', JSON.stringify(listToolsRequest, null, 2));
  serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // 尝试其他可能的方法名称
  setTimeout(() => {
    const altRequest1 = {
      jsonrpc: '2.0',
      id: randomUUID(),
      method: 'tools.list',
      params: {}
    };
    console.log('尝试替代方法1:', JSON.stringify(altRequest1, null, 2));
    serverProcess.stdin.write(JSON.stringify(altRequest1) + '\n');
  }, 1000);
  
  setTimeout(() => {
    const altRequest2 = {
      jsonrpc: '2.0',
      id: randomUUID(),
      method: 'listTools',
      params: {}
    };
    console.log('尝试替代方法2:', JSON.stringify(altRequest2, null, 2));
    serverProcess.stdin.write(JSON.stringify(altRequest2) + '\n');
  }, 2000);
}

// 15秒后关闭
setTimeout(() => {
  console.log('测试完成，关闭服务...');
  serverProcess.kill();
  process.exit(0);
}, 15000);
