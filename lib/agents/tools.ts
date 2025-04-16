import { FunctionParameter, FunctionTool, WebSearchTool } from "./types";

/**
 * Creates a function tool for agents
 */
export function createFunctionTool(
  name: string,
  description: string,
  parameters: FunctionParameter[],
  handler: (params: Record<string, any>) => Promise<any>
): FunctionTool {
  return {
    type: "function",
    function: {
      name,
      description,
      parameters,
      handler,
    },
  };
}

/**
 * Creates a web search tool for agents
 */
export function createWebSearchTool(
  enabled: boolean = true,
  searchContextSize: "low" | "medium" | "high" = "low"
): WebSearchTool {
  return {
    type: "web_search",
    web_search: {
      enabled,
      search_context_size: searchContextSize,
    },
  };
}

/**
 * Create a function parameter
 */
export function createParameter(
  name: string,
  type: "string" | "number" | "boolean" | "object" | "array",
  description: string,
  required: boolean = true,
  enumValues?: string[]
): FunctionParameter {
  return {
    name,
    type,
    description,
    required,
    ...(enumValues ? { enum: enumValues } : {}),
  };
} 