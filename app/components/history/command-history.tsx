import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ChatHistory } from "@/lib/chat-store/types"
import { cn } from "@/lib/utils"
import {
  Check,
  ListMagnifyingGlass,
  PencilSimple,
  TrashSimple,
  X,
} from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type CommandHistoryProps = {
  chatHistory: ChatHistory[]
  onSaveEdit: (id: string, newTitle: string) => Promise<void>
  onConfirmDelete: (id: string) => Promise<void>
}

export function CommandHistory({
  chatHistory,
  onSaveEdit,
  onConfirmDelete,
}: CommandHistoryProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setSearchQuery("")
      setEditingId(null)
      setEditTitle("")
      setDeletingId(null)
    }
  }

  const handleEdit = (chat: ChatHistory) => {
    setEditingId(chat.id)
    setEditTitle(chat.title || "")
  }

  const handleSaveEdit = async (id: string) => {
    setEditingId(null)
    await onSaveEdit(id, editTitle)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
  }

  const handleConfirmDelete = async (id: string) => {
    setDeletingId(null)
    await onConfirmDelete(id)
  }

  const handleCancelDelete = () => {
    setDeletingId(null)
  }

  const filteredChat = chatHistory.filter((chat) =>
    (chat.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1.5 transition-colors"
            type="button"
          >
            <ListMagnifyingGlass size={24} />
          </button>
        </TooltipTrigger>
        <TooltipContent>History</TooltipContent>
      </Tooltip>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Chat History"
        description="Search through your past conversations"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search history..."
            value={searchQuery}
            onValueChange={(value) => setSearchQuery(value)}
          />
          <CommandList className="max-h-[480px] min-h-[480px] flex-1">
            {filteredChat.length === 0 && (
              <CommandEmpty>No chat history found.</CommandEmpty>
            )}
            <CommandGroup className="p-1.5">
              {filteredChat.map((chat) => (
                <div key={chat.id} className="px-0 py-1">
                  {editingId === chat.id ? (
                    <div className="bg-accent flex items-center justify-between rounded-lg px-2 py-2">
                      <form
                        className="flex w-full items-center justify-between"
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleSaveEdit(chat.id)
                        }}
                      >
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border-input h-8 flex-1 rounded border bg-transparent px-3 py-1 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleSaveEdit(chat.id)
                            }
                          }}
                        />
                        <div className="ml-2 flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground size-8"
                            type="submit"
                          >
                            <Check className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground size-8"
                            type="button"
                            onClick={handleCancelEdit}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : deletingId === chat.id ? (
                    <div className="bg-accent flex items-center justify-between rounded-lg px-2 py-2">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleConfirmDelete(chat.id)
                        }}
                        className="flex w-full items-center justify-between"
                      >
                        <div className="flex flex-1 items-center">
                          <span className="line-clamp-1 text-base font-normal">
                            {chat.title}
                          </span>
                          <input
                            type="text"
                            className="sr-only"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                e.preventDefault()
                                handleCancelDelete()
                              } else if (e.key === "Enter") {
                                e.preventDefault()
                                handleConfirmDelete(chat.id)
                              }
                            }}
                          />
                        </div>
                        <div className="ml-2 flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive-foreground hover:bg-destructive-foreground/10 size-8"
                            type="submit"
                          >
                            <Check className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground size-8"
                            onClick={handleCancelDelete}
                            type="button"
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <CommandItem
                      key={chat.id}
                      onSelect={() => {
                        if (!editingId && !deletingId) {
                          router.push(`/c/${chat.id}`)
                        }
                      }}
                      className={cn(
                        "group hover:bg-accent! flex w-full items-center justify-between rounded-md data-[selected=true]:bg-transparent",
                        Boolean(editingId || deletingId) &&
                          "hover:bg-transparent! data-[selected=true]:bg-transparent"
                      )}
                      value={chat.title || "Untitled Chat"}
                    >
                      <div className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-base font-normal">
                          {chat?.title || "Untitled Chat"}
                        </span>
                      </div>

                      {/* Date and actions container with fixed width */}
                      <div className="relative flex min-w-[120px] flex-shrink-0 justify-end">
                        {/* Date that shows by default but hides on hover */}
                        <span
                          className={cn(
                            "text-muted-foreground text-base font-normal transition-opacity duration-0 group-hover:opacity-0",
                            Boolean(editingId || deletingId) &&
                              "group-hover:opacity-100"
                          )}
                        >
                          {chat?.created_at
                            ? new Date(chat.created_at).toLocaleDateString()
                            : "No date"}
                        </span>

                        {/* Action buttons that appear on hover, positioned over the date */}
                        <div
                          className={cn(
                            "absolute inset-0 flex items-center justify-end gap-1 opacity-0 transition-opacity duration-0 group-hover:opacity-100",
                            Boolean(editingId || deletingId) &&
                              "group-hover:opacity-0"
                          )}
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground size-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (chat) handleEdit(chat)
                            }}
                            type="button"
                          >
                            <PencilSimple className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive size-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (chat?.id) handleDelete(chat.id)
                            }}
                            type="button"
                          >
                            <TrashSimple className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </CommandItem>
                  )}
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
