import { Message } from "@ai-sdk/react"
import { readFromIndexedDB, readMessagesByChatId, writeToIndexedDB } from "./persist"
import { ModelType } from "@/lib/models/types";

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

// Legacy functions - keeping for backward compatibility
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

// Legacy update message function
export async function updateMessage(id: string, content: string): Promise<void> {
  const message = await readFromIndexedDB<DBMessage>("messages", id);
  if (message) {
    await writeToIndexedDB("messages", {
      ...message,
      content
    });
  }
}

// Legacy delete message function
export async function deleteMessage(id: string): Promise<void> {
  await writeToIndexedDB("messages", {
    id,
    _deleted: true
  } as DBMessage);
}

export interface MessageAttachment {
  name: string;
  contentType: string;
  url: string;
}

export interface AudioAttachment {
  audioBlob?: Blob;
  base64Audio?: string;
  model: string;
  text: string;
}

export interface ExtendedMessage {
  id: string;
  content: string;
  role: "user" | "assistant" | "system" | "function";
  createdAt?: Date;
  experimental_attachments?: MessageAttachment[];
  audio?: AudioAttachment;
  modelType?: ModelType;
  timestamp?: number; // Adding timestamp as it's used in sorting
}

// New methods for ExtendedMessage handling with separate storage
export const saveMessageToIndexedDB = async (chatId: string, message: ExtendedMessage): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("chatDatabase", 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("messages")) {
        db.createObjectStore("messages", { keyPath: "id" });
      }
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["messages"], "readwrite");
      const store = transaction.objectStore("messages");
      
      // Add chatId to the message object
      const messageWithChatId = {
        ...message,
        chatId,
        timestamp: Date.now()
      };
      
      const addRequest = store.put(messageWithChatId);
      
      addRequest.onsuccess = () => {
        resolve(true);
      };
      
      addRequest.onerror = () => {
        reject(new Error("Failed to save message"));
      };
    };
    
    request.onerror = () => {
      reject(new Error("Failed to open database"));
    };
  });
};

export const getMessagesForChat = async (chatId: string): Promise<ExtendedMessage[]> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("chatDatabase", 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("messages")) {
        db.createObjectStore("messages", { keyPath: "id" });
      }
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["messages"], "readonly");
      const store = transaction.objectStore("messages");
      
      // Use IDBKeyRange to find messages with the matching chatId
      const messages: ExtendedMessage[] = [];
      
      // Create an index on chatId if it doesn't exist
      if (!store.indexNames.contains("chatId")) {
        // If we need to create an index, we need to close this transaction and create a new one
        transaction.abort();
        const upgradeTransaction = db.transaction(["messages"], "readwrite");
        const upgradeStore = upgradeTransaction.objectStore("messages");
        upgradeStore.createIndex("chatId", "chatId", { unique: false });
        upgradeTransaction.oncomplete = () => {
          // Now query with the index
          const newTransaction = db.transaction(["messages"], "readonly");
          const newStore = newTransaction.objectStore("messages");
          const index = newStore.index("chatId");
          const request = index.openCursor(IDBKeyRange.only(chatId));
          
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
              messages.push(cursor.value);
              cursor.continue();
            } else {
              // Sort messages by timestamp
              messages.sort((a, b) => {
                return (a.timestamp || 0) - (b.timestamp || 0);
              });
              resolve(messages);
            }
          };
          
          request.onerror = () => {
            reject(new Error("Failed to retrieve messages"));
          };
        };
      } else {
        // If the index already exists, use it directly
        const index = store.index("chatId");
        const request = index.openCursor(IDBKeyRange.only(chatId));
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            messages.push(cursor.value);
            cursor.continue();
          } else {
            // Sort messages by timestamp
            messages.sort((a, b) => {
              return (a.timestamp || 0) - (b.timestamp || 0);
            });
            resolve(messages);
          }
        };
        
        request.onerror = () => {
          reject(new Error("Failed to retrieve messages"));
        };
      }
    };
    
    request.onerror = () => {
      reject(new Error("Failed to open database"));
    };
  });
};

// New delete message function for ExtendedMessage store
export const deleteExtendedMessage = async (messageId: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("chatDatabase", 1);
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["messages"], "readwrite");
      const store = transaction.objectStore("messages");
      
      const deleteRequest = store.delete(messageId);
      
      deleteRequest.onsuccess = () => {
        resolve(true);
      };
      
      deleteRequest.onerror = () => {
        reject(new Error("Failed to delete message"));
      };
    };
    
    request.onerror = () => {
      reject(new Error("Failed to open database"));
    };
  });
};

// New update message function for ExtendedMessage store
export const updateExtendedMessage = async (messageId: string, newContent: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("chatDatabase", 1);
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["messages"], "readwrite");
      const store = transaction.objectStore("messages");
      
      // First get the message
      const getRequest = store.get(messageId);
      
      getRequest.onsuccess = () => {
        const message = getRequest.result;
        if (!message) {
          reject(new Error("Message not found"));
          return;
        }
        
        // Update the content
        message.content = newContent;
        
        // Save it back
        const updateRequest = store.put(message);
        
        updateRequest.onsuccess = () => {
          resolve(true);
        };
        
        updateRequest.onerror = () => {
          reject(new Error("Failed to update message"));
        };
      };
      
      getRequest.onerror = () => {
        reject(new Error("Failed to get message"));
      };
    };
    
    request.onerror = () => {
      reject(new Error("Failed to open database"));
    };
  });
};

// New sync messages function for ExtendedMessage store
export const syncExtendedMessages = async (chatId: string, messages: any[]): Promise<boolean> => {
  try {
    // First get all existing messages for this chat
    const existingMessages = await getMessagesForChat(chatId);
    
    // Create a map of existing message IDs for quick lookup
    const existingMessageIds = new Set(existingMessages.map(m => m.id));
    
    // Save any new messages
    const savePromises = messages
      .filter(m => !existingMessageIds.has(m.id))
      .map(message => saveMessageToIndexedDB(chatId, message));
    
    await Promise.all(savePromises);
    return true;
  } catch (error) {
    console.error("Error syncing messages:", error);
    return false;
  }
};
