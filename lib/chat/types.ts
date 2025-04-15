import { Tables } from "@/app/types/database.types"

export type DBChat = Tables<"chats">
export type DBMessage = Tables<"messages">

export interface ChatHistory {
  id: string
  title: string
  created_at: string
  _deleted?: boolean
}

export interface Chat extends ChatHistory {
  user_id: string
  model: string
  system_prompt: string
}
