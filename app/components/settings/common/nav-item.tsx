import { cn } from "@/lib/utils"
import { NavItemProps } from "../types"

export function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 text-sm px-4 py-3 w-full text-left rounded-xl transition-all duration-300 cursor-pointer",
        active 
          ? "bg-accent/80 text-primary font-medium" 
          : "text-foreground/70 hover:bg-accent/30"
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
} 