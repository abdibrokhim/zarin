"use client"

import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { FeedbackForm } from "@/components/common/feedback-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { useState } from "react"

type FeedbackProps = {
  trigger: React.ReactNode
  authUserId?: string
}

export function Feedback({ trigger, authUserId }: FeedbackProps) {
  const isMobile = useBreakpoint(768)
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  if (isMobile) {
    return (
      <>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent className="bg-background border-border">
            <FeedbackForm authUserId={authUserId} onClose={handleClose} />
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="[&>button:last-child]:bg-background overflow-hidden p-0 shadow-xs sm:max-w-md [&>button:last-child]:top-3.5 [&>button:last-child]:right-3 [&>button:last-child]:rounded-full [&>button:last-child]:p-1">
          <FeedbackForm authUserId={authUserId} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  )
}
