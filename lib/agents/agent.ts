import { AIML_API_BASE_URL } from "@/lib/config";
import { AgentConfig, AgentResponse, Message, Tool } from "./types";

export class Agent {
  private id: string;
  private config: AgentConfig;
  private messages: Message[] = [];
  private tools: Tool[] = [];
  private apiKey: string | undefined;

  constructor(config: AgentConfig) {
    this.id = `agent_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.config = config;
    this.tools = config.tools || [];
    this.apiKey = process.env.AIML_API_KEY;

    // Initialize with system message if instructions are provided
    if (config.instructions) {
      this.messages.push({
        role: "system",
        content: config.instructions,
      });
    }
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.config.name;
  }

  public getMessages(): Message[] {
    return [...this.messages];
  }

  public addMessage(message: Message): void {
    this.messages.push(message);
  }

  public clearMessages(): void {
    this.messages = this.messages.filter(msg => msg.role === "system");
  }

  public async process(input: string): Promise<AgentResponse> {
    // Add user message
    this.addMessage({ role: "user", content: input });

    // Build request body
    const requestBody: any = {
      model: this.config.model.id,
      messages: this.messages,
    };

    // Add tools if available
    if (this.tools.length > 0) {
      requestBody.tools = this.tools.map(tool => {
        if (tool.type === "function") {
          const { handler, ...functionDef } = tool.function;
          return {
            type: "function",
            function: functionDef
          };
        }
        return tool;
      });
      requestBody.tool_choice = "auto";
    }

    try {
      // Make API call
      const response = await fetch(`${AIML_API_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to get a response from the model");
      }

      const result = await response.json();
      const assistantMessage = result.choices[0].message;
      
      // Add assistant message to conversation history
      this.addMessage(assistantMessage);
      
      // Process any tool calls
      let usedTools: string[] = [];
      let usedWebSearch = false;
      
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        for (const toolCall of assistantMessage.tool_calls) {
          if (toolCall.type === "function") {
            const { name, arguments: args } = toolCall.function;
            const tool = this.tools.find(t => 
              t.type === "function" && t.function.name === name
            ) as Tool | undefined;
            
            if (tool && tool.type === "function") {
              try {
                const parsedArgs = JSON.parse(args);
                const result = await tool.function.handler(parsedArgs);
                
                // Add function response as a message
                this.addMessage({
                  role: "function",
                  name: name,
                  content: JSON.stringify(result),
                });
                
                usedTools.push(name);
              } catch (error) {
                console.error(`Error executing tool ${name}:`, error);
                this.addMessage({
                  role: "function",
                  name: name,
                  content: JSON.stringify({ error: `Failed to execute function: ${error}` }),
                });
              }
            }
          } else if (toolCall.type === "web_search") {
            usedWebSearch = true;
          }
        }
        
        // If tools were used, process the follow-up response
        if (usedTools.length > 0 || usedWebSearch) {
          return this.process("");
        }
      }
      
      return {
        message: assistantMessage,
        usedTools,
        usedWebSearch,
        debug: this.config.debug ? { fullResponse: result } : undefined,
      };
      
    } catch (error: any) {
      console.error("Error in agent processing:", error);
      throw error;
    }
  }
} 