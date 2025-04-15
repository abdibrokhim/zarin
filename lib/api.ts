"use client"

import {
  DEFAULT_DAILY_MESSAGE_LIMIT,
} from "./config"

export class UsageLimitError extends Error {
  code: string
  constructor(message: string) {
    super(message)
    this.code = "DAILY_LIMIT_REACHED"
  }
}

// Key for user data in localStorage
const USER_DATA_KEY_PREFIX = 'user_'

/**
 * Creates a Zarin User with a local user ID
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
      display_name: "Guest User",
      email: "",
      preferred_model: null,
      profile_image: null,
      premium: false,
      anonymous: true,
    }
    
    localStorage.setItem(`${USER_DATA_KEY_PREFIX}${guestId}`, JSON.stringify(userData))
    return { user: userData }
  } catch (err) {
    console.error("Error creating Zarin User:", err)
    throw err
  }
}

/**
 * Check rate limits from local storage
 */
export async function checkRateLimits(userId: string) {
  try {
    // Get or initialize rate limit data
    let userData = JSON.parse(localStorage.getItem(`${USER_DATA_KEY_PREFIX}${userId}`) || '{}')
    
    if (!userData.id) {
      // Create a new user if none exists
      const result = await createGuestUser(userId)
      userData = result.user
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
      localStorage.setItem(`${USER_DATA_KEY_PREFIX}${userId}`, JSON.stringify(userData))
    }
    
    // Everyone uses the same limit now that we're not using auth
    const dailyLimit = DEFAULT_DAILY_MESSAGE_LIMIT
    
    const dailyCount = userData.daily_message_count || 0
    const remaining = dailyLimit - dailyCount
    
    return { dailyCount, dailyLimit, remaining, userData }
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
    // Check current limits first
    const { userData } = await checkRateLimits(userId)
    
    // Increment counts
    userData.message_count = (userData.message_count || 0) + 1
    userData.daily_message_count = (userData.daily_message_count || 0) + 1
    
    // Save updated user data
    localStorage.setItem(`${USER_DATA_KEY_PREFIX}${userId}`, JSON.stringify(userData))
    
    // Return the updated user data
    return userData
  } catch (err) {
    console.error("Error incrementing usage:", err)
    throw err
  }
}

/**
 * Get the current user data from localStorage
 */
export async function getUserData(userId: string) {
  try {
    const { userData } = await checkRateLimits(userId)
    return userData
  } catch (err) {
    console.error("Error getting user data:", err)
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