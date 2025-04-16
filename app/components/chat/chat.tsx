"use client"

import type { Attachment, UIMessage } from 'ai';
import { Message, useChat } from "@ai-sdk/react"
import { ChatInput } from "@/app/components/chat-input/chat-input"
import { Conversation } from "@/app/components/chat/conversation"
import { useUser } from "@/providers/user-provider"
import { toast } from "sonner"
import { checkRateLimits, createGuestUser, updateChatModel } from "@/lib/api"
import { useChatHistory } from "@/lib/chat/chat-history-provider"
import {
  MESSAGE_MAX_LENGTH,
  MODEL_DEFAULT,
  SYSTEM_PROMPT_DEFAULT,
} from "@/lib/models/config"
import {
  Attachment as LocalAttachment,
  checkFileUploadLimit,
  processFiles,
} from "@/lib/chat/file-handling"
import { FIFTY_REMAINING_QUERY_ALERT_THRESHOLD, TEN_REMAINING_QUERY_ALERT_THRESHOLD } from "@/lib/config"
import { syncMessages, deleteMessage, updateMessage } from "@/lib/chat/message"
import { API_ROUTE_CHAT } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useState } from "react"
import { DataStreamHandler } from "@/components/common/artifacts/data-stream-handler"
import { Artifact, artifactDefinitions } from "@/components/common/artifacts/artifact"
import { useArtifact } from "@/hooks/use-artifact"

const FeedbackWidget = dynamic(
  () => import("./feedback-widget").then((mod) => mod.FeedbackWidget),
  { ssr: false }
)

type ChatProps = {
  initialMessages?: Array<UIMessage>
  chatId?: string
  preferredModel?: string
  systemPrompt?: string
}

export default function Chat({
  initialMessages,
  chatId: propChatId,
  preferredModel,
  systemPrompt: propSystemPrompt,
}: ChatProps) {
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasDialogAuth, setHasDialogAuth] = useState(false)
  const [chatId, setChatId] = useState<string | null>(propChatId || null)
  const [files, setFiles] = useState<File[]>([]) // NOTE: files are attachments
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [selectedModel, setSelectedModel] = useState(
    preferredModel || user?.preferred_model || MODEL_DEFAULT
  )
  const [systemPrompt, setSystemPrompt] = useState(propSystemPrompt)
  const { createNewChat } = useChatHistory()
  const artifactStore = useArtifact();
  const isArtifactVisible = artifactStore.artifact.isVisible;
  const isCodeArtifactVisible = isArtifactVisible && artifactStore.artifact.kind === 'code';

  const {
    messages,
    input,
    handleSubmit,
    status,
    error,
    reload,
    stop,
    setMessages,
    setInput,
    append,
  } = useChat({
    api: API_ROUTE_CHAT,
    initialMessages,
    onError: () => {
      toast.error('An error occurred, please try again!');
    },
  })

  const isFirstMessage = useMemo(() => {
    return messages.length === 0
  }, [messages])

  useEffect(() => {
    if (error) {
      let errorMsg = "Something went wrong."
      try {
        const parsed = JSON.parse(error.message)
        errorMsg = parsed.error || errorMsg
      } catch {
        errorMsg = error.message || errorMsg
      }
      toast.error(errorMsg)
    }
  }, [error])

  const getOrCreateGuestUserId = async (): Promise<string | null> => {
    if (user?.id) return user.id

    const stored = localStorage.getItem("guestId")
    if (stored) return stored

    const guestId = crypto.randomUUID()
    localStorage.setItem("guestId", guestId)
    await createGuestUser(guestId)
    return guestId
  }

  const checkLimitsAndNotify = async (uid: string): Promise<boolean> => {
    try {
      const rateData = await checkRateLimits(uid)

      if (rateData.remaining === 0) {
        setHasDialogAuth(true)
        return false
      }

      if (rateData.remaining === TEN_REMAINING_QUERY_ALERT_THRESHOLD) {
        toast.info(`Only ${rateData.remaining} query${rateData.remaining.toString() === "1" ? "" : "ies"} remaining today.`)
      }

      if (rateData.remaining === FIFTY_REMAINING_QUERY_ALERT_THRESHOLD) {
        toast.info(`Only ${rateData.remaining} query${rateData.remaining.toString() === "1" ? "" : "ies"} remaining today.`)
      }

      return true
    } catch (err) {
      console.error("Rate limit check failed:", err)
      return false
    }
  }

  const ensureChatExists = async (userId: string) => {
    if (isFirstMessage) {
      try {
        const newChat = await createNewChat(
          userId,
          input,
          selectedModel,
          systemPrompt
        )
        if (!newChat) return null
        setChatId(newChat.id)
        return newChat.id
      } catch (err: any) {
        let errorMessage = "Something went wrong."
        try {
          const parsed = JSON.parse(err.message)
          errorMessage = parsed.error || errorMessage
        } catch {
          errorMessage = err.message || errorMessage
        }
        toast.error(errorMessage)
        return null
      }
    }
    return chatId
  }

  const handleModelChange = useCallback(
    async (model: string) => {
      // Update local state immediately for UI responsiveness
      setSelectedModel(model);
      
      // If there's no active chat yet, just update the local state
      if (!chatId) return;
      
      const oldModel = selectedModel;

      try {
        // Update the model in the database
        await updateChatModel(chatId, model);
        
        // If there are messages, we need to notify the user that model changes will apply to new messages
        if (messages.length > 0) {
          toast.info("Model updated for new messages")
        }
      } catch (err) {
        console.error("Failed to update chat model:", err);
        setSelectedModel(oldModel);
        toast.error("Failed to update chat model")
      }
    },
    [chatId, selectedModel, messages.length]
  )

  const handleFileUploads = async (
    uid: string,
    chatId: string
  ): Promise<Attachment[] | null> => {
    if (files.length === 0) return []

    try {
      await checkFileUploadLimit(uid)
    } catch (err: any) {
      if (err.code === "DAILY_FILE_LIMIT_REACHED") {
        toast.error(err.message)
        return null
      }
    }

    try {
      const processed = await processFiles(files, chatId, uid)
      setFiles([])
      return processed
    } catch (err) {
      toast.error("Failed to process files")
      return null
    }
  }

  const createOptimisticAttachments = (files: File[]) => {
    return files.map((file) => ({
      name: file.name,
      contentType: file.type,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }))
  }

  const cleanupOptimisticAttachments = (attachments?: any[]) => {
    if (!attachments) return
    attachments.forEach((attachment) => {
      if (attachment.url?.startsWith("blob:")) {
        URL.revokeObjectURL(attachment.url)
      }
    })
  }

  const submit = async () => {
    setIsSubmitting(true)

    const uid = await getOrCreateGuestUserId()
    if (!uid) return

    const optimisticId = `optimistic-${Date.now().toString()}`
    const optimisticAttachments =
      files.length > 0 ? createOptimisticAttachments(files) : []

    const optimisticMessage = {
      id: optimisticId,
      content: input,
      role: "user" as const,
      createdAt: new Date(),
      experimental_attachments:
        optimisticAttachments.length > 0 ? optimisticAttachments : undefined,
    }

    setMessages((prev) => [...prev, optimisticMessage])
    setInput("")

    const submittedFiles = [...files]
    setFiles([])

    const allowed = await checkLimitsAndNotify(uid)
    if (!allowed) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
      cleanupOptimisticAttachments(optimisticMessage.experimental_attachments)
      setIsSubmitting(false)
      return
    }

    const currentChatId = await ensureChatExists(uid)
    if (!currentChatId) {
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
      cleanupOptimisticAttachments(optimisticMessage.experimental_attachments)
      setIsSubmitting(false)
      return
    }

    if (input.length > MESSAGE_MAX_LENGTH) {
      toast.error(`The message you submitted was too long, please submit something shorter. (Max ${MESSAGE_MAX_LENGTH} characters)`)
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
      cleanupOptimisticAttachments(optimisticMessage.experimental_attachments)
      setIsSubmitting(false)
      return
    }

    let attachments: Attachment[] | null = []
    if (submittedFiles.length > 0) {
      attachments = await handleFileUploads(uid, currentChatId)
      if (attachments === null) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
        cleanupOptimisticAttachments(optimisticMessage.experimental_attachments)
        setIsSubmitting(false)
        return
      }
    }

    const options = {
      body: {
        chatId: currentChatId,
        userId: uid,
        model: selectedModel,
        systemPrompt: systemPrompt || SYSTEM_PROMPT_DEFAULT,
      },
      experimental_attachments: attachments || undefined,
    }

    try {
      // Logging to help debug model selection
      console.log(`Submitting message with model: ${selectedModel}`);
      
      handleSubmit(undefined, options)
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
      cleanupOptimisticAttachments(optimisticMessage.experimental_attachments)
      
      // Sync messages with IndexedDB after the AI responds
      setTimeout(() => {
        if (currentChatId) {
          syncMessages(currentChatId, messages)
            .catch(err => console.error("Failed to sync messages:", err));
        }
      }, 1000); // Give a slight delay to ensure the AI response is included
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
      cleanupOptimisticAttachments(optimisticMessage.experimental_attachments)
      toast.error("Failed to send message")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (!chatId) return
      
      // Update messages locally
      setMessages((prev) => prev.filter((message) => message.id !== id))
      
      // Then delete from storage
      await deleteMessage(chatId, id)
    } catch (err) {
      console.error("Error deleting message:", err)
      toast.error("Failed to delete message")
    }
  }

  const handleEdit = async (id: string, newText: string) => {
    try {
      if (!chatId) return
      
      // First update messages locally
      setMessages((prev) =>
        prev.map((message) => {
          if (message.id === id) {
            return {
              ...message,
              content: newText,
            }
          }
          return message
        })
      )
      
      // Then update in storage
      await updateMessage(chatId, id, newText)
      
      // Then request regeneration of the next assistant message
      const messageIndex = messages.findIndex((m) => m.id === id)
      if (messageIndex !== -1) {
        // If this is not the last message and the next message is from the assistant
        if (
          messageIndex < messages.length - 1 &&
          messages[messageIndex + 1].role === "assistant"
        ) {
          // Remove all messages after this one and regenerate
          const messagesUntilEdited = messages.slice(0, messageIndex + 1)
          setMessages(messagesUntilEdited)
          await reload()
        }
      }
    } catch (err) {
      console.error("Error editing message:", err)
      toast.error("Failed to edit message")
    }
  }

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value)
    },
    [setInput]
  )

  const handleFileUpload = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleFileRemove = useCallback((file: File) => {
    setFiles((prev) => prev.filter((f) => f !== file))
  }, [])

  const handleSuggestion = useCallback(
    async (suggestion: string) => {
      setIsSubmitting(true)
      const optimisticId = `optimistic-${Date.now().toString()}`
      const optimisticMessage = {
        id: optimisticId,
        content: suggestion,
        role: "user" as const,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, optimisticMessage])

      const uid = await getOrCreateGuestUserId()

      if (!uid) {
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
        setIsSubmitting(false)
        return
      }

      const allowed = await checkLimitsAndNotify(uid)
      if (!allowed) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
        setIsSubmitting(false)
        return
      }

      const currentChatId = await ensureChatExists(uid)

      if (!currentChatId) {
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
        setIsSubmitting(false)
        return
      }

      const options = {
        body: {
          chatId: currentChatId,
          userId: uid,
          model: selectedModel,
          systemPrompt: SYSTEM_PROMPT_DEFAULT,
        },
      }

      append(
        {
          role: "user",
          content: suggestion,
        },
        options
      )
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
      setIsSubmitting(false)
    },
    [ensureChatExists, selectedModel, user?.id, append]
  )

  const handleSystemPromptChange = (systemPrompt: string) => {
    setSystemPrompt(systemPrompt)
  }

  const handleSelectSystemPrompt = (systemPrompt: string) => {
    setSystemPrompt(systemPrompt)
  }

  const handleReload = async () => {
    await reload();
  }

  // Detect code blocks in messages and open code artifact if needed
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        // Check if message contains code block
        const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
        const match = codeBlockRegex.exec(lastMessage.content as string);
        
        if (match && !isArtifactVisible) {
          const language = match[1] || 'python';
          const code = match[2];
          
          // Only open artifact for code of sufficient size or complexity
          if (code.length > 50) {
            // Create a code artifact with the detected code
            artifactStore.setArtifact(draft => ({
              ...draft,
              documentId: crypto.randomUUID(),
              kind: 'code',
              content: code,
              title: `${language} code`,
              isVisible: true,
              status: 'idle',
              boundingBox: {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
              }
            }));
          }
        }
      }
    }
  }, [messages, isArtifactVisible, artifactStore]);

  // Function to run code in the artifact
  const runCodeArtifact = useCallback(() => {
    // Find the code action with Play icon
    const codeAction = artifactDefinitions
      .find(def => def.kind === 'code')
      ?.actions?.find(action => action.description === 'Execute code');
    
    if (codeAction && artifactStore.metadata) {
      try {
        // Ensure the outputs property exists in metadata
        if (!artifactStore.metadata.outputs) {
          artifactStore.setMetadata(current => ({
            ...current,
            outputs: []
          }));
        }
        
        codeAction.onClick({
          content: artifactStore.artifact.content,
          setMetadata: artifactStore.setMetadata,
          currentVersionIndex: 0,
          isCurrentVersion: true,
          metadata: {
            outputs: artifactStore.metadata.outputs || []
          },
          mode: 'edit',
          handleVersionChange: () => {},
        });
      } catch (error) {
        console.error("Error running code:", error);
        toast.error("Failed to run code. Please try again.");
      }
    }
  }, [artifactStore.artifact.content, artifactStore.setMetadata, artifactStore.metadata]);

  return (
    <>
      <div
        className={cn(
          "@container/main relative flex h-full flex-col items-center justify-end md:justify-center"
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {isFirstMessage ? (
            <motion.div
              key="onboarding"
              className="absolute bottom-[60%] mx-auto max-w-[50rem] md:relative md:bottom-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.6 }}
              layout="position"
              layoutId="onboarding"
            >
              <h1 className="mb-6 text-3xl font-medium tracking-tight">
                What can I help with?
              </h1>
            </motion.div>
          ) : (
            <Conversation
              key="conversation"
              messages={messages}
              status={status}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onReload={handleReload}
              isArtifactVisible={isArtifactVisible}
            />
          )}
        </AnimatePresence>
        
        {chatId && <DataStreamHandler id={chatId} />}
        
        <motion.div
          className={cn(
            "relative inset-x-0 bottom-0 z-50 mx-auto w-full max-w-3xl"
          )}
          layout="position"
          layoutId="chat-input-container"
          transition={{
            layout: {
              duration: messages.length === 1 ? 0.3 : 0,
            },
          }}
        >
          <ChatInput
            value={input}
            onSuggestion={handleSuggestion}
            onValueChange={handleInputChange}
            onSend={submit}
            isSubmitting={isSubmitting}
            files={files}
            onFileUpload={handleFileUpload}
            onFileRemove={handleFileRemove}
            hasSuggestions={isFirstMessage}
            onSelectModel={handleModelChange}
            onSelectSystemPrompt={handleSelectSystemPrompt}
            selectedModel={selectedModel}
            systemPrompt={systemPrompt}
            stop={stop}
            status={status}
            toggleArtifactVisibility={artifactStore.toggleVisibility}
            isCodeArtifactVisible={isCodeArtifactVisible}
            runCodeArtifact={runCodeArtifact}
          />
        </motion.div>
        <FeedbackWidget />
      </div>
      {isArtifactVisible && chatId && (
        <Artifact
          chatId={chatId}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          append={append}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={false}
        />
      )}
    </>
  )
}
