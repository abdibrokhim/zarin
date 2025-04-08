import type { ChatHistory } from "@/lib/chat-store/types"
import { createClient } from "@/lib/supabase/client"
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
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chats")
    .select("id, title, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (!data || error) {
    console.error("Failed to fetch chats:", error)
    return []
  }

  await writeToIndexedDB("chats", data)
  return data
}

export async function updateChatTitle(
  id: string,
  title: string
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("chats").update({ title }).eq("id", id)
  if (error) throw error

  const all = await getCachedChats()
  const updated = (all as ChatHistory[]).map((c) =>
    c.id === id ? { ...c, title } : c
  )
  await writeToIndexedDB("chats", updated)
}

export async function deleteChat(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("chats").delete().eq("id", id)
  if (error) throw error

  const all = await getCachedChats()
  await writeToIndexedDB(
    "chats",
    (all as ChatHistory[]).filter((c) => c.id !== id)
  )
}
