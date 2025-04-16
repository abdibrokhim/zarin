"use client"

import React, { useState } from "react"
import { TextMorph } from "../motion-primitives/text-morph"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

type ButtonCopyProps = {
  code: string
}

export function ButtonCopy({ code }: ButtonCopyProps) {
  const [hasCopyLabel, setHasCopyLabel] = useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(code)
    setHasCopyLabel(true)

    setTimeout(() => {
      setHasCopyLabel(false)
    }, 1000)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onCopy}
          type="button"
          className="text-muted-foreground hover:bg-muted inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs"
    >
      <TextMorph as="span">{hasCopyLabel ? "Copied" : "Copy"}</TextMorph>
    </button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Click to copy</p>
    </TooltipContent>
    </Tooltip>
  )
}
