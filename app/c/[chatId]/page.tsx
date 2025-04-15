"use client"

import { Message } from "ai"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Chat from "../../components/chat/chat"
import LayoutApp from "../../components/layout/layout-app"
import { getChat } from "@/lib/chat/chat"
import { getMessages } from "@/lib/chat/message"
import { SYSTEM_PROMPT_DEFAULT } from "@/lib/models/config"

export default function PrivatePage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params?.chatId as string
  const [isLoading, setIsLoading] = useState(true)
  const [chatData, setChatData] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    async function loadChatData() {
      try {
        // Get chat metadata from IndexedDB
        const chat = await getChat(chatId)
        if (!chat) {
          router.push("/")
          return
        }

        setChatData(chat)

        // Get messages from IndexedDB
        const chatMessages = await getMessages(chatId)
        
        // Format messages to match the AI SDK format
        const formattedMessages: Message[] = chatMessages.map((message) => ({
          id: String(message.id),
          content: message.content,
          experimental_attachments: message.attachments,
          role: message.role,
        }))

        setMessages(formattedMessages)
      } catch (error) {
        console.error("Error loading chat data:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    if (chatId) {
      loadChatData()
    }
  }, [chatId, router])

  if (isLoading) {
    return (
      <LayoutApp>
        <div className="flex h-full items-center justify-center">
          <div className="text-foreground">Loading chat...</div>
        </div>
      </LayoutApp>
    )
  }

  return (
    <LayoutApp>
      <Chat
        initialMessages={messages}
        chatId={chatId}
        preferredModel={chatData?.model || ""}
        systemPrompt={chatData?.system_prompt || SYSTEM_PROMPT_DEFAULT}
      />
    </LayoutApp>
  )
}
