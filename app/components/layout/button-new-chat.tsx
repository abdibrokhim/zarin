"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { NotePencil } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function ButtonNewChat() {
  const pathname = usePathname()
  if (pathname === "/") {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1.5 transition-colors"
        >
          <NotePencil size={24} />
        </Link>
      </TooltipTrigger>
      <TooltipContent>New Chat</TooltipContent>
    </Tooltip>
  )
}
