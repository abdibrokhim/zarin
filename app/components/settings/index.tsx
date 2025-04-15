"use client"

import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { useUser } from "@/app/providers/user-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { User } from "@phosphor-icons/react"
import { useState } from "react"
import { SettingsContent } from "./settings-content"
import { SettingsProps } from "./types"

export function Settings({ trigger }: SettingsProps) {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const isMobile = useBreakpoint(768)

  if (!user) return null

  const handleClose = () => {
    setOpen(false)
  }

  const defaultTrigger = (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      onClick={() => setOpen(true)}
    >
      <User className="size-4" />
      <span>Settings</span>
    </DropdownMenuItem>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger || defaultTrigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>
            <VisuallyHidden>Settings</VisuallyHidden>
          </DrawerTitle>
          <SettingsContent isDrawer onClose={handleClose} />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="gap-0 p-0 sm:max-w-3xl rounded-3xl">
        <DialogHeader className="px-6 py-6 mb-2">
          <DialogTitle>
            Settings
          </DialogTitle>
        </DialogHeader>
        <SettingsContent onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
} 