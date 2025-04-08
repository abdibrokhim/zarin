// app/providers/user-provider.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { UserProfile } from "../types/user"

type UserContextType = {
  user: UserProfile | null
  isLoading: boolean
  updateUser: (updates: Partial<UserProfile>) => Promise<void>
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Local storage key for user data
const USER_STORAGE_KEY = 'zarinchat_user'

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: UserProfile | null
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize user from local storage if available
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    if (storedUser && !initialUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user data:', e)
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    }
  }, [initialUser])

  // Refresh user data from local storage
  const refreshUser = async () => {
    if (!user?.id) return

    // Since we're using local storage only, there's not much to refresh
    // But we keep the function for API compatibility
    setIsLoading(true)
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
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
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
    } catch (err) {
      console.error("Failed to update user:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out and reset user state
  const signOut = async () => {
    setIsLoading(true)
    try {
      // Remove from local storage
      localStorage.removeItem(USER_STORAGE_KEY)
      
      // Reset user state
      setUser(null)
    } catch (err) {
      console.error("Failed to sign out:", err)
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
