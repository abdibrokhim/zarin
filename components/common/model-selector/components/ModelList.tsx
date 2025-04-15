"use client"

import { Button } from "@/components/ui/button"
import { Model, Provider } from "@/lib/models/types"
import { PROVIDERS_OPTIONS } from "@/lib/models/config"
import { ModelCard } from "./ModelCard"

type ModelListProps = {
  models: Model[]
  selectedModelId: string
  onSelectModel: (modelId: string) => void
  resetFilters: () => void
}

export function ModelList({
  models,
  selectedModelId,
  onSelectModel,
  resetFilters
}: ModelListProps) {
  const findProvider = (providerId: string): Provider | undefined => {
    return PROVIDERS_OPTIONS.find(provider => provider.id === providerId)
  }
  
  if (models.length === 0) {
    return (
      <div className="w-full flex flex-col py-4 items-center justify-center mx-auto text-center text-muted-foreground">
        No models found matching your filters.
        <Button variant="link" onClick={resetFilters} className="ml-2">
          Reset all filters
        </Button>
      </div>
    )
  }
  
  return (
    <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {models.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          provider={findProvider(model.provider)}
          isSelected={selectedModelId === model.id}
          onSelect={onSelectModel}
        />
      ))}
    </div>
  )
} 