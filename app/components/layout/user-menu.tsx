"use client"

import { Database } from "@/app/types/database.types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info, Question, User } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { APP_NAME } from "../../../lib/config"

const AppInfo = dynamic(() => import("./app-info").then((mod) => mod.AppInfo), {
  ssr: false,
})

const Feedback = dynamic(
  () => import("./feedback").then((mod) => mod.Feedback),
  { ssr: false }
)

const Settings = dynamic(
  () => import("./settings").then((mod) => mod.Settings),
  { ssr: false }
)

type User = Database["public"]["Tables"]["users"]["Row"]

export function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user?.profile_image ?? undefined} />
              <AvatarFallback>{user?.display_name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Profile</TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem className="flex flex-col items-start gap-0 no-underline hover:bg-transparent focus:bg-transparent">
          <span>{user?.display_name}</span>
          <span className="text-muted-foreground">{user?.email}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Settings
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <User className="size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          }
        />
        <Feedback
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Question className="size-4" />
              <span>Feedback</span>
            </DropdownMenuItem>
          }
          authUserId={user.id}
        />
        <AppInfo
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Info className="size-4" />
              About {APP_NAME}
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
