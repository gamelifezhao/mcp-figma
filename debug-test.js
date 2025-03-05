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
  } catch (e) {
    console.log('无法解析JSON:', e.message);
  }
});

// 发送一个简单的请求
setTimeout(() => {
  const request = {
    jsonrpc: '2.0',
    id: randomUUID(),
    method: 'mcp.tools.list',
    params: {}
  };
  
  console.log('发送请求:', JSON.stringify(request, null, 2));
  serverProcess.stdin.write(JSON.stringify(request) + '\n');
}, 1000);

// 5秒后关闭
setTimeout(() => {
  console.log('测试完成，关闭服务...');
  serverProcess.kill();
  process.exit(0);
}, 5000);
