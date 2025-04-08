import type { Tables } from "@/app/types/database.types"
import { readFromIndexedDB, writeToIndexedDB } from "./persist"
import { getMessagesFromSupabase, sendMessageToSupabase } from "./supabase"

type Message = Tables<"messages">

// Load messages from local IndexedDB
export async function getMessages(chatId: string): Promise<Message[]> {
  const all = await readFromIndexedDB<Message>("messages")
  return (all as Message[]).filter((m) => m.chat_id === chatId)
}

// Sync messages from Supabase and store locally
export async function syncMessages(chatId: string): Promise<void> {
  const remote = await getMessagesFromSupabase(chatId)
  if (remote?.length) {
    await writeToIndexedDB("messages", remote)
  }
}

// Write message locally and remotely (optimistic)
export async function sendMessage(message: Message): Promise<void> {
  await writeToIndexedDB("messages", message)
  await sendMessageToSupabase(message)
}
