"use client"

import { openDB, IDBPDatabase, DBSchema } from 'idb';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Database constants
const DB_NAME = 'zarin-db';
const DB_VERSION = 4; // Increment this when changing schema

// Define the database schema
interface ZarinDB extends DBSchema {
  chats: {
    key: string;
    value: any;
    indexes: { 'by-id': string };
  };
  messages: {
    key: string;
    value: any;
    indexes: { 'by-chat-id': string };
  };
  sync: {
    key: string;
    value: any;
  };
  users: {
    key: string;
    value: any;
  };
}

// Database instance
let dbPromise: Promise<IDBPDatabase<ZarinDB>> | null = null;

// Function to get and initialize the database
function getDB(): Promise<IDBPDatabase<ZarinDB>> {
  if (!isBrowser) {
    return Promise.reject(new Error('IndexedDB is not available outside the browser'));
  }

  if (!dbPromise) {
    dbPromise = openDB<ZarinDB>(DB_NAME, DB_VERSION, {
      upgrade(db: IDBPDatabase<ZarinDB>, oldVersion: number, newVersion: number | null) {
        console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
        
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('chats')) {
          const chatStore = db.createObjectStore('chats', { keyPath: 'id' });
          chatStore.createIndex('by-id', 'id');
        }
        
        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
          messageStore.createIndex('by-chat-id', 'chat_id');
        }
        
        if (!db.objectStoreNames.contains('sync')) {
          db.createObjectStore('sync', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
      },
      blocked() {
        console.warn('Database blocked: Another connection is blocking the upgrade');
      },
      blocking() {
        console.warn('Database blocking: This connection is blocking others from upgrading');
      },
      terminated() {
        console.error('Database terminated unexpectedly');
        dbPromise = null;
      }
    });
  }
  
  return dbPromise!; // Assert non-null since we've just initialized it if it was null
}

// Store names
const storeNames = ['chats', 'messages', 'sync', 'users'] as const;
type StoreName = typeof storeNames[number];

// Read one item by key from a store
export async function readFromIndexedDB<T>(
  table: StoreName,
  key?: string
): Promise<T | T[]> {
  if (!isBrowser) {
    return key ? (null as T) : [];
  }

  try {
    const db = await getDB();
    
    if (key) {
      // Get a single item by key
      return await db.get(table, key) as T;
    } else {
      // Get all items from the store
      return await db.getAll(table) as T[];
    }
  } catch (error) {
    console.error(`Error reading from ${table}:`, error);
    return key ? (null as T) : [];
  }
}

// Read messages by chat ID (using index)
export async function readMessagesByChatId<T>(chatId: string): Promise<T[]> {
  if (!isBrowser) {
    return [];
  }

  try {
    const db = await getDB();
    return await db.getAllFromIndex('messages', 'by-chat-id', chatId) as T[];
  } catch (error) {
    console.error(`Error reading messages for chat ${chatId}:`, error);
    return [];
  }
}

// Write one or multiple items to a store
export async function writeToIndexedDB<T extends { id: string | number }>(
  table: StoreName,
  data: T | T[]
): Promise<void> {
  if (!isBrowser) {
    return;
  }

  try {
    const db = await getDB();
    const tx = db.transaction(table, 'readwrite');
    const store = tx.objectStore(table);
    
    if (Array.isArray(data)) {
      // Handle bulk operations differently - first clear the store if we're replacing everything
      if (data.length > 10) { // Arbitrary threshold to detect a full replacement
        // Clear the store first to avoid id conflicts
        await store.clear();
      }
      
      // Then add all items with their ids
      for (const item of data) {
        if (!item.id) {
          console.error('Item without ID detected:', item);
          throw new Error(`Cannot write item without ID to store ${table}`);
        }
        await store.put(item);
      }
    } else {
      // Single item operation
      if (!data.id) {
        console.error('Item without ID detected:', data);
        throw new Error(`Cannot write item without ID to store ${table}`);
      }
      await store.put(data);
    }
    
    await tx.done;
  } catch (error) {
    console.error(`Error writing to ${table}:`, error);
    throw error;
  }
}

// Delete one or all items from a store
export async function deleteFromIndexedDB(
  table: StoreName,
  key?: string
): Promise<void> {
  if (!isBrowser) {
    return;
  }

  try {
    const db = await getDB();
    
    if (key) {
      // Delete a single item
      await db.delete(table, key);
    } else {
      // Clear the entire store
      await db.clear(table);
    }
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
}

// Clear all stores
export async function clearAllIndexedDBStores(): Promise<void> {
  if (!isBrowser) {
    return;
  }

  try {
    const db = await getDB();
    const tx = db.transaction(storeNames, 'readwrite');
    
    await Promise.all(storeNames.map(store => tx.objectStore(store).clear()));
    await tx.done;
    
    console.log('All stores cleared successfully');
  } catch (error) {
    console.error('Error clearing stores:', error);
    throw error;
  }
}
