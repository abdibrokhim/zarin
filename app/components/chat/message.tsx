import { MessageAssistant } from "@/app/components/chat/message-assistant"
import { MessageUser } from "@/app/components/chat/message-user"
import { useState } from "react"
import { AudioAttachment, BagoodexAttachment, ImageAttachment } from "@/lib/chat/message"

type Attachment = {
  name: string
  contentType: string
  url: string
}

type MessageProps = {
  id: string
  variant: string
  children: string
  isLast?: boolean
  hasScrollAnchor?: boolean
  onDelete?: (id: string) => void
  onEdit?: (id: string, content: string) => void
  onReload?: () => void
  attachments?: Attachment[]
  audio?: AudioAttachment
  bagoodex?: BagoodexAttachment
  image?: ImageAttachment
}

export function Message({
  id,
  variant,
  children,
  isLast,
  hasScrollAnchor,
  onDelete,
  onEdit,
  onReload,
  attachments,
  audio,
  bagoodex,
  image
}: MessageProps) {
  const [copying, setCopying] = useState(false)
  
  const copyContentToClipboard = () => {
    try {
      navigator.clipboard.writeText(children)
      setCopying(true)
      
      setTimeout(() => {
        setCopying(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to copy", error)
    }
  }
  
  if (variant === "assistant") {
    return (
      <MessageAssistant
        isLast={isLast}
        hasScrollAnchor={hasScrollAnchor}
        copied={copying}
        copyToClipboard={copyContentToClipboard}
        onReload={onReload}
        audio={audio}
        bagoodex={bagoodex}
        image={image}
      >
        {children}
      </MessageAssistant>
    )
  }
  
  if (variant === "user") {
    return (
      <MessageUser
        id={id}
        hasScrollAnchor={hasScrollAnchor}
        copied={copying}
        copyToClipboard={copyContentToClipboard}
        onEdit={onEdit || (() => {})}
        onReload={onReload || (() => {})}
        onDelete={onDelete || (() => {})}
        attachments={attachments}
      >
        {children}
      </MessageUser>
    )
  }
  
  return null
}
