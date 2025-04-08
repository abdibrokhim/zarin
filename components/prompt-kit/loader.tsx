"use client"

import { cn } from "@/lib/utils"
import React from "react"

export interface LoaderProps {
  variant?: "loading-dots"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function TextDotsLoader({
  className,
  text = "Thinking",
  size = "md",
}: {
  className?: string
  text?: string
  size?: "sm" | "md" | "lg"
}) {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={cn("inline-flex items-center", className)}>
      <span className={cn("text-primary font-base", textSizes[size])}>
        {text}
      </span>
      <span className="inline-flex">
        <span className="text-primary animate-[loading-dots_1.4s_infinite_0.2s]">
          .
        </span>
        <span className="text-primary animate-[loading-dots_1.4s_infinite_0.4s]">
          .
        </span>
        <span className="text-primary animate-[loading-dots_1.4s_infinite_0.6s]">
          .
        </span>
      </span>
    </div>
  )
}

function Loader({ size = "md", text, className }: LoaderProps) {
  return <TextDotsLoader text={text} size={size} className={className} />
}

export { Loader }
