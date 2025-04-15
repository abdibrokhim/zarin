import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { APP_DESCRIPTION, APP_DOMAIN, APP_TITLE } from "@/lib/config"
import { LayoutClient } from "./layout-client"
import { Analytics } from "@vercel/analytics/react"
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
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_DOMAIN),
  keywords: ["ai", "ai platform", "open-source ai platform", "open-source"],
  
  alternates: {
    canonical: "/",
  },

  authors: [
    {
      name: "Ibrohim Abdivokhidov",
      url: "https://github.com/abdibrokhim",
    },
  ],

  openGraph: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    type: "website",
    url: "/",
    images: [
      {
        url: "/zarin-ui.png",
        width: 1200,
        height: 630,
        alt: APP_TITLE,
      },
    ],
  },
  
  icons: {
    icon: '/favicon.ico',
  },

  twitter: {
    card: 'summary_large_image',
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: ['/zarin-ui.png'],
    site: '@abdibrokhim',
    creator: '@abdibrokhim',
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },

  appleWebApp: {
    title: APP_TITLE,
    statusBarStyle: 'black-translucent',
  },
  
  appLinks: {
    web: {
      url: APP_DOMAIN,
      should_fallback: true,
    },
  },
};

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
      <Analytics />
    </html>
  )
}
