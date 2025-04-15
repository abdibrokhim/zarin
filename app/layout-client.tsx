"use client"

import { useEffect, useState } from "react"
import { UserProfile } from "./types/user"
import { UserProvider } from "./providers/user-provider"
import { ChatHistoryProvider } from "@/lib/chat/chat-history-provider"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { readFromIndexedDB, writeToIndexedDB } from "@/lib/chat/persist"
import { Analytics } from "@vercel/analytics/react"
import { TextShimmer } from "@/components/motion-primitives/text-shimmer"

// Create a default Zarin User
function createGuestUser(): UserProfile {
  // Browser-compatible UUID generation
  const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  
  return {
    id: `guest_${generateId()}`,
    daily_message_count: 0,
    created_at: new Date().toISOString(),
    display_name: "Zarin User",
    profile_image: "",
    email: "",
  } as UserProfile
}

export function LayoutClient({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [guestUser, setGuestUser] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    // Try to get user from IndexedDB first
    const getUserFromDB = async () => {
      try {
        // Try to get existing user from IndexedDB
        const existingUser = await readFromIndexedDB<UserProfile>("users", "guest") as UserProfile | null;
        
        if (existingUser) {
          // We found a stored user
          setGuestUser(existingUser);
        } else {
          // No user found, create one and store it
          const newUser = createGuestUser();
          // Store the new user
          await writeToIndexedDB("users", { ...newUser, id: "guest" });
          setGuestUser(newUser);
        }
      } catch (error) {
        console.error("Error accessing IndexedDB:", error);
        setGuestUser(createGuestUser());
      }
    };
    
    getUserFromDB();
    
    // Optional: fetch CSRF token
    // fetch("/api/csrf")
  }, []);
  
  // Add keyboard shortcuts event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle history with Command+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.dispatchEvent(new Event('toggleHistory'))
      }
      
      // Toggle model selector with Command+M / Ctrl+M
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault()
        document.dispatchEvent(new Event('toggleModelSelector'))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Don't render providers until we have a Zarin User
  if (!guestUser) {
    return (
      <div className="flex bg-zinc-950 h-screen items-center justify-center">
        <div className="text-zinc-100">
        <TextShimmer className='font-mono text-sm' duration={1}>
          initializing...
        </TextShimmer>
        </div>
      </div>
    );
  }

  return (
    <UserProvider initialUser={guestUser}>
      <ChatHistoryProvider userId={guestUser.id}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" theme="dark" />
          {children}
        </ThemeProvider>
      </ChatHistoryProvider>
    </UserProvider>
  );
}
