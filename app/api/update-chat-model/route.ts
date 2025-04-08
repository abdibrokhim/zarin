import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { chatId, model } = await request.json()

    if (!chatId || !model) {
      return new Response(
        JSON.stringify({ error: "Missing chatId or model" }),
        {
          status: 400,
        }
      )
    }

    // Update the chat record with the new model
    const { error } = await supabase
      .from("chats")
      .update({ model })
      .eq("id", chatId)

    if (error) {
      console.error("Error updating chat model:", error)
      return new Response(
        JSON.stringify({
          error: "Failed to update chat model",
          details: error.message,
        }),
        { status: 500 }
      )
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    })
  } catch (err: any) {
    console.error("Error in update-chat-model endpoint:", err)
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500 }
    )
  }
}
