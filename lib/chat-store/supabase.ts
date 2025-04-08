import type { Chat, Message } from "@/lib/chat-store/types"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export async function getUserChatsFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Chat[]
}

export async function getMessagesFromSupabase(chatId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data as Message[]
}

export async function sendMessageToSupabase(message: Message) {
  const { error } = await supabase.from("messages").insert(message)
  if (error) throw error
}

export async function createChatInSupabase(
  chat: Omit<Chat, "id" | "created_at">
): Promise<string> {
  const { data, error } = await supabase
    .from("chats")
    .insert(chat)
    .select("id")
    .single()

  if (error || !data?.id) throw error
  return data.id
}
