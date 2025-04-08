import { readFromIndexedDB, writeToIndexedDB } from "@/lib/chat-store/persist"
import type { Chat, ChatHistory } from "@/lib/chat-store/types"
import { MODEL_DEFAULT, SYSTEM_PROMPT_DEFAULT } from "../config"
import { fetchClient } from "../fetch"
import { API_ROUTE_CREATE_CHAT } from "../routes"

export async function getChat(chatId: string): Promise<Chat | null> {
  const all = await readFromIndexedDB<Chat>("chats")
  return (all as Chat[]).find((c) => c.id === chatId) || null
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const all = await readFromIndexedDB<Chat>("chats")
  return (all as Chat[]).filter(c => c.user_id === userId).sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  })
}

export async function createChat(
  userId: string,
  title: string,
  model: string,
  systemPrompt: string
): Promise<string> {
  const id = crypto.randomUUID()
  const chat = {
    id,
    title,
    model,
    user_id: userId,
    system_prompt: systemPrompt,
    created_at: new Date().toISOString(),
  }
  
  await writeToIndexedDB("chats", chat)
  return id
}

export async function updateChatModel(chatId: string, model: string) {
  const existing = await getChat(chatId)
  if (existing) {
    await writeToIndexedDB("chats", { ...existing, model })
  }
}

export async function createNewChat(
  userId: string,
  title?: string,
  model?: string,
  isAuthenticated?: boolean,
  systemPrompt?: string
): Promise<ChatHistory> {
  try {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    const chat: ChatHistory = {
      id,
      title: title || "New Chat",
      created_at: now,
    }
    
    const fullChat: Chat = {
      ...chat,
      user_id: userId,
      model: model || MODEL_DEFAULT,
      system_prompt: systemPrompt || SYSTEM_PROMPT_DEFAULT,
    }
    
    await writeToIndexedDB("chats", fullChat)
    return chat
  } catch (error) {
    console.error("Error creating new chat:", error)
    throw error
  }
}
