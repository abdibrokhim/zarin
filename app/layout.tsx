import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ChatHistoryProvider } from "@/lib/chat-store/chat-history-provider"
import { APP_DESCRIPTION, APP_NAME } from "@/lib/config"
import { ThemeProvider } from "next-themes"
import Script from "next/script"
import { LayoutClient } from "./layout-client"
import { UserProvider } from "./providers/user-provider"
import { UserProfile } from "./types/user"
import crypto from "crypto"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
}

// Create a default guest user
function createGuestUser(): UserProfile {
  return {
    id: `guest_${crypto.randomUUID()}`,
    daily_message_count: 0,
    created_at: new Date().toISOString(),
    display_name: "Guest User",
    profile_image: "",
    email: "",
  } as UserProfile
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDev = process.env.NODE_ENV === "development"
  
  // Create a guest user by default
  const guestUser = createGuestUser();

  return (
    <html lang="en" suppressHydrationWarning>
      {!isDev ? (
        <Script
          async
          src="https://analytics.umami.is/script.js"
          data-website-id="42e5b68c-5478-41a6-bc68-088d029cee52"
        />
      ) : null}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutClient />
        <UserProvider initialUser={guestUser}>
          <ChatHistoryProvider userId={guestUser?.id}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster position="top-center" />
              {children}
            </ThemeProvider>
          </ChatHistoryProvider>
        </UserProvider>
      </body>
    </html>
  )
}
