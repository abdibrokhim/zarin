import { CaretRight } from "@phosphor-icons/react"
import { MobileSettingsItemProps } from "../types"

export function MobileSettingsItem({ icon, label, onClick }: MobileSettingsItemProps) {
  return (
    <button
      className="flex items-center justify-between w-full px-4 py-3 cursor-pointer hover:bg-accent/30 transition-all duration-300 rounded-xl"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="text-foreground/80">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="opacity-50">
        <CaretRight className="size-4" />
      </div>
    </button>
  )
} 