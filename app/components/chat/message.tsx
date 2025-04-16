import { Message as MessageType, UseChatHelpers } from "@ai-sdk/react"
import React, { memo, useState } from "react"
import { MessageAssistant } from "./message-assistant"
import { MessageUser } from "./message-user"

export type MessageProps = {
  variant?: MessageType["role"]
  children?: string
  id?: string
  message?: MessageType
  chatId?: string
  isLoading?: boolean
  setMessages?: UseChatHelpers['setMessages']
  reload?: UseChatHelpers['reload'] | (() => void)
  isReadonly?: boolean
  attachments?: MessageType["experimental_attachments"]
  isLast?: boolean
  onDelete?: (id: string) => void
  onEdit?: (id: string, newText: string) => void
  onReload?: () => void
  hasScrollAnchor?: boolean
}

export function PureMessage({
  variant,
  children,
  id,
  message,
  attachments,
  isLast,
  onDelete,
  onEdit,
  onReload,
  hasScrollAnchor,
  isLoading,
}: MessageProps) {
  const [copied, setCopied] = useState(false)

  // If we're receiving a full message object, extract the needed properties
  const messageContent = children || (message?.content as string) || ""
  const messageId = id || message?.id || ""
  const messageRole = variant || message?.role || "user"
  const messageAttachments = attachments || message?.experimental_attachments

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 500)
  }

  if (messageRole === "user") {
    return (
      <MessageUser
        children={messageContent}
        copied={copied}
        copyToClipboard={copyToClipboard}
        onReload={onReload || (() => {})}
        onEdit={onEdit || ((id, text) => {})}
        onDelete={onDelete || ((id) => {})}
        id={messageId}
        hasScrollAnchor={hasScrollAnchor}
        attachments={messageAttachments}
      />
    )
  }

  if (messageRole === "assistant") {
    return (
      <MessageAssistant
        children={messageContent}
        copied={copied}
        copyToClipboard={copyToClipboard}
        onReload={onReload || (() => {})}
        isLast={isLast || isLoading}
        hasScrollAnchor={hasScrollAnchor}
      />
    )
  }

  return null
}

// Memo to prevent unnecessary re-renders
export const Message = memo(PureMessage);