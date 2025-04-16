import { ScrollButton } from "@/components/motion-primitives/scroll-button"
import { ChatContainer } from "@/components/prompt-kit/chat-container"
import { Loader } from "@/components/prompt-kit/loader"
import { Message as MessageType } from "@ai-sdk/react"
import { useRef, memo } from "react"
import { Message } from "./message"
import equal from 'fast-deep-equal';

type ConversationProps = {
  messages: MessageType[]
  status?: "streaming" | "ready" | "submitted" | "error"
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
  onReload: () => void
  isArtifactVisible: boolean;
}

function PureConversation({
  messages,
  status = "ready",
  onDelete,
  onEdit,
  onReload,
  isArtifactVisible,
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

          return (
            <Message
              key={message.id}
              id={message.id}
              variant={message.role}
              attachments={message.experimental_attachments}
              isLast={isLast}
              onDelete={onDelete}
              onEdit={onEdit}
              onReload={onReload}
              hasScrollAnchor={hasScrollAnchor}
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

export const Conversation = memo(PureConversation, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

  if (prevProps.status !== nextProps.status) return false;
  if (!prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
