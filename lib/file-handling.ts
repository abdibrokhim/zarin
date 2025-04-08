import { toast } from "@/components/ui/toast"
import { SupabaseClient } from "@supabase/supabase-js"
import * as fileType from "file-type"
import { DAILY_FILE_UPLOAD_LIMIT } from "./config"
import { createClient } from "./supabase/client"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/json",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

export type Attachment = {
  name: string
  contentType: string
  url: string
}

export async function validateFile(
  file: File
): Promise<{ isValid: boolean; error?: string }> {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
    }
  }

  const buffer = await file.arrayBuffer()
  const type = await fileType.fileTypeFromBuffer(
    Buffer.from(buffer.slice(0, 4100))
  )

  if (!type || !ALLOWED_FILE_TYPES.includes(type.mime)) {
    return {
      isValid: false,
      error: "File type not supported or doesn't match its extension",
    }
  }

  return { isValid: true }
}

export async function uploadFile(
  supabase: SupabaseClient,
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from("chat-attachments")
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Error uploading file: ${uploadError.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("chat-attachments").getPublicUrl(filePath)

  return publicUrl
}

export function createAttachment(file: File, url: string): Attachment {
  return {
    name: file.name,
    contentType: file.type,
    url: url,
  }
}

export async function processFiles(
  files: File[],
  chatId: string,
  userId: string
): Promise<Attachment[]> {
  const supabase = createClient()
  const attachments: Attachment[] = []

  for (const file of files) {
    const validation = await validateFile(file)
    if (!validation.isValid) {
      console.warn(`File ${file.name} validation failed:`, validation.error)
      toast({
        title: "File validation failed",
        description: validation.error,
        status: "error",
      })
      continue
    }

    try {
      const url = await uploadFile(supabase, file)

      const { error } = await supabase.from("chat_attachments").insert({
        chat_id: chatId,
        user_id: userId,
        file_url: url,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
      })

      if (error) throw new Error(`Database insertion failed: ${error.message}`)

      const attachment = createAttachment(file, url)
      attachments.push(attachment)
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error)
    }
  }

  return attachments
}

export class FileUploadLimitError extends Error {
  code: string
  constructor(message: string) {
    super(message)
    this.code = "DAILY_FILE_LIMIT_REACHED"
  }
}

export async function checkFileUploadLimit(userId: string) {
  const supabase = createClient()
  const now = new Date()
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
  const startOfTodayISO = startOfToday.toISOString()

  const { count, error } = await supabase
    .from("chat_attachments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfTodayISO)

  if (error) {
    throw new Error(error.message)
  }

  if (count && count >= DAILY_FILE_UPLOAD_LIMIT) {
    throw new FileUploadLimitError("Daily file upload limit reached.")
  }

  return count
}
