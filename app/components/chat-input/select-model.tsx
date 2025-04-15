import { ModelSelector } from "@/components/common/model-selector"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Command as CommandIcon } from "@phosphor-icons/react"
import { MODELS_OPTIONS, PROVIDERS_OPTIONS } from "@/lib/models/config"
import { useRef } from "react"

export type SelectModelProps = {
  selectedModel: string
  onSelectModel: (model: string) => void
}

export function SelectModel({
  selectedModel,
  onSelectModel,
}: SelectModelProps) {
  const model = MODELS_OPTIONS.find((model) => model.id === selectedModel)
  const provider = PROVIDERS_OPTIONS.find(
    (provider) => provider.id === model?.provider
  )
  
  // Use ref to directly access the model selector component
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcut manually - modified to prevent event bubbling
  const handleModelSelectorKeyboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Directly trigger the custom event
    document.dispatchEvent(new CustomEvent('toggleModelSelector'));
    
    // Prevent any tooltip from remaining open
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 100);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="cursor-pointer" 
          onClick={handleModelSelectorKeyboard}
          role="button"
          aria-label="Select AI model"
          ref={modelSelectorRef}
        >
          <ModelSelector
            selectedModelId={selectedModel}
            setSelectedModelId={onSelectModel}
            className="rounded-full"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <div className="flex items-center gap-1">
          Select model <CommandIcon className="size-4" /> M
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
