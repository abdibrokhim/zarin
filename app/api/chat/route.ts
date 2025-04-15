// /chat/api/chat.ts
import { ALL_MODELS } from "@/lib/models/config"
import { Message, streamText } from "ai"

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
    
    // Frontend will handle saving the user message to IndexedDB
    
    const result = streamText({
      model: selectedModel.api_sdk,
      system: systemPrompt || "You are a helpful assistant.",
      messages,
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