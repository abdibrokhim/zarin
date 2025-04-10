// /lib/chat-store/chat-history-context.tsx
"use client"

import { toast } from "@/components/ui/toast"
import { createContext, useContext, useEffect, useState } from "react"
import { createNewChat as createNewChatFromDb } from "./chat"
import {
  deleteChat as deleteChatFromDb,
  getCachedChats,
  updateChatTitle,
} from "./history"
import { clearAllIndexedDBStores } from "./persist"
import type { ChatHistory } from "./types"
import { fetchAndCacheChats } from "@/lib/chat-store/history"

interface ChatHistoryContextType {
  chats: ChatHistory[]
  refresh: () => Promise<void>
  updateTitle: (id: string, title: string) => Promise<void>
  deleteChat: (
    id: string,
    currentChatId?: string,
    redirect?: () => void
  ) => Promise<void>
  setChats: React.Dispatch<React.SetStateAction<ChatHistory[]>>
  createNewChat: (
    userId: string,
    title?: string,
    model?: string,
    isAuthenticated?: boolean,
    systemPrompt?: string
  ) => Promise<ChatHistory | undefined>
  resetHistory: () => Promise<void>
}
const ChatHistoryContext = createContext<ChatHistoryContextType | null>(null)

export function useChatHistory() {
  const context = useContext(ChatHistoryContext)
  if (!context)
    throw new Error("useChatHistory must be used within ChatHistoryProvider")
  return context
}

export function ChatHistoryProvider({
  userId,
  children,
}: {
  userId?: string
  children: React.ReactNode
}) {
  const [chats, setChats] = useState<ChatHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      let chats: ChatHistory[]
      if (userId) {
        chats = await fetchAndCacheChats(userId)
      } else {
        chats = await getCachedChats()
      }
      
      // Filter out deleted chats
      const activeChats = chats.filter(chat => !chat._deleted);
      
      // Sort by created date
      activeChats.sort((a, b) => {
        return +new Date(b.created_at || "") - +new Date(a.created_at || "")
      })
      
      setChats(activeChats)
    } catch (error) {
      console.error("Failed to fetch chats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load chats when the component mounts, regardless of userId
  useEffect(() => {
    const load = async () => {
      await fetchData()
    }
    load()
  }, []) // Empty dependency array ensures this runs only once on mount

  // Also reload chats when userId changes
  useEffect(() => {
    if (!userId) return

    const load = async () => {
      await fetchData()
    }
    load()
  }, [userId])

  const refresh = async () => {
    if (!userId) return

    await fetchData()
  }

  const updateTitle = async (id: string, title: string) => {
    const prev = [...chats]
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)))
    try {
      await updateChatTitle(id, title)
    } catch (e) {
      setChats(prev)
      toast({ title: "Failed to update title", status: "error" })
    }
  }

  const deleteChat = async (
    id: string,
    currentChatId?: string,
    redirect?: () => void
  ) => {
    const prev = [...chats]
    setChats((prev) => prev.filter((c) => c.id !== id))

    try {
      await deleteChatFromDb(id)
      if (id === currentChatId && redirect) redirect()
    } catch (e) {
      setChats(prev)
      toast({ title: "Failed to delete chat", status: "error" })
    }
  }

  const createNewChat = async (
    userId: string,
    title?: string,
    model?: string,
    isAuthenticated?: boolean,
    systemPrompt?: string
  ) => {
    if (!userId) return
    const prev = [...chats]

    const optimisticId = `optimistic-${Date.now().toString()}`
    const optimisticChat = {
      id: optimisticId,
      title: "New Chat",
      created_at: new Date().toISOString(),
      user_id: userId,
      model: model || "default",
      system_prompt: systemPrompt || ""
    }
    setChats((prev) => [...prev, optimisticChat])

    try {
      const newChat = await createNewChatFromDb(
        userId,
        title,
        model,
        isAuthenticated,
        systemPrompt
      )
      setChats((prev) =>
        prev
          .map((c) => (c.id === optimisticId ? newChat : c))
          .sort(
            (a, b) =>
              +new Date(b.created_at || "") - +new Date(a.created_at || "")
          )
      )
      return newChat
    } catch (e) {
      setChats(prev)
      toast({ title: "Failed to create chat", status: "error" })
    }
  }

  const resetHistory = async () => {
    setChats([])
    await clearAllIndexedDBStores()
  }

  return (
    <ChatHistoryContext.Provider
      value={{
        chats,
        refresh,
        updateTitle,
        deleteChat,
        setChats,
        createNewChat,
        resetHistory,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  )
}
