import { Model } from "@/lib/models/types";

export type ToolType = "function" | "web_search";

export interface FunctionParameter {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description: string;
  required: boolean;
  enum?: string[];
}

export interface FunctionTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: FunctionParameter[];
    handler: (params: Record<string, any>) => Promise<any>;
  };
}

export interface WebSearchTool {
  type: "web_search";
  web_search: {
    enabled: boolean;
    search_context_size?: "low" | "medium" | "high";
  };
}

export type Tool = FunctionTool | WebSearchTool;

export interface AgentConfig {
  name: string;
  model: Model;
  instructions?: string;
  tools?: Tool[];
  memory?: boolean;
  debug?: boolean;
}

export interface Message {
  role: "system" | "user" | "assistant" | "function";
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface AgentResponse {
  message: Message;
  usedTools: string[];
  usedWebSearch: boolean;
  debug?: any;
}

export interface AgentRunnerConfig {
  maxIterations?: number;
  timeout?: number;
}

export interface HandoffConfig {
  agentId: string;
  condition: (message: Message) => boolean;
} 