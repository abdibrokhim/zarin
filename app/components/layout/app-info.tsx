"use client"

import { useBreakpoint } from "@/hooks/use-breakpoint"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { APP_DESCRIPTION, APP_NAME } from "@/lib/config"
import { Info } from "@phosphor-icons/react"

const InfoContent = () => (
  <div className="space-y-4">
    <p className="text-foreground leading-relaxed">
      {APP_DESCRIPTION}
    </p>
    <p className="text-foreground leading-relaxed">
      The code is available on{" "}
      <a
        href="https://github.com/abdibrokhim/zarin"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        GitHub
      </a>
      . Made by{" "}
      <a
        href="https://x.com/abdibrokhim"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        @abdibrokhim
      </a>
      .
    </p>
    <p className="text-foreground leading-relaxed">
      Powered by <a href="https://aimlapi.com?utm_source=abdibrokhim" target="_blank" rel="noopener noreferrer" className="underline">AI/ML API</a>
    </p>
  </div>
)

const defaultTrigger = (
  <Button
    variant="ghost"
    size="icon"
    className="bg-background/80 hover:bg-muted text-muted-foreground h-8 w-8 rounded-full"
    aria-label={`About ${APP_NAME}`}
  >
    <Info size={24} />
  </Button>
)

type AppInfoProps = {
  trigger?: React.ReactNode
}

export function AppInfo({ trigger = defaultTrigger }: AppInfoProps) {
  const isMobile = useBreakpoint(768)

  if (isMobile) {
    return (
      <>
        <Drawer>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent className="bg-background border-border">
            <DrawerHeader>
              <img
                src="/banner_ocean.jpg"
                alt={`calm paint generate by ${APP_NAME}`}
                className="h-32 w-full object-cover"
              />
              <DrawerTitle>
                <VisuallyHidden>{APP_NAME}</VisuallyHidden>
              </DrawerTitle>
              <DrawerDescription>
                <VisuallyHidden>Your minimalist AI chat companion</VisuallyHidden>
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-6">
              <InfoContent />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="[&>button:last-child]:bg-background gap-0 overflow-hidden rounded-3xl p-0 shadow-xs sm:max-w-xl [&>button:last-child]:rounded-full [&>button:last-child]:p-1">
          <DialogHeader className="p-0">
            <img
              src="/banner_ocean.jpg"
              alt={`calm paint generate by ${APP_NAME}`}
              className="h-32 w-full object-cover"
            />
            <DialogTitle>
              <VisuallyHidden>{APP_NAME}</VisuallyHidden>
            </DialogTitle>
            <DialogDescription>
              <VisuallyHidden>Your minimalist AI chat companion</VisuallyHidden>
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <InfoContent />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
