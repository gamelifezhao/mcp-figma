import { z } from "zod";

/**
 * 读取Figma用户信息的请求模式
 * 定义请求参数的结构和验证规则
 */
export const ReadFigmaUserInfoRequestSchema = z.object({
  token: z.string().describe("Figma访问令牌"),
  userId: z.string().optional().describe("Figma用户ID，不提供则返回当前用户信息"),
  includeTeams: z.boolean().default(false).describe("是否包含用户所属的团队信息"),
  includeProjects: z.boolean().default(false).describe("是否包含用户参与的项目信息"),
  includeFiles: z.boolean().default(false).describe("是否包含用户最近访问的文件"),
  fileLimit: z.number().min(1).max(50).default(10).describe("返回的文件数量限制")
});


/**
 * 获取Figma文件信息的请求模式
 * 用于获取特定Figma文件的详细信息
 */
export const GetFigmaFileInfoRequestSchema = z.object({
  token: z.string().describe("Figma访问令牌"),
  fileKey: z.string().describe("Figma文件的唯一标识符"),
  version: z.string().optional().describe("特定版本的ID，不提供则获取最新版本"),
  depth: z.number().min(1).max(4).default(2).describe("遍历节点树的最大深度，1-4之间的值")
});

/**
 * 获取Figma文件组件的请求模式
 * 用于获取Figma文件中的组件列表
 */
export const GetFigmaComponentsRequestSchema = z.object({
  token: z.string().describe("Figma访问令牌"),
  fileKey: z.string().describe("Figma文件的唯一标识符"),
  includeStyles: z.boolean().default(false).describe("是否包含组件的样式信息")
});

/**
 * 获取Figma文件注释的请求模式
 * 用于获取Figma文件中的所有注释
 */
export const GetFigmaCommentsRequestSchema = z.object({
  token: z.string().describe("Figma访问令牌"),
  fileKey: z.string().describe("Figma文件的唯一标识符"),
  pageId: z.string().optional().describe("特定页面的ID，不提供则获取所有页面的注释")
});

/**
 * 创建Figma注释的请求模式
 * 用于在Figma文件中添加新注释
 */
export const CreateFigmaCommentRequestSchema = z.object({
  token: z.string().describe("Figma访问令牌"),
  fileKey: z.string().describe("Figma文件的唯一标识符"),
  message: z.string().describe("注释内容"),
  position: z.object({
    x: z.number().describe("注释X坐标"),
    y: z.number().describe("注释Y坐标")
  }).describe("注释位置"),
  nodeId: z.string().optional().describe("关联的节点ID，不提供则为页面级注释"),
  pageId: z.string().optional().describe("页面ID，不提供则使用当前活动页面")
});

/**
 * 获取Figma文件样式的请求模式
 * 用于获取Figma文件中的样式定义
 */
export const GetFigmaStylesRequestSchema = z.object({
  token: z.string().describe("Figma访问令牌"),
  fileKey: z.string().describe("Figma文件的唯一标识符"),
  styleTypes: z.array(
    z.enum(["FILL", "TEXT", "EFFECT", "GRID"])
  ).optional().describe("要获取的样式类型，不提供则获取所有类型")
});

/**
 * 获取Figma文件版本历史的请求模式
 * 用于获取Figma文件的版本历史记录
 */
export const GetFigmaVersionsRequestSchema = z.object({
  token: z.string().describe("Figma访问令牌"),
  fileKey: z.string().describe("Figma文件的唯一标识符"),
  limit: z.number().min(1).max(100).default(30).describe("返回的版本数量限制"),
  before: z.string().optional().describe("获取此版本ID之前的版本")
});