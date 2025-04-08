import { createClient } from "@/lib/supabase/server"
import { Message } from "ai"
import { redirect } from "next/navigation"
import Chat from "../../components/chat/chat"
import LayoutApp from "../../components/layout/layout-app"

export default async function PrivatePage({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = await params
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/")
  }

  const { data: chatData, error: chatError } = await supabase
    .from("chats")
    .select("id, title, model, system_prompt")
    .eq("id", chatId)
    .eq("user_id", userData.user.id)
    .single()

  if (chatError || !chatData) {
    redirect("/")
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })

  const formattedMessages: Message[] =
    messages?.map((message) => ({
      id: String(message.id),
      content: message.content,
      experimental_attachments: message.attachments,
      role: message.role,
    })) || []

  if (messagesError || !messages) {
    redirect("/")
  }

  return (
    <LayoutApp>
      <Chat
        initialMessages={formattedMessages}
        chatId={chatId}
        preferredModel={chatData.model || ""}
        systemPrompt={chatData.system_prompt || "You are a helpful assistant."}
      />
    </LayoutApp>
  )
}
