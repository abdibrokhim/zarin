import { SYSTEM_PROMPT_DEFAULT } from "@/lib/config"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { userId, title, model, systemPrompt } = await request.json()
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
      })
    }

    // Create a chat object with a unique ID
    const chatData = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: title || "New Chat",
      model: model,
      system_prompt: systemPrompt || SYSTEM_PROMPT_DEFAULT,
      created_at: new Date().toISOString(),
    }

    // Return the chat data - it will be stored in IndexedDB by the client
    return new Response(JSON.stringify({ chat: chatData }), {
      status: 200,
    })
  } catch (err: any) {
    console.error("Error in create-chat endpoint:", err)

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