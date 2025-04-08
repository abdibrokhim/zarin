import { ModelSelector } from "@/components/common/model-selector"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CaretDown } from "@phosphor-icons/react"
import { MODELS_OPTIONS, PROVIDERS_OPTIONS } from "../../../lib/config"

export type SelectModelProps = {
  selectedModel: string
  onSelectModel: (model: string) => void
  isUserAuthenticated: boolean
}

export function SelectModel({
  selectedModel,
  onSelectModel,
  isUserAuthenticated,
}: SelectModelProps) {
  const model = MODELS_OPTIONS.find((model) => model.id === selectedModel)
  const provider = PROVIDERS_OPTIONS.find(
    (provider) => provider.id === model?.provider
  )

  return (
    <ModelSelector
      selectedModelId={selectedModel}
      setSelectedModelId={onSelectModel}
      className="rounded-full"
    />
  )
}
