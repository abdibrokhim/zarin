import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChatHistory } from "@/lib/chat-store/types"
import {
  Check,
  ListMagnifyingGlass,
  MagnifyingGlass,
  PencilSimple,
  TrashSimple,
  X,
} from "@phosphor-icons/react"
import Link from "next/link"
import { useState } from "react"

type DrawerHistoryProps = {
  chatHistory: ChatHistory[]
  onSaveEdit: (id: string, newTitle: string) => Promise<void>
  onConfirmDelete: (id: string) => Promise<void>
}

export function DrawerHistory({
  chatHistory,
  onSaveEdit,
  onConfirmDelete,
}: DrawerHistoryProps) {
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
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <button
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1.5 transition-colors"
              type="button"
            >
              <ListMagnifyingGlass size={24} />
            </button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent>History</TooltipContent>
      </Tooltip>
      <DrawerContent>
        <div className="flex h-full flex-col">
          <div className="border-b p-4 pb-3">
            <div className="relative">
              <Input
                placeholder="Search..."
                className="rounded-lg py-1.5 pl-8 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlass className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 transform text-gray-400" />
            </div>
          </div>

          <ScrollArea className="max-h-[480px] min-h-[480px] flex-1">
            <div className="flex flex-col space-y-2 px-4 py-4">
              {filteredChat.map((chat, index) => (
                <div key={index}>
                  <div className="space-y-1.5">
                    {editingId === chat.id ? (
                      <div className="bg-accent flex items-center justify-between rounded-lg px-2 py-2.5">
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
                            className="h-8 flex-1"
                            autoFocus
                          />
                          <div className="ml-2 flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              type="submit"
                            >
                              <Check className="size-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              type="button"
                              onClick={handleCancelEdit}
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </form>
                      </div>
                    ) : deletingId === chat.id ? (
                      <div className="bg-accent flex items-center justify-between rounded-lg px-2 py-2.5">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            handleConfirmDelete(chat.id)
                          }}
                          className="flex w-full items-center justify-between"
                        >
                          <div className="flex flex-1 items-center">
                            <span className="text-base font-normal">
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
                                }
                              }}
                            />
                          </div>
                          <div className="ml-2 flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-muted-foreground hover:text-destructive size-8"
                              type="submit"
                            >
                              <Check className="size-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-muted-foreground hover:text-destructive size-8"
                              onClick={handleCancelDelete}
                              type="button"
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="group flex items-center justify-between rounded-lg px-2 py-1.5">
                        <Link
                          href={`/c/${chat.id}`}
                          key={chat.id}
                          className="flex flex-1 flex-col items-start"
                        >
                          <span className="line-clamp-1 text-base font-normal">
                            {chat.title}
                          </span>
                          <span className="mr-2 text-xs font-normal text-gray-500">
                            {chat.created_at
                              ? new Date(chat.created_at).toLocaleDateString()
                              : "Unknown Date"}
                          </span>
                        </Link>
                        <div className="flex items-center">
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-muted-foreground hover:text-foreground size-8"
                              onClick={(e) => {
                                e.preventDefault()
                                handleEdit(chat)
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
                                e.preventDefault()
                                handleDelete(chat.id)
                              }}
                              type="button"
                            >
                              <TrashSimple className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
