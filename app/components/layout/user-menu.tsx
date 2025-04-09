"use client"

import { useUser } from "@/app/providers/user-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { GearSix, Info, Lifebuoy, Question, Sliders } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { APP_NAME, DISCORD_URL } from "../../../lib/config"

const Settings = dynamic(
  () => import("./settings").then((mod) => mod.Settings),
  { ssr: false }
)

export function UserMenu() {
  const { user } = useUser()
  
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger>
            <div
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1.5 transition-colors"
            >
              <GearSix size={20} className="" />
            </div>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Settings
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Sliders className="size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          }
        />
        <DropdownMenuItem 
          onSelect={(e) => e.preventDefault()} 
          onClick={() => window.open(DISCORD_URL, "_blank")}>
          <Lifebuoy className="size-4" />
          <span>Help & Feedback</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
