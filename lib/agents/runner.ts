import { Agent } from "./agent";
import { AgentResponse, AgentRunnerConfig, HandoffConfig, Message } from "./types";

export class AgentRunner {
  private agents: Map<string, Agent> = new Map();
  private handoffs: HandoffConfig[] = [];
  private config: AgentRunnerConfig;
  private defaultAgentId: string | null = null;

  constructor(config: AgentRunnerConfig = {}) {
    this.config = {
      maxIterations: config.maxIterations || 10,
      timeout: config.timeout || 30000, // 30 seconds default timeout
    };
  }

  public registerAgent(agent: Agent, isDefault: boolean = false): void {
    this.agents.set(agent.getId(), agent);
    
    if (isDefault) {
      this.defaultAgentId = agent.getId();
    }
  }

  public registerHandoff(handoff: HandoffConfig): void {
    this.handoffs.push(handoff);
  }

  public getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  private findHandoffAgent(message: Message): string | null {
    for (const handoff of this.handoffs) {
      if (handoff.condition(message)) {
        return handoff.agentId;
      }
    }
    return null;
  }

  public async run(input: string, startAgentId?: string): Promise<AgentResponse> {
    const agentId = startAgentId || this.defaultAgentId;
    
    if (!agentId) {
      throw new Error("No agent specified and no default agent registered");
    }
    
    const agent = this.agents.get(agentId);
    
    if (!agent) {
      throw new Error(`Agent with ID ${agentId} not found`);
    }
    
    let iteration = 0;
    let currentAgentId = agentId;
    let currentAgent = agent;
    let userInput = input;
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      // Set up timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`Agent execution timed out after ${this.config.timeout}ms`));
        }, this.config.timeout);
      });
      
      // Main execution loop
      while (iteration < this.config.maxIterations!) {
        iteration++;
        
        // Process the input with the current agent
        const response = await Promise.race([
          currentAgent.process(userInput),
          timeoutPromise
        ]) as AgentResponse;
        
        // Check if we need to hand off to another agent
        const nextAgentId = this.findHandoffAgent(response.message);
        
        if (nextAgentId) {
          const nextAgent = this.agents.get(nextAgentId);
          
          if (!nextAgent) {
            throw new Error(`Handoff agent with ID ${nextAgentId} not found`);
          }
          
          // Transfer the conversation context
          nextAgent.addMessage({
            role: "user",
            content: response.message.content
          });
          
          currentAgentId = nextAgentId;
          currentAgent = nextAgent;
          userInput = ""; // Empty input for continuation
        } else {
          // No handoff, we're done
          return response;
        }
      }
      
      throw new Error(`Maximum iteration limit (${this.config.maxIterations}) reached`);
      
    } finally {
      // Clear timeout if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  public async runSync(input: string, startAgentId?: string): Promise<AgentResponse> {
    return this.run(input, startAgentId);
  }
} 