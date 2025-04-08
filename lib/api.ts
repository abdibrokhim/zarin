import {
  AUTH_DAILY_MESSAGE_LIMIT,
  NON_AUTH_DAILY_MESSAGE_LIMIT,
} from "./config"

export class UsageLimitError extends Error {
  code: string
  constructor(message: string) {
    super(message)
    this.code = "DAILY_LIMIT_REACHED"
  }
}

// Key for rate limit data in localStorage
const RATE_LIMIT_KEY = 'zarin_rate_limits'

/**
 * Creates a guest user with a local user ID
 */
export async function createGuestUser(guestId: string) {
  try {
    // Create a local user record
    const userData = {
      id: guestId,
      message_count: 0,
      daily_message_count: 0,
      daily_reset: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    
    localStorage.setItem(`user_${guestId}`, JSON.stringify(userData))
    return { user: userData }
  } catch (err) {
    console.error("Error creating guest user:", err)
    throw err
  }
}

/**
 * Check rate limits from local storage
 */
export async function checkRateLimits(
  userId: string,
  isAuthenticated: boolean
) {
  try {
    // Get or initialize rate limit data
    let userData = JSON.parse(localStorage.getItem(`user_${userId}`) || '{}')
    if (!userData.daily_message_count) {
      userData = {
        id: userId,
        message_count: 0,
        daily_message_count: 0,
        daily_reset: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
      localStorage.setItem(`user_${userId}`, JSON.stringify(userData))
    }
    
    // Check if we need to reset daily count
    const now = new Date()
    const lastReset = userData.daily_reset ? new Date(userData.daily_reset) : null
    
    if (
      !lastReset ||
      now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
      now.getUTCMonth() !== lastReset.getUTCMonth() ||
      now.getUTCDate() !== lastReset.getUTCDate()
    ) {
      userData.daily_message_count = 0
      userData.daily_reset = now.toISOString()
      localStorage.setItem(`user_${userId}`, JSON.stringify(userData))
    }
    
    const dailyLimit = isAuthenticated
      ? AUTH_DAILY_MESSAGE_LIMIT
      : NON_AUTH_DAILY_MESSAGE_LIMIT
    
    const dailyCount = userData.daily_message_count || 0
    const remaining = dailyLimit - dailyCount
    
    return { dailyCount, dailyLimit, remaining }
  } catch (err) {
    console.error("Error checking rate limits:", err)
    throw err
  }
}

/**
 * Increment usage count in local storage
 */
export async function incrementUsage(userId: string) {
  try {
    const userData = JSON.parse(localStorage.getItem(`user_${userId}`) || '{}')
    
    userData.message_count = (userData.message_count || 0) + 1
    userData.daily_message_count = (userData.daily_message_count || 0) + 1
    
    localStorage.setItem(`user_${userId}`, JSON.stringify(userData))
  } catch (err) {
    console.error("Error incrementing usage:", err)
    throw err
  }
}

/**
 * Updates the model for a chat (now handled in IndexedDB directly)
 */
export async function updateChatModel(chatId: string, model: string) {
  try {
    // This is now handled directly in the chat.ts file using IndexedDB
    return { success: true }
  } catch (error) {
    console.error("Error updating chat model:", error)
    throw error
  }
} 