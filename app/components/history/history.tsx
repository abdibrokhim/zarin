"use client"

import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { useChatHistory } from "@/lib/chat-store/chat-history-provider"
import dynamic from "next/dynamic"
import { useParams, useRouter } from "next/navigation"

const CommandHistory = dynamic(
  () => import("./command-history").then((mod) => mod.CommandHistory),
  { ssr: false }
)

const DrawerHistory = dynamic(
  () => import("./drawer-history").then((mod) => mod.DrawerHistory),
  { ssr: false }
)

export function History() {
  const isMobile = useBreakpoint(768)
  const params = useParams<{ chatId: string }>()
  const router = useRouter()
  const { chats, updateTitle, deleteChat } = useChatHistory()

  const handleSaveEdit = async (id: string, newTitle: string) => {
    await updateTitle(id, newTitle)
  }

  const handleConfirmDelete = async (id: string) => {
    await deleteChat(id, params.chatId, () => router.push("/"))
  }

  if (isMobile) {
    return (
      <DrawerHistory
        chatHistory={chats}
        onSaveEdit={handleSaveEdit}
        onConfirmDelete={handleConfirmDelete}
      />
    )
  }

  return (
    <CommandHistory
      chatHistory={chats}
      onSaveEdit={handleSaveEdit}
      onConfirmDelete={handleConfirmDelete}
    />
  )
}
