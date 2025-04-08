import type { ChatHistory } from "@/lib/chat-store/types"
import { readFromIndexedDB, writeToIndexedDB } from "./persist"

export async function getCachedChats(): Promise<ChatHistory[]> {
  const all = await readFromIndexedDB<ChatHistory>("chats")
  return (all as ChatHistory[]).sort(
    (a, b) => +new Date(b.created_at || "") - +new Date(a.created_at || "")
  )
}

export async function fetchAndCacheChats(
  userId: string
): Promise<ChatHistory[]> {
  // With IndexedDB only, we just return the cached chats
  const all = await readFromIndexedDB<ChatHistory>("chats")
  return (all as ChatHistory[])
    .filter((chat: any) => chat.user_id === userId)
    .sort(
      (a, b) => +new Date(b.created_at || "") - +new Date(a.created_at || "")
    )
}

export async function updateChatTitle(
  id: string,
  title: string
): Promise<void> {
  try {
    // Get the specific chat first
    const all = await getCachedChats()
    const chatToUpdate = all.find(c => c.id === id)
    
    if (chatToUpdate) {
      // Update just this one chat
      const updatedChat = { ...chatToUpdate, title }
      await writeToIndexedDB("chats", updatedChat)
    } else {
      console.error(`Chat with ID ${id} not found for title update`)
    }
  } catch (error) {
    console.error(`Error updating chat title for ${id}:`, error)
    throw error
  }
}

export async function deleteChat(id: string): Promise<void> {
  try {
    await writeToIndexedDB(
      "chats",
      { id, _deleted: true }
    )
  } catch (error) {
    console.error(`Error deleting chat ${id}:`, error)
    throw error
  }
}
