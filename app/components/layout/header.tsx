"use client"

import { History } from "@/app/components/history/history"
import { useUser } from "@/app/providers/user-provider"
import Link from "next/link"
import { APP_NAME } from "../../../lib/config"
import { AppInfo } from "./app-info"
import { ButtonNewChat } from "./button-new-chat"
import { UserMenu } from "./user-menu"

export function Header() {
  const { user } = useUser()
  const isLoggedIn = !!user

  return (
    <header className="h-app-header fixed top-0 right-0 left-0 z-50">
      <div className="h-app-header top-app-header bg-background pointer-events-none absolute left-0 z-50 mx-auto w-full to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] lg:hidden"></div>
      <div className="bg-background relative mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:bg-transparent lg:px-8">
        <Link href="/" className="text-xl font-medium tracking-tight lowercase">
          {APP_NAME}
        </Link>
        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <AppInfo />
            <Link
              href="/auth"
              className="font-base text-muted-foreground hover:text-foreground text-base transition-colors"
            >
              Login
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ButtonNewChat />
            <History />
            <UserMenu user={user} />
          </div>
        )}
      </div>
    </header>
  )
}
