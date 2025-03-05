#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as Figma from "figma-api";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  InitializeRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
// 导入Figma工具的Schema定义
import {
  ReadFigmaUserInfoRequestSchema,
  GetFigmaFileInfoRequestSchema,
  GetFigmaComponentsRequestSchema,
  GetFigmaCommentsRequestSchema,
  CreateFigmaCommentRequestSchema,
  GetFigmaStylesRequestSchema,
  GetFigmaVersionsRequestSchema
} from "./schema.js";
import { z } from "zod";

// 自定义请求Schema，用于支持多种方法名称
const CustomListToolsRequestSchema = z.object({
  method: z.literal("mcp.tools.list"),
  params: z.object({}).optional()
});

const CustomListToolsRequestSchema2 = z.object({
  method: z.literal("tools.list"),
  params: z.object({}).optional()
});

const CustomListToolsRequestSchema3 = z.object({
  method: z.literal("listTools"),
  params: z.object({}).optional()
});

// 自定义工具调用Schema，用于支持多种方法名称
const CustomCallToolRequestSchema = z.object({
  method: z.literal("mcp.tools.invoke"),
  params: z.object({
    name: z.string(),
    arguments: z.record(z.any()).optional()
  })
});

// 定义Figma API响应类型
interface Team {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

// 定义参数类型
type ReadFigmaUserInfoArgs = z.infer<typeof ReadFigmaUserInfoRequestSchema>;
type GetFigmaFileInfoArgs = z.infer<typeof GetFigmaFileInfoRequestSchema>;
type GetFigmaComponentsArgs = z.infer<typeof GetFigmaComponentsRequestSchema>;
type GetFigmaCommentsArgs = z.infer<typeof GetFigmaCommentsRequestSchema>;
type CreateFigmaCommentArgs = z.infer<typeof CreateFigmaCommentRequestSchema>;
type GetFigmaStylesArgs = z.infer<typeof GetFigmaStylesRequestSchema>;
type GetFigmaVersionsArgs = z.infer<typeof GetFigmaVersionsRequestSchema>;

// 获取环境变量中的Figma访问令牌
const figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN;
if (!figmaAccessToken) {
  throw new Error("FIGMA_ACCESS_TOKEN is not set");
}

// 创建默认的Figma API客户端
const defaultApi = new Figma.Api({
  personalAccessToken: figmaAccessToken
});

// 创建Figma API客户端函数 - 如果提供了token则使用提供的token，否则使用默认客户端
function createFigmaClient() {
  if (figmaAccessToken) {
    return new Figma.Api({
      personalAccessToken: figmaAccessToken
    });
  }
  return defaultApi;
}

const server = new Server(
  {
    name: "figma-mcp-service",
    version: "0.1.0",
    description: "Figma MCP服务",
    homepage: "https://github.com/yourusername/mcp-figma",
    repository: "https://github.com/yourusername/mcp-figma"
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * 列出所有可用工具
 * 返回Figma相关工具列表
 */
server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  console.error("处理ListToolsRequestSchema请求:", JSON.stringify(request));
  return {
    tools: [
      {
        name: "读取figma用户信息",
        description: "读取当前figma用户信息",
        inputSchema: ReadFigmaUserInfoRequestSchema
      },
      {
        name: "获取figma文件信息",
        description: "获取特定Figma文件的详细信息",
        inputSchema: GetFigmaFileInfoRequestSchema
      },
      {
        name: "获取figma组件",
        description: "获取Figma文件中的组件列表",
        inputSchema: GetFigmaComponentsRequestSchema
      },
      {
        name: "获取figma注释",
        description: "获取Figma文件中的所有注释",
        inputSchema: GetFigmaCommentsRequestSchema
      },
      {
        name: "创建figma注释",
        description: "在Figma文件中添加新注释",
        inputSchema: CreateFigmaCommentRequestSchema
      },
      {
        name: "获取figma样式",
        description: "获取Figma文件中的样式定义",
        inputSchema: GetFigmaStylesRequestSchema
      },
      {
        name: "获取figma版本历史",
        description: "获取Figma文件的版本历史记录",
        inputSchema: GetFigmaVersionsRequestSchema
      }
    ]
  };
});

// 为其他可能的方法名称添加处理程序
server.setRequestHandler(CustomListToolsRequestSchema, async (request) => {
  console.error("处理CustomListToolsRequestSchema请求:", JSON.stringify(request));
  return {
    tools: [
      {
        name: "读取figma用户信息",
        description: "读取当前figma用户信息",
        inputSchema: ReadFigmaUserInfoRequestSchema
      },
      {
        name: "获取figma文件信息",
        description: "获取特定Figma文件的详细信息",
        inputSchema: GetFigmaFileInfoRequestSchema
      },
      {
        name: "获取figma组件",
        description: "获取Figma文件中的组件列表",
        inputSchema: GetFigmaComponentsRequestSchema
      },
      {
        name: "获取figma注释",
        description: "获取Figma文件中的所有注释",
        inputSchema: GetFigmaCommentsRequestSchema
      },
      {
        name: "创建figma注释",
        description: "在Figma文件中添加新注释",
        inputSchema: CreateFigmaCommentRequestSchema
      },
      {
        name: "获取figma样式",
        description: "获取Figma文件中的样式定义",
        inputSchema: GetFigmaStylesRequestSchema
      },
      {
        name: "获取figma版本历史",
        description: "获取Figma文件的版本历史记录",
        inputSchema: GetFigmaVersionsRequestSchema
      }
    ]
  };
});

server.setRequestHandler(CustomListToolsRequestSchema2, async (request) => {
  console.error("处理CustomListToolsRequestSchema2请求:", JSON.stringify(request));
  return {
    tools: [
      {
        name: "读取figma用户信息",
        description: "读取当前figma用户信息",
        inputSchema: ReadFigmaUserInfoRequestSchema
      },
      {
        name: "获取figma文件信息",
        description: "获取特定Figma文件的详细信息",
        inputSchema: GetFigmaFileInfoRequestSchema
      },
      {
        name: "获取figma组件",
        description: "获取Figma文件中的组件列表",
        inputSchema: GetFigmaComponentsRequestSchema
      },
      {
        name: "获取figma注释",
        description: "获取Figma文件中的所有注释",
        inputSchema: GetFigmaCommentsRequestSchema
      },
      {
        name: "创建figma注释",
        description: "在Figma文件中添加新注释",
        inputSchema: CreateFigmaCommentRequestSchema
      },
      {
        name: "获取figma样式",
        description: "获取Figma文件中的样式定义",
        inputSchema: GetFigmaStylesRequestSchema
      },
      {
        name: "获取figma版本历史",
        description: "获取Figma文件的版本历史记录",
        inputSchema: GetFigmaVersionsRequestSchema
      }
    ]
  };
});

server.setRequestHandler(CustomListToolsRequestSchema3, async (request) => {
  console.error("处理CustomListToolsRequestSchema3请求:", JSON.stringify(request));
  return {
    tools: [
      {
        name: "读取figma用户信息",
        description: "读取当前figma用户信息",
        inputSchema: ReadFigmaUserInfoRequestSchema
      },
      {
        name: "获取figma文件信息",
        description: "获取特定Figma文件的详细信息",
        inputSchema: GetFigmaFileInfoRequestSchema
      },
      {
        name: "获取figma组件",
        description: "获取Figma文件中的组件列表",
        inputSchema: GetFigmaComponentsRequestSchema
      },
      {
        name: "获取figma注释",
        description: "获取Figma文件中的所有注释",
        inputSchema: GetFigmaCommentsRequestSchema
      },
      {
        name: "创建figma注释",
        description: "在Figma文件中添加新注释",
        inputSchema: CreateFigmaCommentRequestSchema
      },
      {
        name: "获取figma样式",
        description: "获取Figma文件中的样式定义",
        inputSchema: GetFigmaStylesRequestSchema
      },
      {
        name: "获取figma版本历史",
        description: "获取Figma文件的版本历史记录",
        inputSchema: GetFigmaVersionsRequestSchema
      }
    ]
  };
});

/**
 * 处理工具调用请求
 * 根据工具名称分发到对应的处理函数
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "读取figma用户信息":
        return await handleReadFigmaUserInfo(args as ReadFigmaUserInfoArgs);
      case "获取figma文件信息":
        return await handleGetFigmaFileInfo(args as GetFigmaFileInfoArgs);
      case "获取figma组件":
        return await handleGetFigmaComponents(args as GetFigmaComponentsArgs);
      case "获取figma注释":
        return await handleGetFigmaComments(args as GetFigmaCommentsArgs);
      case "创建figma注释":
        return await handleCreateFigmaComment(args as CreateFigmaCommentArgs);
      case "获取figma样式":
        return await handleGetFigmaStyles(args as GetFigmaStylesArgs);
      case "获取figma版本历史":
        return await handleGetFigmaVersions(args as GetFigmaVersionsArgs);
      default:
        throw new Error(`未知工具: ${name}`);
    }
  } catch (error) {
    console.error(`工具 ${name} 执行失败:`, error);
    return {
      content: [{
        type: "text",
        text: `执行失败: ${(error as Error).message}`
      }]
    };
  }
});

server.setRequestHandler(CustomCallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "读取figma用户信息":
        return await handleReadFigmaUserInfo(args as ReadFigmaUserInfoArgs);
      case "获取figma文件信息":
        return await handleGetFigmaFileInfo(args as GetFigmaFileInfoArgs);
      case "获取figma组件":
        return await handleGetFigmaComponents(args as GetFigmaComponentsArgs);
      case "获取figma注释":
        return await handleGetFigmaComments(args as GetFigmaCommentsArgs);
      case "创建figma注释":
        return await handleCreateFigmaComment(args as CreateFigmaCommentArgs);
      case "获取figma样式":
        return await handleGetFigmaStyles(args as GetFigmaStylesArgs);
      case "获取figma版本历史":
        return await handleGetFigmaVersions(args as GetFigmaVersionsArgs);
      default:
        throw new Error(`未知工具: ${name}`);
    }
  } catch (error) {
    console.error(`工具 ${name} 执行失败:`, error);
    return {
      content: [{
        type: "text",
        text: `执行失败: ${(error as Error).message}`
      }]
    };
  }
});

/**
 * 处理初始化请求
 */
server.setRequestHandler(InitializeRequestSchema, async (request) => {
  console.error("处理初始化请求:", JSON.stringify(request));
  return {
    serverInfo: {
      name: "figma-mcp-service",
      version: "0.1.0",
    },
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    }
  };
});

/**
 * 读取Figma用户信息
 */
async function handleReadFigmaUserInfo(args: ReadFigmaUserInfoArgs) {
  try {
    // 验证参数
    const { userId, includeTeams, includeProjects, includeFiles, fileLimit } = args || {};
    
    // 创建API客户端 - 使用提供的token或默认token
    const api = createFigmaClient();

    // 获取用户信息
    const userResponse = await api.getUserMe();
    
    // 构建响应
    const response: any = {
      id: userResponse.id,
      name: userResponse.handle,
      email: userResponse.email,
      teams: [],
      projects: [],
      files: []

    };

    // 如果需要，添加团队信息
    if (includeTeams && userResponse.teams) {
      response.teams = userResponse.teams.map((team: Team) => ({
        id: team.id,
        name: team.name
      }));
    }

    // 如果需要，添加项目和文件信息
    if (includeProjects && userResponse.teams) {
      response.projects = [];
      
      // 获取每个团队的项目
      for (const team of userResponse.teams) {
        try {
          const projectsResponse = await api.getTeamProjects({
            team_id: team.id
          });
          
          if (projectsResponse.projects) {
            response.projects.push(...projectsResponse.projects.map((project: Project) => ({
              id: project.id,
              name: project.name,
              teamId: team.id
            })));
          }
        } catch (error) {
          console.warn(`获取团队 ${team.id} 的项目失败:`, error);
        }
      }
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify(response, null, 2)
      }]
    };
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return {
      content: [{
        type: "text",
        text: `获取用户信息失败: ${(error as Error).message}`
      }]
    };
  }
}

/**
 * 获取Figma文件信息
 */
async function handleGetFigmaFileInfo(args: GetFigmaFileInfoArgs) {
  try {
    // 验证参数
    const { fileKey, version, depth } = args || {};
    
    if (!fileKey) {
      throw new Error("必须提供fileKey参数");
    }

    // 创建API客户端
    const api = createFigmaClient();

    // 准备查询参数
    const queryParams: any = {};
    if (version) queryParams.version = version;
    if (depth) queryParams.depth = depth;

    // 获取文件信息
    const fileResponse = await api.getFile(fileKey, queryParams);

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          name: fileResponse.name,
          lastModified: fileResponse.lastModified,
          version: fileResponse.version,
          document: fileResponse.document
        }, null, 2)
      }]
    };
  } catch (error) {
    console.error("获取文件信息失败:", error);
    return {
      content: [{
        type: "text",
        text: `获取文件信息失败: ${(error as Error).message}`
      }]
    };
  }
}

/**
 * 获取Figma文件组件
 */
async function handleGetFigmaComponents(args: GetFigmaComponentsArgs) {
  try {
    // 验证参数
    const { fileKey, includeStyles } = args || {};
    
    if (!fileKey) {
      throw new Error("必须提供fileKey参数");
    }

    // 创建API客户端
    const api = createFigmaClient();

    // 获取组件信息
    const componentsResponse = await api.getFileComponents({
      file_key: fileKey
    });
    
    const response: any = {
      components: componentsResponse.meta.components
    };

    // 如果需要，获取样式信息
    if (includeStyles) {
      const stylesResponse = await api.getFileStyles({
        file_key: fileKey
      });
      response.styles = stylesResponse.meta.styles;
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify(response, null, 2)
      }]
    };
  } catch (error) {
    console.error("获取组件失败:", error);
    return {
      content: [{
        type: "text",
        text: `获取组件失败: ${(error as Error).message}`
      }]
    };
  }
}

/**
 * 获取Figma文件注释
 */
async function handleGetFigmaComments(args: GetFigmaCommentsArgs) {
  try {
    // 验证参数
    const { fileKey, pageId } = args || {};
    
    if (!fileKey) {
      throw new Error("必须提供fileKey参数");
    }

    // 创建API客户端
    const api = createFigmaClient();

    // 获取注释信息
    const commentsResponse = await api.getComments({
      file_key: fileKey
    });
    
    // 如果指定了页面ID，过滤注释
    let comments: any = commentsResponse.comments;
    if (pageId) {
      comments = comments.filter((comment: any) => comment.client_meta?.page_id === pageId);
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({ comments }, null, 2)
      }]
    };
  } catch (error) {
    console.error("获取注释失败:", error);
    return {
      content: [{
        type: "text",
        text: `获取注释失败: ${(error as Error).message}`
      }]
    };
  }
}

/**
 * 创建Figma注释
 */
async function handleCreateFigmaComment(args: CreateFigmaCommentArgs) {
  try {
    // 验证参数
    const { fileKey, message, position, nodeId, pageId } = args || {};
    
    if (!fileKey || !message || !position) {
      throw new Error("必须提供fileKey、message和position参数");
    }

    // 创建API客户端
    const api = createFigmaClient();

    // 构建注释数据
    const commentData: any = {
      message,
      client_meta: {
        x: position.x,
        y: position.y
      }
    };

    if (nodeId) commentData.client_meta.node_id = nodeId;
    if (pageId) commentData.client_meta.page_id = pageId;

    // 创建注释
    const commentResponse = await api.postComment({
      file_key: fileKey
    }, commentData);

    return {
      content: [{
        type: "text",
        text: JSON.stringify(commentResponse, null, 2)
      }]
    };
  } catch (error) {
    console.error("创建注释失败:", error);
    return {
      content: [{
        type: "text",
        text: `创建注释失败: ${(error as Error).message}`
      }]
    };
  }
}

/**
 * 获取Figma文件样式
 */
async function handleGetFigmaStyles(args: GetFigmaStylesArgs) {
  try {
    // 验证参数
    const { fileKey, styleTypes } = args || {};
    
    if (!fileKey) {
      throw new Error("必须提供fileKey参数");
    }

    // 创建API客户端
    const api = createFigmaClient();

    // 获取样式信息
    const stylesResponse = await api.getFileStyles({
      file_key: fileKey
    });
    
    // 如果指定了样式类型，过滤样式
    let styles = stylesResponse.meta.styles;
    if (styleTypes && styleTypes.length > 0) {
      styles = styles.filter((style: any) => styleTypes.includes(style.style_type));
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({ styles }, null, 2)
      }]
    };
  } catch (error) {
    console.error("获取样式失败:", error);
    return {
      content: [{
        type: "text",
        text: `获取样式失败: ${(error as Error).message}`
      }]
    };
  }
}

/**
 * 获取Figma文件版本历史
 */
async function handleGetFigmaVersions(args: GetFigmaVersionsArgs) {
  try {
    // 验证参数
    const { fileKey, limit, before } = args || {};
    
    if (!fileKey) {
      throw new Error("必须提供fileKey参数");
    }

    // 创建API客户端
    const api = createFigmaClient();

    // 获取版本信息
    const versionsResponse = await api.getFileVersions({
      file_key: fileKey
    });
    
    // 处理分页和过滤
    let versions = versionsResponse.versions;

    if (before) {
      const beforeIndex = versions.findIndex((v: any) => v.id === before);
      if (beforeIndex !== -1) {
        versions = versions.slice(beforeIndex + 1);
      }
    }

    if (limit && limit > 0) {
      versions = versions.slice(0, limit);
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({ versions }, null, 2)
      }]
    };
  } catch (error) {
    console.error("获取版本历史失败:", error);
    return {
      content: [{
        type: "text",
        text: `获取版本历史失败: ${(error as Error).message}`
      }]
    };
  }
}

/**
 * 启动服务器使用stdio传输
 * 允许服务器通过标准输入/输出流进行通信
 */
async function main() {
  console.error("启动MCP服务...");
  console.error("FIGMA_ACCESS_TOKEN是否设置:", !!process.env.FIGMA_ACCESS_TOKEN);
  
  const transport = new StdioServerTransport(process.stdin, process.stdout);
  console.error("创建StdioServerTransport成功");
  
  try {
    await server.connect(transport);
    console.error("服务器连接成功");
  } catch (error) {
    console.error("服务器连接失败:", error);
  }
}

main().catch((error) => {
  console.error("服务启动失败:", error);
  process.exit(1);
});
