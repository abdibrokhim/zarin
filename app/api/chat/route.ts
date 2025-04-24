// /chat/api/chat.ts
import { ALL_MODELS } from "@/lib/models/config"
import { Message, streamText } from "ai"
import { generateImageFromPrompt, extractPromptFromMessages } from "./image"

// Maximum allowed duration for streaming (in seconds)
export const maxDuration = 30

type ChatRequest = {
  messages: Message[]
  chatId: string
  userId: string
  model: string
  systemPrompt: string
  isAuthenticated: boolean
}

export async function POST(req: Request) {
  try {
    const { messages, chatId, userId, model, systemPrompt, isAuthenticated } =
      (await req.json()) as ChatRequest

    if (!messages || !chatId || !userId) {
      return new Response(
        JSON.stringify({ error: "Error, missing information" }),
        { status: 400 }
      )
    }

    // Find the selected model
    const selectedModel = ALL_MODELS.find((m) => m.id === model)
    
    if (!selectedModel || !selectedModel.api_sdk) {
      console.error(`Model not found or missing API SDK: ${model}`)
      return new Response(
        JSON.stringify({ error: "Selected model is not available" }),
        { status: 400 }
      )
    }
    
    // Check if this is an image generation model
    if (selectedModel.type === "image") {
      // Extract the prompt from the messages
      const prompt = extractPromptFromMessages(messages)
      
      if (!prompt) {
        return new Response(
          JSON.stringify({ error: "No valid prompt found for image generation" }),
          { status: 400 }
        )
      }
      
      // Generate the image
      const imageResult = await generateImageFromPrompt(selectedModel.id, prompt)
      
      if (!imageResult.success) {
        return new Response(
          JSON.stringify({ error: imageResult.error }),
          { status: 500 }
        )
      }

      console.log('imageResult:', imageResult)
      
      // Return image data with proper headers
      return new Response(
        JSON.stringify({
          image: imageResult.image,
          chatId,
        }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Chat-Id': chatId
          }
        }
      )
    }
    
    // For text models, use streaming as before
    const result = streamText({
      model: selectedModel.api_sdk,
      system: systemPrompt || "You are a helpful assistant.",
      messages,
      providerOptions: {
        openai: { responseModalities: ['TEXT', 'IMAGE'] },
      },
    })

    // Ensure the stream is consumed
    result.consumeStream()
    const originalResponse = result.toDataStreamResponse()
    
    // Attach chatId in a custom header
    const headers = new Headers(originalResponse.headers)
    headers.set("X-Chat-Id", chatId)

    return new Response(originalResponse.body, {
      status: originalResponse.status,
      headers,
    })
  } catch (err: any) {
    console.error("Error in /chat/api/chat:", err)
    
    // Return a structured error response
    if (err.code === "DAILY_LIMIT_REACHED") {
      return new Response(
        JSON.stringify({ error: err.message, code: err.code }),
        { status: 403 }
      )
    }

    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500 }
    )
  }
} 