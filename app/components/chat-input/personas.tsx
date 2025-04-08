"use client"

import { Button } from "@/components/ui/button"
import { PERSONAS } from "@/lib/config"
import { TRANSITION_SUGGESTIONS } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { memo } from "react"

type ButtonPersonaProps = {
  label: string
  prompt: string
  onSelectSystemPrompt: (systemPrompt: string) => void
  systemPrompt?: string
  icon: React.ElementType
}

const ButtonPersona = memo(function ButtonPersona({
  label,
  prompt,
  onSelectSystemPrompt,
  systemPrompt,
  icon,
}: ButtonPersonaProps) {
  const isActive = systemPrompt === prompt
  const Icon = icon

  return (
    <Button
      key={label}
      variant="outline"
      size="lg"
      onClick={() =>
        isActive ? onSelectSystemPrompt("") : onSelectSystemPrompt(prompt)
      }
      className={cn(
        "rounded-full",
        isActive &&
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground transition-none"
      )}
      type="button"
    >
      <Icon className="size-4" />
      {label}
    </Button>
  )
})

type PersonasProps = {
  onSelectSystemPrompt: (systemPrompt: string) => void
  systemPrompt?: string
}

export const Personas = memo(function Personas({
  onSelectSystemPrompt,
  systemPrompt,
}: PersonasProps) {
  return (
    <motion.div
      className="flex w-full max-w-full flex-nowrap justify-start gap-2 overflow-x-auto px-2 md:mx-auto md:max-w-2xl md:flex-wrap md:justify-center md:pl-0"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0, y: 10, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -10, filter: "blur(4px)" },
      }}
      transition={TRANSITION_SUGGESTIONS}
      style={{
        scrollbarWidth: "none",
      }}
    >
      {PERSONAS.map((persona, index) => (
        <motion.div
          key={persona.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            ...TRANSITION_SUGGESTIONS,
            delay: index * 0.02,
          }}
        >
          <ButtonPersona
            key={persona.label}
            label={persona.label}
            prompt={persona.prompt}
            onSelectSystemPrompt={onSelectSystemPrompt}
            systemPrompt={systemPrompt}
            icon={persona.icon}
          />
        </motion.div>
      ))}
    </motion.div>
  )
})
