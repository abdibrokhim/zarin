"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import React, { memo, useMemo, useState } from "react"
import { Personas } from "./personas"
import { Suggestions } from "./suggestions"

type PromptSystemProps = {
  onValueChange: (value: string) => void
  onSuggestion: (suggestion: string) => void
  onSelectSystemPrompt: (systemPrompt: string) => void
  value: string
  systemPrompt?: string
}

export const PromptSystem = memo(function PromptSystem({
  onValueChange,
  onSuggestion,
  onSelectSystemPrompt,
  value,
  systemPrompt,
}: PromptSystemProps) {
  const [isPersonaMode, setIsPersonaMode] = useState(false)

  const tabs = useMemo(
    () => [
      {
        id: "personas",
        label: "Personas",
        isActive: isPersonaMode,
        onClick: () => {
          setIsPersonaMode(true)
          onSelectSystemPrompt("")
        },
      },
      {
        id: "suggestions",
        label: "Suggestions",
        isActive: !isPersonaMode,
        onClick: () => {
          setIsPersonaMode(false)
          onSelectSystemPrompt("")
        },
      },
    ],
    [isPersonaMode]
  )

  return (
    <>
      <div className="relative order-1 w-full md:absolute md:bottom-[-70px] md:order-2 md:h-[70px]">
        <AnimatePresence mode="popLayout">
          {isPersonaMode ? (
            <Personas
              onSelectSystemPrompt={onSelectSystemPrompt}
              systemPrompt={systemPrompt}
            />
          ) : (
            <Suggestions
              onValueChange={onValueChange}
              onSuggestion={onSuggestion}
              value={value}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="relative right-0 bottom-0 left-0 mx-auto mb-4 flex h-8 w-auto items-center justify-center rounded-lg p-1 md:fixed md:bottom-0">
        <div className="relative flex h-full flex-row gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "relative z-10 flex h-full flex-1 items-center justify-center rounded-md px-2 py-1 text-xs font-medium transition-colors active:scale-[0.98]",
                !tab.isActive ? "text-muted-foreground" : "text-foreground"
              )}
              onClick={tab.onClick}
              type="button"
            >
              <AnimatePresence initial={false}>
                {tab.isActive && (
                  <motion.div
                    layoutId={`background`}
                    className={cn("bg-muted absolute inset-0 z-10 rounded-lg")}
                    transition={{
                      duration: 0.25,
                      type: "spring",
                      bounce: 0,
                    }}
                    initial={{ opacity: 1 }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    style={{
                      originY: "0px",
                    }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
})
