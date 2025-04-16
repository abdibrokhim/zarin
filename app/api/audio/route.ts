// /chat/api/audio.ts
import { MODELS as DEEPGRAM_MODELS } from "@/lib/models/deepgram";
import { ALL_MODELS } from "@/lib/models/config";
import { Agent, AgentRunner, createFunctionTool, createParameter, createWebSearchTool } from "@/lib/agents";

// Maximum allowed duration for streaming (in seconds)
export const maxDuration = 30;

type AudioRequest = {
  prompt: string;
  userId: string;
  selectedModel?: string; // Allow client to pass the selected model
};

export async function POST(req: Request) {
  try {
    const { prompt, userId, selectedModel } = (await req.json()) as AudioRequest;

    if (!prompt || !userId) {
      return new Response(
        JSON.stringify({ error: "Error, missing information" }),
        { status: 400 }
      );
    }

    // Find an appropriate model for the agent that we know works
    // Using gpt-4o instead of gpt-4.1-nano which might be causing the issue
    const agentModel = ALL_MODELS.find(m => m.id === "gpt-4o") || 
                      ALL_MODELS.find(m => m.id === "gpt-4o-mini") ||
                      ALL_MODELS.find(m => m.id === "o1") ||
                      ALL_MODELS.find(m => m.id === "o1-mini") ||
                      ALL_MODELS[0]; // Fallback to first available model
    
    if (!agentModel) {
      return new Response(
        JSON.stringify({ error: "No suitable AI model found for processing" }),
        { status: 500 }
      );
    }

    try {
      // Create a text processing agent to understand the user's request
      const triageAgent = new Agent({
        name: "Audio Triage Agent",
        model: agentModel,
        instructions: `You are an AI assistant that specializes in understanding user requests for audio generation.
                      Extract the text content that should be converted to audio and determine which voice type would be best.
                      For voice selection, determine whether it's a male or female voice, and any specific characteristics mentioned.`,
        tools: [
          createFunctionTool(
            "generate_audio",
            "Generate audio from text using the specified model",
            [
              createParameter("text", "string", "The text to convert to audio"),
              createParameter("voice_type", "string", "The type of voice to use (e.g., 'male', 'female', specific name)", true, 
                ["angus", "arcas", "asteria", "athena", "helios", "hera", "luna", "orion", "orpheus", "perseus", "stella", "zeus"])
            ],
            async ({ text, voice_type }) => {
              try {
                // If client provided a model, use it directly if it's a Deepgram model
                let modelId;
                if (selectedModel && selectedModel.startsWith('deepgram-')) {
                  modelId = selectedModel;
                } else {
                  // Otherwise, use the voice type to determine the model
                  modelId = `deepgram-${voice_type.toLowerCase()}`;
                }
                
                const model = DEEPGRAM_MODELS.find(m => m.id === modelId);
                
                if (!model || !model.api_sdk) {
                  throw new Error(`Voice type '${voice_type}' not found or not available`);
                }
                
                // Debug the model to ensure api_sdk is a function
                console.log(`Processing audio with model: ${modelId}`);
                console.log(`API SDK type: ${typeof model.api_sdk}`);
                
                // Call the API to generate audio
                // The model's api_sdk is a function created by customDeepgram
                // In deepgram.ts it's defined as: api_sdk: customDeepgram(`#${modelId}`)
                // So we need to call it with the text parameter
                if (typeof model.api_sdk !== 'function') {
                  throw new Error(`API SDK for model ${modelId} is not a function`);
                }
                
                const audioBlob = await model.api_sdk(text);
                // Return base64 encoded audio for the response
                const buffer = await audioBlob.arrayBuffer();
                const base64Audio = Buffer.from(buffer).toString('base64');
                
                return {
                  success: true,
                  audio: base64Audio,
                  model: modelId,
                  text: text
                };
              } catch (error: any) {
                console.error("Error generating audio:", error);
                return {
                  success: false,
                  error: error.message || "Failed to generate audio",
                  text: text
                };
              }
            }
          ),
          createWebSearchTool(false) // Disable web search to reduce complexity
        ]
      });

      // Create a runner
      const runner = new AgentRunner();
      runner.registerAgent(triageAgent, true);
      
      // Run the agent with the user's prompt
      const response = await runner.run(prompt);
      
      // Return the result
      return new Response(
        JSON.stringify({
          response: response.message.content,
          audio: response.usedTools.includes("generate_audio") ? 
            JSON.parse(response.message.content) : null
        }),
        { status: 200 }
      );
    } catch (agentError: any) {
      console.error("Agent processing error:", agentError);
      
      // If the agent fails, try direct audio generation with default voice
      if (selectedModel && selectedModel.startsWith('deepgram-')) {
        try {
          const model = DEEPGRAM_MODELS.find(m => m.id === selectedModel);
          
          if (!model || !model.api_sdk) {
            throw new Error(`Selected model ${selectedModel} not found or not available`);
          }
          
          // Extract text - basic fallback
          const text = prompt.includes('text=') 
            ? prompt.split('text=')[1].trim().split('"')[0].split("'")[0] 
            : prompt;
          
          const audioBlob = await model.api_sdk(text);
          const buffer = await audioBlob.arrayBuffer();
          const base64Audio = Buffer.from(buffer).toString('base64');
          
          return new Response(
            JSON.stringify({
              response: `Generated audio using ${selectedModel}`,
              audio: {
                success: true,
                audio: base64Audio,
                model: selectedModel,
                text: text
              }
            }),
            { status: 200 }
          );
        } catch (directError: any) {
          console.error("Direct audio generation error:", directError);
          throw directError;
        }
      } else {
        throw agentError;
      }
    }
  } catch (err: any) {
    console.error("Error in /api/audio:", err);
    
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500 }
    );
  }
}