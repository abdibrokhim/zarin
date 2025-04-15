import { useUser } from "@/app/providers/user-provider"
import { ModelSelector } from "@/components/common/model-selector"
import { MODEL_DEFAULT } from "@/lib/models/config"
import { useState, useEffect } from "react"

export function ModelTab({ isMobile = false }: { isMobile?: boolean }) {
  const { user, updateUser } = useUser()
  const [selectedModelId, setSelectedModelId] = useState<string>(
    user?.preferred_model || MODEL_DEFAULT
  )

  useEffect(() => {
    if (user?.preferred_model) {
      setSelectedModelId(user.preferred_model)
    }
  }, [user?.preferred_model])

  const handleModelSelection = async (value: string) => {
    setSelectedModelId(value)
    await updateUser({ preferred_model: value })
  }

  return (
    <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
      <h3 className="mb-3 text-sm font-medium">Preferred Model</h3>
      <div className="relative">
        <ModelSelector
          selectedModelId={selectedModelId}
          setSelectedModelId={handleModelSelection}
          className="w-full"
        />
      </div>
      <p className="text-muted-foreground mt-2 text-xs text-center">
        This model will be used by default for new conversations
      </p>
    </div>
  )
} 