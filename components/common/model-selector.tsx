"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MODELS_OPTIONS, PROVIDERS_OPTIONS, SUBSCRIPTION_URL } from "@/lib/config"
import { cn } from "@/lib/utils"
import { CaretDown, Check, Crown, Image } from "@phosphor-icons/react"

type ModelSelectorProps = {
  selectedModelId: string
  setSelectedModelId: (modelId: string) => void
  className?: string
}

export function ModelSelector({
  selectedModelId,
  setSelectedModelId,
  className,
}: ModelSelectorProps) {
  const model = MODELS_OPTIONS.find((model) => model.id === selectedModelId)
  const provider = PROVIDERS_OPTIONS.find(
    (provider) => provider.id === model?.provider
  )

  const handleSelectModel = (modelId: string) => {
    console.log(`Selecting model: ${modelId}`);
    setSelectedModelId(modelId);
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "dark:bg-secondary justify-between min-w-[120px]",
              !model?.available && "cursor-not-allowed opacity-50",
              className
            )}
          >
            <div className="flex items-center gap-2">
              {provider?.icon && <provider.icon className="size-5" />}
              <span>{model?.name}</span>
            </div>
            <CaretDown className="size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="max-h-[400px] w-[400px] overflow-y-auto"
          align="start"
          sideOffset={4}
        >
          {/* Pro Banner */}
          <a 
            href={SUBSCRIPTION_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block"
          >
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-900/40 dark:to-zinc-800/40 border-b border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-gradient-to-r hover:from-zinc-200 hover:to-zinc-300 dark:hover:from-zinc-800/40 dark:hover:to-zinc-700/40 transition-colors cursor-pointer rounded-t-md">
              <Crown weight="fill" className="size-5 text-zinc-600 dark:text-zinc-400" />
              <div className="flex flex-col">
                <span className="font-medium">Upgrade to Pro</span>
                <span className="text-xs text-zinc-700 dark:text-zinc-300">Unlock all models + higher limits</span>
              </div>
            </div>
          </a>

          {/* Models Section */}
          <div className="text-muted-foreground px-2 py-1.5 text-sm font-medium">
            Available Models
          </div>

          {MODELS_OPTIONS.map((model) => {
            const provider = PROVIDERS_OPTIONS.find(
              (provider) => provider.id === model.provider
            )
            const hasFileUpload = model.features?.find(
              (feature) => feature.id === "file-upload"
            )?.enabled
            const isSelected = selectedModelId === model.id;

            return (
              <DropdownMenuItem
                key={model.id}
                className={cn(
                  "flex items-center justify-between px-3 py-2",
                  !model.available && "cursor-not-allowed opacity-50",
                  isSelected && "bg-accent font-medium"
                )}
                disabled={!model.available}
                onClick={() => model.available && handleSelectModel(model.id)}
              >
                <div className="flex items-center gap-3">
                  {provider?.icon && <provider.icon className="size-5" />}
                  <span className="text-base">{model.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isSelected && <Check className="size-4 text-accent-foreground" />}
                  {hasFileUpload && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900">
                          <Image className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>This model can process and understand images.</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
