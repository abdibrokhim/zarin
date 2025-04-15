"use client"

import { History } from "@/app/components/history/history"
import Link from "next/link"
import { APP_NAME } from "../../../lib/config"
import { ButtonNewChat } from "./button-new-chat"
import { UserMenu } from "./user-menu"

export function Header() {
  return (
    <header className="h-app-header fixed top-0 right-0 left-0 z-50">
      <div className="h-app-header top-app-header bg-background pointer-events-none absolute left-0 z-50 mx-auto w-full to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] lg:hidden"></div>
      <div className="bg-background relative mx-auto flex h-full max-w-full items-center justify-between px-4 sm:px-6 lg:bg-transparent lg:px-8">
        <Link href="/" className="text-xl font-medium tracking-tight lowercase">
          {APP_NAME}
        </Link>
        <div className="flex items-center gap-4">
          <ButtonNewChat />
          <History />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
