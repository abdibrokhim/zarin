import { Message } from "@ai-sdk/react"
import { readFromIndexedDB, readMessagesByChatId, writeToIndexedDB } from "./persist"

// Define a more flexible message type that accepts both string and number IDs
interface DBMessage {
  id: string | number;
  chat_id: string;
  content: string;
  role: "system" | "user" | "assistant" | "data";
  created_at: string | null;
  attachments?: any[];
  _deleted?: boolean;
}

// Load messages from local IndexedDB using the chat_id index
export async function getMessages(chatId: string): Promise<DBMessage[]> {
  try {
    // Use the chat_id index for more efficient querying
    const messages = await readMessagesByChatId<DBMessage>(chatId)
    
    // Filter out deleted messages
    const activeMessages = messages.filter(m => !m._deleted)
    
    // Sort messages by timestamp
    return activeMessages.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0)
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0)
      return dateA.getTime() - dateB.getTime()
    })
  } catch (error) {
    console.error(`Error fetching messages for chat ${chatId}:`, error)
    
    // Fallback to old method if index querying fails
    const all = await readFromIndexedDB<DBMessage>("messages")
    return (all as DBMessage[])
      .filter((m) => m.chat_id === chatId && !m._deleted)
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0)
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0)
        return dateA.getTime() - dateB.getTime()
      })
  }
}

// Convert AI SDK message to database message format
export function convertToDBMessage(message: Message, chatId: string): DBMessage {
  return {
    id: message.id,
    chat_id: chatId,
    content: message.content,
    role: message.role as "user" | "assistant" | "system" | "data",
    created_at: message.createdAt?.toISOString() || new Date().toISOString(),
    attachments: message.experimental_attachments
  };
}

// Convert database message to AI SDK message format
export function convertToSDKMessage(message: DBMessage): Message {
  return {
    id: String(message.id), // Ensure ID is a string for SDK
    content: message.content,
    role: message.role,
    createdAt: message.created_at ? new Date(message.created_at) : new Date(),
    experimental_attachments: message.attachments,
  }
}

// Save messages to IndexedDB
export async function syncMessages(
  chatId: string, 
  messages: Message[]
): Promise<void> {
  if (!messages.length) return;
  
  const dbMessages = messages.map(msg => convertToDBMessage(msg, chatId));
  await writeToIndexedDB("messages", dbMessages);
}

// Write single message to IndexedDB
export async function sendMessage(message: DBMessage): Promise<void> {
  if (!message.id) {
    message.id = crypto.randomUUID()
  }
  
  if (!message.created_at) {
    message.created_at = new Date().toISOString()
  }
  
  await writeToIndexedDB("messages", message)
}

// Update a message in the database
export async function updateMessage(chatId: string, messageId: string, content: string): Promise<void> {
  const message = await readFromIndexedDB<DBMessage>("messages", messageId);
  if (message) {
    await writeToIndexedDB("messages", {
      ...message,
      chat_id: chatId,
      content
    });
  }
}

// Delete a message from the database
export async function deleteMessage(chatId: string, messageId: string): Promise<void> {
  await writeToIndexedDB("messages", {
    id: messageId,
    chat_id: chatId,
    _deleted: true
  } as DBMessage);
}
