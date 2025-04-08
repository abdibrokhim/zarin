import { toast } from "@/components/ui/toast"
import * as fileType from "file-type"
import { DAILY_FILE_UPLOAD_LIMIT } from "./config"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
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

// Create a local file URL for the browser
export async function createLocalFileURL(file: File): Promise<string> {
  return URL.createObjectURL(file);
}

export function createAttachment(file: File, url: string): Attachment {
  return {
    name: file.name,
    contentType: file.type,
    url: url,
  }
}

// Save file info to IndexedDB
async function saveFileInfo(file: File, url: string, chatId: string, userId: string) {
  const timestamp = new Date().toISOString();
  const fileInfo = {
    chat_id: chatId,
    user_id: userId,
    file_url: url,
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    created_at: timestamp,
    id: `file_${Date.now()}_${Math.random().toString(36).substring(2)}`
  };

  try {
    const dbName = 'zarinchat_files';
    const storeName = 'attachments';
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function(event) {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };

    return new Promise((resolve, reject) => {
      request.onsuccess = function() {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const storeRequest = store.add(fileInfo);

        storeRequest.onsuccess = () => resolve(fileInfo);
        storeRequest.onerror = () => reject(new Error('Failed to save file info to IndexedDB'));

        transaction.oncomplete = () => db.close();
      };

      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
    });
  } catch (error) {
    console.error('Error saving file info:', error);
    throw error;
  }
}

export async function processFiles(
  files: File[],
  chatId: string,
  userId: string
): Promise<Attachment[]> {
  const attachments: Attachment[] = [];

  for (const file of files) {
    const validation = await validateFile(file);
    if (!validation.isValid) {
      console.warn(`File ${file.name} validation failed:`, validation.error);
      toast({
        title: "File validation failed",
        description: validation.error,
        status: "error",
      });
      continue;
    }

    try {
      // Create local URL for the file
      const url = await createLocalFileURL(file);
      
      // Save file info to IndexedDB
      await saveFileInfo(file, url, chatId, userId);

      const attachment = createAttachment(file, url);
      attachments.push(attachment);
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }

  return attachments;
}

export class FileUploadLimitError extends Error {
  code: string;
  constructor(message: string) {
    super(message);
    this.code = "DAILY_FILE_LIMIT_REACHED";
  }
}

export async function checkFileUploadLimit(userId: string) {
  try {
    const dbName = 'zarinchat_files';
    const storeName = 'attachments';
    const request = indexedDB.open(dbName, 1);

    return new Promise((resolve, reject) => {
      request.onupgradeneeded = function(event) {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = function() {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Since IndexedDB doesn't support direct filtering, we need to get all records and filter in-memory
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = function() {
          const files = getAllRequest.result;
          // Filter files by userId and created today
          const todayFiles = files.filter(file => {
            return file.user_id === userId && 
                  new Date(file.created_at) >= startOfToday;
          });
          
          const count = todayFiles.length;
          
          if (count >= DAILY_FILE_UPLOAD_LIMIT) {
            reject(new FileUploadLimitError("Daily file upload limit reached."));
          } else {
            resolve(count);
          }
          
          db.close();
        };
        
        getAllRequest.onerror = function() {
          reject(new Error("Failed to retrieve file count"));
          db.close();
        };
      };
      
      request.onerror = function() {
        reject(new Error("Failed to open database"));
      };
    });
  } catch (error) {
    console.error('Error checking file upload limit:', error);
    throw error;
  }
}
