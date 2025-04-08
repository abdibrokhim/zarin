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
  const all = await getCachedChats()
  const updated = (all as ChatHistory[]).map((c) =>
    c.id === id ? { ...c, title } : c
  )
  await writeToIndexedDB("chats", updated)
}

export async function deleteChat(id: string): Promise<void> {
  const all = await getCachedChats()
  await writeToIndexedDB(
    "chats",
    (all as ChatHistory[]).filter((c) => c.id !== id)
  )
}
