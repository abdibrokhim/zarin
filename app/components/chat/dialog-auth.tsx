"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useState } from "react"

type DialogAuthProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function DialogAuth({ open, setOpen }: DialogAuthProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            <VisuallyHidden>You've reached the limit for today</VisuallyHidden>
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            We're using browser storage to save your chats locally.
            Your chat history will be saved in your browser until you clear it.
            Please try again tomorrow or clear your browser data if you need to reset.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 sm:justify-center">
          <Button
            variant="secondary"
            className="w-full text-base"
            size="lg"
            onClick={() => setOpen(false)}
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
