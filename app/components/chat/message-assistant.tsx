import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message"
import { cn } from "@/lib/utils"
import { ArrowClockwise, Check, Copy } from "@phosphor-icons/react"
import { AudioPlayer } from "./AudioPlayer"
import { AudioAttachment, BagoodexAttachment } from "@/lib/chat/message"
import { BagoodexStreamingResults } from "@/components/bagoodex"

type MessageAssistantProps = {
  children: string
  isLast?: boolean
  hasScrollAnchor?: boolean
  copied?: boolean
  copyToClipboard?: () => void
  onReload?: () => void
  audio?: AudioAttachment
  bagoodex?: BagoodexAttachment
}

export function MessageAssistant({
  children,
  isLast,
  hasScrollAnchor,
  copied,
  copyToClipboard,
  onReload,
  audio,
  bagoodex
}: MessageAssistantProps) {
  return (
    <Message
      className={cn(
        "group flex w-full max-w-3xl flex-1 items-start gap-4 px-6 pb-2",
        hasScrollAnchor && "min-h-scroll-anchor"
      )}
    >
      <div className={cn("flex min-w-full flex-col gap-2", isLast && "pb-8")}>
        <MessageContent
          className="prose dark:prose-invert relative min-w-full bg-transparent p-0"
          markdown={true}
        >
          {children}
        </MessageContent>

        {audio && (
          <AudioPlayer audio={audio} />
        )}

        {bagoodex && (
          <div className="mt-4 pt-2 border-t">
            <BagoodexStreamingResults query={bagoodex.query} />
          </div>
        )}

        <MessageActions
          className={cn(
            "flex gap-0 opacity-0 transition-opacity group-hover:opacity-100"
          )}
        >
          <MessageAction
            tooltip={copied ? "Copied!" : "Copy text"}
            side="bottom"
            delayDuration={0}
          >
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition"
              aria-label="Copy text"
              onClick={copyToClipboard}
              type="button"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </MessageAction>
          <MessageAction tooltip="Regenerate" side="bottom" delayDuration={0}>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition"
              aria-label="Regenerate"
              onClick={onReload}
              type="button"
            >
              <ArrowClockwise className="size-4" />
            </button>
          </MessageAction>
        </MessageActions>
      </div>
    </Message>
  )
}
