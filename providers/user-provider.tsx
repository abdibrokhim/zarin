"use client"

import { getUserData, incrementUsage } from "@/lib/api"
import { createContext, useContext, useEffect, useState } from "react"
import { UserProfile } from "@/types/user"

type UserContextType = {
  user: UserProfile | null
  isLoading: boolean
  updateUser: (updates: Partial<UserProfile>) => Promise<void>
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Local storage key for user data
const USER_STORAGE_KEY = 'zarinchat_user_id'

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: UserProfile | null
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize user from local storage or create a new one if needed
  useEffect(() => {
    const initUser = async () => {
      setIsLoading(true)
      try {
        // Get the user ID from localStorage
        let userId = localStorage.getItem(USER_STORAGE_KEY)
        
        // If no user ID exists, create one
        if (!userId) {
          userId = crypto.randomUUID()
          localStorage.setItem(USER_STORAGE_KEY, userId)
        }
        
        // Get the user data
        const userData = await getUserData(userId)
        setUser(userData as UserProfile)
      } catch (error) {
        console.error("Failed to initialize user:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initUser()
  }, [initialUser])

  // Refresh user data from local storage
  const refreshUser = async () => {
    setIsLoading(true)
    try {
      const userId = localStorage.getItem(USER_STORAGE_KEY)
      if (userId) {
        const userData = await getUserData(userId)
        setUser(userData as UserProfile)
      }
    } catch (err) {
      console.error("Failed to refresh user data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Update user data in local storage and state
  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      // Update local state
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      
      // Save to local storage
      localStorage.setItem(`user_${user.id}`, JSON.stringify(updatedUser))
    } catch (err) {
      console.error("Failed to update user:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out by clearing user data
  const signOut = async () => {
    setIsLoading(true)
    try {
      // Create a new user ID
      const userId = crypto.randomUUID()
      localStorage.setItem(USER_STORAGE_KEY, userId)
      
      // Initialize with fresh data
      const userData = await getUserData(userId)
      setUser(userData as UserProfile)
    } catch (err) {
      console.error("Failed to reset user:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <UserContext.Provider
      value={{ user, isLoading, updateUser, refreshUser, signOut }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
