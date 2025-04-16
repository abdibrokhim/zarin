"use client"

import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/components/motion-primitives/morphing-popover"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  CaretLeft,
  QuestionMark,
  SealCheck,
  Spinner,
} from "@phosphor-icons/react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

const TRANSITION_POPOVER = {
  type: "spring",
  bounce: 0.1,
  duration: 0.3,
}

const TRANSITION_CONTENT = {
  ease: "easeOut",
  duration: 0.2,
}

export function FeedbackWidget() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle")
  const [feedback, setFeedback] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const isMobileOrTablet = useBreakpoint(896)

  useEffect(() => {
    setStatus("idle")
    setFeedback("")
  }, [isOpen])

  const closeMenu = () => {
    setFeedback("")
    setStatus("idle")
    setIsOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!feedback.trim()) return

    setStatus("submitting")

    try {
      // Create a mailto link with the feedback content
      const subject = encodeURIComponent("Feedback for Zarin Chat")
      const emailBody = encodeURIComponent(`${feedback}`)
      
      // Open the email client
      window.location.href = `mailto:abdibrokhim@gmail.com?subject=${subject}&body=${emailBody}`
      
      // Simulate delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      setStatus("success")

      setTimeout(() => {
        closeMenu()
      }, 2500)
    } catch (error) {
      toast({
        title: `Error sending feedback: ${error}`,
        status: "error",
      })
      setStatus("error")
    }
  }

  if (isMobileOrTablet) {
    return null
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <MorphingPopover
        transition={TRANSITION_POPOVER}
        open={isOpen}
        onOpenChange={setIsOpen}
        className="relative flex flex-col items-end justify-end"
      >
        <MorphingPopoverTrigger
          className="border-border bg-background text-foreground hover:bg-secondary flex size-8 items-center justify-center rounded-full border shadow-md"
          style={{
            transformOrigin: "bottom right",
            originX: "right",
            originY: "bottom",
            scaleX: 1,
            scaleY: 1,
          }}
        >
          <span className="sr-only">Help</span>
          <motion.span
            animate={{
              opacity: isOpen ? 0 : 1,
            }}
            transition={{
              duration: 0,
              delay: isOpen ? 0 : TRANSITION_POPOVER.duration / 2,
            }}
          >
            <QuestionMark className="text-foreground size-4" />
          </motion.span>
        </MorphingPopoverTrigger>
        <MorphingPopoverContent
          className="border-border bg-popover fixed right-4 bottom-4 rounded-xl border p-0 shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)]"
          style={{
            transformOrigin: "bottom right",
          }}
        >
          <div className="h-[200px] w-[364px]">
            <AnimatePresence mode="popLayout">
              {status === "success" ? (
                <motion.div
                  key="success"
                  className="flex h-[200px] w-[364px] flex-col items-center justify-center"
                  initial={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                  transition={TRANSITION_CONTENT}
                >
                  <div className="rounded-full bg-green-500/10 p-1">
                    <SealCheck className="size-6 text-green-500" />
                  </div>
                  <p className="text-foreground mt-3 mb-1 text-center text-sm font-medium">
                    Thank you for your time!
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Your feedback makes Zarin better.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="flex h-full flex-col"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                  transition={TRANSITION_CONTENT}
                >
                  <motion.span
                    aria-hidden="true"
                    initial={{
                      opacity: 1,
                    }}
                    animate={{
                      opacity: feedback ? 0 : 1,
                    }}
                    transition={{
                      duration: 0,
                    }}
                    className="text-muted-foreground pointer-events-none absolute top-3.5 left-4 text-sm leading-[1.4] select-none"
                  >
                    What would make Zarin better for you?
                  </motion.span>
                  <textarea
                    className="text-foreground h-full w-full resize-none rounded-md bg-transparent px-4 py-3.5 text-sm outline-hidden"
                    autoFocus
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={status === "submitting"}
                  />
                  <div
                    key="close"
                    className="flex justify-between pt-2 pr-3 pb-3 pl-2"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={closeMenu}
                      aria-label="Close popover"
                      disabled={status === "submitting"}
                      className="rounded-lg"
                    >
                      <CaretLeft size={16} className="text-foreground" />
                    </Button>
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      aria-label="Submit feedback"
                      className="rounded-lg"
                      disabled={status === "submitting" || !feedback.trim()}
                    >
                      <AnimatePresence mode="popLayout">
                        {status === "submitting" ? (
                          <motion.span
                            key="submitting"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={TRANSITION_CONTENT}
                            className="inline-flex items-center gap-2"
                          >
                            <Spinner className="size-4 animate-spin" />
                            Sending...
                          </motion.span>
                        ) : (
                          <motion.span
                            key="send"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={TRANSITION_CONTENT}
                          >
                            Send
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  )
}
