import { ScrollButton } from "@/components/motion-primitives/scroll-button"
import { ChatContainer } from "@/components/prompt-kit/chat-container"
import { Loader } from "@/components/prompt-kit/loader"
import { Message as MessageType } from "@ai-sdk/react"
import { useRef } from "react"
import { Message } from "./message"
import { ExtendedMessage, MessageAttachment } from "@/lib/chat/message"

type ConversationProps = {
  messages: MessageType[] | ExtendedMessage[]
  status?: "streaming" | "ready" | "submitted" | "error"
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
  onReload: () => void
}

// Helper function to convert AI SDK attachment to our MessageAttachment type
const convertAttachments = (attachments: any[] | undefined): MessageAttachment[] | undefined => {
  if (!attachments) return undefined;
  
  return attachments.map(attachment => ({
    name: attachment.name || "",
    contentType: attachment.contentType || "",
    url: attachment.url || ""
  }));
};

export function Conversation({
  messages,
  status = "ready",
  onDelete,
  onEdit,
  onReload,
}: ConversationProps) {
  const initialMessageCount = useRef(messages.length)
  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-x-hidden overflow-y-auto">
      <ChatContainer
        className="relative flex w-full flex-col items-center pt-20 pb-4"
        autoScroll={true}
        ref={containerRef}
        scrollToRef={scrollRef}
        style={{
          scrollbarGutter: "stable both-edges",
        }}
      >
        {messages?.map((message, index) => {
          const isLast = index === messages.length - 1 && status !== "submitted"
          const hasScrollAnchor =
            isLast && messages.length > initialMessageCount.current
          
          // Check if the message is an ExtendedMessage with audio or bagoodex content
          const extendedMessage = message as ExtendedMessage
          const hasAudio = extendedMessage.audio !== undefined
          const hasBagoodex = extendedMessage.bagoodex !== undefined
          const hasImage = extendedMessage.image !== undefined
          const modelType = extendedMessage.modelType

          return (
            <Message
              key={message.id}
              id={message.id}
              variant={message.role}
              attachments={convertAttachments(message.experimental_attachments)}
              isLast={isLast}
              onDelete={onDelete}
              onEdit={onEdit}
              onReload={onReload}
              hasScrollAnchor={hasScrollAnchor}
              audio={hasAudio ? extendedMessage.audio : undefined}
              bagoodex={hasBagoodex ? extendedMessage.bagoodex : undefined}
              image={hasImage ? extendedMessage.image : undefined}
            >
              {message.content}
            </Message>
          )
        })}
        {status === "submitted" &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && (
            <div className="group min-h-scroll-anchor flex w-full max-w-3xl flex-col items-start gap-2 px-6 pb-2">
              <Loader />
            </div>
          )}
      </ChatContainer>
      <div className="absolute bottom-0 w-full max-w-3xl">
        <ScrollButton
          className="absolute top-[-50px] right-[30px]"
          scrollRef={scrollRef}
          containerRef={containerRef}
        />
      </div>
    </div>
  )
}
