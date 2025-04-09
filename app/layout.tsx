import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { APP_DESCRIPTION, APP_NAME } from "@/lib/config"
import { LayoutClient } from "./layout-client"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--geist-font",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  )
}
