import type { Tables } from "@/app/types/database.types"
import { readFromIndexedDB, writeToIndexedDB } from "./persist"

type Message = Tables<"messages">

// Load messages from local IndexedDB
export async function getMessages(chatId: string): Promise<Message[]> {
  const all = await readFromIndexedDB<Message>("messages")
  return (all as Message[]).filter((m) => m.chat_id === chatId)
}

// Save messages to IndexedDB
export async function syncMessages(chatId: string): Promise<void> {
  // This function is kept for API compatibility but now only works with IndexedDB
  // No remote syncing needed
}

// Write message to IndexedDB
export async function sendMessage(message: Message): Promise<void> {
  await writeToIndexedDB("messages", message)
}
