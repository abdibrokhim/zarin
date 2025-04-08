import { cn } from "@/lib/utils"
import React from "react"

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function VisuallyHidden({
  className,
  children,
  ...props
}: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        "absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0",
        "clip-[rect(0,0,0,0)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
} 