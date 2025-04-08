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

// define named object stores
const stores = {
  chats: createStore("zarin-db", "chats"),
  messages: createStore("zarin-db", "messages"),
  sync: createStore("zarin-db", "sync"),
}

// ensure stores are initialized (no-op read)
Object.values(stores).forEach((store) => {
  get("__init__", store).catch(() => {})
})

// read one or all items from a store
export async function readFromIndexedDB<T>(
  table: keyof typeof stores,
  key?: string
): Promise<T | T[]> {
  const store = stores[table]
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
  const store = stores[table]
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
  const store = stores[table]

  if (key) {
    await del(key, store)
  } else {
    const allKeys = await keys(store)
    await delMany(allKeys as string[], store)
  }
}

export async function clearAllIndexedDBStores() {
  await deleteFromIndexedDB("chats")
  await deleteFromIndexedDB("messages")
  await deleteFromIndexedDB("sync")
}
