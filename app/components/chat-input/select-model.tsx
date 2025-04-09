import { ModelSelector } from "@/components/common/model-selector"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CaretDown, Command as CommandIcon } from "@phosphor-icons/react"
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

  // Handle keyboard shortcut manually
  const handleModelSelectorKeyboard = () => {
    document.dispatchEvent(new Event('toggleModelSelector'));
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="cursor-pointer" 
          onClick={handleModelSelectorKeyboard}
          role="button"
          aria-label="Select AI model"
        >
          <ModelSelector
            selectedModelId={selectedModel}
            setSelectedModelId={onSelectModel}
            className="rounded-full"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-1">
          Select model <CommandIcon className="size-4" /> M
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
