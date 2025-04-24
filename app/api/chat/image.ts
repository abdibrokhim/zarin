// image gen will be here

// Functions for image generation
import { experimental_generateImage as generateImage } from "ai"
import { Message } from "@ai-sdk/react"
import { createOpenAI } from "@ai-sdk/openai"
import { AIML_API_BASE_IMAGE_URL, AIML_API_BASE_URL } from "@/lib/config"

/**
 * Generates an image using the provided model and prompt
 * 
 * @param model The model to use for image generation (should be an image model)
 * @param prompt The text prompt to generate the image from
 * @returns Object containing the generated image data and metadata
 */
export async function generateImageFromPrompt(modelId: string, prompt: string) {
  try {
    // Create a fresh openAI image client with the appropriate model
    const openai = createOpenAI({
      apiKey: process.env.AIML_API_KEY,
      baseURL: AIML_API_BASE_URL,
    });
    
    // Use the AI SDK's generateImage function with properly initialized model
    const { image } = await generateImage({
      model: openai.image(modelId),
      prompt: prompt,
      // Default size for DALL-E models
      size: "1024x1024",
      providerOptions: {
        openai: { 
          response_format: "b64_json" // Ensure we get base64 encoded response
        }
      },
    });
    
    // Sometimes the base64 string has a data:image prefix, let's handle it
    let base64String = image.base64;
    // If it starts with data:image, extract just the base64 part
    if (base64String.startsWith('data:')) {
      base64String = base64String.split(',')[1];
    }
    
    return {
      success: true,
      image: {
        base64: base64String,
        mimeType: image.mimeType || "image/png" // Default to PNG if not provided
      }
    };
  } catch (error: any) {
    console.error("Error generating image:", error);
    return {
      success: false,
      error: error.message || "Failed to generate image"
    };
  }
}

/**
 * Extracts the prompt text from the last user message
 * 
 * @param messages Array of chat messages
 * @returns The content of the last user message or empty string
 */
export function extractPromptFromMessages(messages: Message[]): string {
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === "user");
  const prompt = lastUserMessage?.content || "";
  
  if (typeof prompt !== "string") {
    return "";
  }
  
  return prompt;
}
