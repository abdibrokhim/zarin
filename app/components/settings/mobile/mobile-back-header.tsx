import { Button } from "@/components/ui/button"
import { ArrowLeft } from "@phosphor-icons/react"
import { MobileBackHeaderProps } from "../types"

export function MobileBackHeader({ activeTab, onBack }: MobileBackHeaderProps) {
  return (
    <div className="mb-4 flex items-center px-4 py-2">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="size-4" />
      </Button>
      <h2 className="flex-grow text-lg font-medium text-right">
        {activeTab === "account" ? "Account" : 
         activeTab === "appearance" ? "Appearance" : "Model Preferences"}
      </h2>
    </div>
  )
} 