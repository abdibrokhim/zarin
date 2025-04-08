import type { Tables } from "@/app/types/database.types"

export type Chat = Tables<"chats">
export type Message = Tables<"messages">
export type ChatHistory = Pick<Chat, "id" | "title" | "created_at">
