"use client"

import {
  createStore,
  del,
  delMany,
  get,
  getMany,
  keys,
  set,
  setMany,
} from "idb-keyval"

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

// Initialize the database with all required stores
async function initializeDatabase() {
  if (!isBrowser || !window.indexedDB) return;
  
  try {
    // Create or open the database with a new version
    const DB_NAME = "zarin-db";
    const DB_VERSION = 2; // Increment this when adding new stores
    
    // First, check what version we have currently
    const checkRequest = window.indexedDB.open(DB_NAME);
    let currentVersion = 0;
    
    await new Promise<void>((resolve, reject) => {
      checkRequest.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        currentVersion = db.version;
        db.close();
        resolve();
      };
      
      checkRequest.onerror = () => {
        reject(new Error("Could not check database version"));
      };
    });
    
    // Only upgrade if needed
    if (currentVersion < DB_VERSION) {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains("chats")) {
          db.createObjectStore("chats", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("messages")) {
          db.createObjectStore("messages", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("sync")) {
          db.createObjectStore("sync", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "id" });
        }
      };
      
      await new Promise<void>((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`Database upgraded to version ${DB_VERSION}`);
          request.result.close();
          resolve();
        };
        
        request.onerror = () => {
          console.error("Error upgrading database");
          reject(new Error("Error upgrading database"));
        };
      });
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Define stores after database initialization
const stores = isBrowser
  ? {
      chats: createStore("zarin-db", "chats"),
      messages: createStore("zarin-db", "messages"),
      sync: createStore("zarin-db", "sync"),
      users: createStore("zarin-db", "users"),
    }
  : {
      chats: null,
      messages: null,
      sync: null,
      users: null,
    }

// Initialize the database and stores
if (isBrowser) {
  initializeDatabase().catch(err => console.error("Failed to initialize database:", err));
  
  // Ensure stores are initialized (no-op read)
  Object.values(stores).forEach((store) => {
    if (store) {
      get("__init__", store).catch(() => {})
    }
  })
}

// read one or all items from a store
export async function readFromIndexedDB<T>(
  table: keyof typeof stores,
  key?: string
): Promise<T | T[]> {
  // Return empty results if not in browser
  if (!isBrowser) {
    return key ? (null as T) : []
  }
  
  const store = stores[table]
  if (!store) {
    return key ? (null as T) : []
  }
  
  if (key) {
    const item = await get<T>(key, store)
    return item as T
  }

  const allKeys = await keys(store)
  const values = await getMany<T>(allKeys as string[], store)
  return values
}

// write one or multiple items to a store
export async function writeToIndexedDB<T extends { id: string | number }>(
  table: keyof typeof stores,
  data: T | T[]
): Promise<void> {
  // No-op if not in browser
  if (!isBrowser) {
    return
  }
  
  const store = stores[table]
  if (!store) {
    return
  }
  
  const entries: [IDBValidKey, T][] = Array.isArray(data)
    ? data.map((item) => [item.id, item])
    : [[data.id, data]]

  await setMany(entries, store)
}

// delete one or all items from a store
export async function deleteFromIndexedDB(
  table: keyof typeof stores,
  key?: string
): Promise<void> {
  // No-op if not in browser
  if (!isBrowser) {
    return
  }
  
  const store = stores[table]
  if (!store) {
    return
  }

  if (key) {
    await del(key, store)
  } else {
    const allKeys = await keys(store)
    await delMany(allKeys as string[], store)
  }
}

export async function clearAllIndexedDBStores() {
  // No-op if not in browser
  if (!isBrowser) {
    return
  }
  
  await deleteFromIndexedDB("chats")
  await deleteFromIndexedDB("messages")
  await deleteFromIndexedDB("sync")
  await deleteFromIndexedDB("users")
}
