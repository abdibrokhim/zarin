"use client"

import { TextShimmer } from "@/components/motion-primitives/text-shimmer"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Check, Star } from "@phosphor-icons/react"
import { FEATURE_ICONS } from "@/lib/models/types"
import { FeatureId } from "@/lib/models/types"
import { Model, Provider } from "@/lib/models/types"
import { FEATURE_COLORS } from "../constants"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FEATURE_FILTERS } from "../constants"

type ModelCardProps = {
  model: Model
  provider: Provider | undefined
  isSelected: boolean
  onSelect: (modelId: string) => void
}

export function ModelCard({
  model,
  provider,
  isSelected,
  onSelect
}: ModelCardProps) {
  const modelFeatures = model.features || []
  
  const handleClick = () => {
    if (model.available) {
      onSelect(model.id)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (model.available && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onSelect(model.id)
    }
  }
  
  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={model.available ? 0 : -1}
      role="button"
      aria-pressed={isSelected}
      className={cn(
        "flex flex-col p-4 rounded-xl border border-border dark:border-border transition-all duration-300 focus:outline-none hover:bg-muted/20",
        isSelected 
          ? "border-primary/70 dark:border-primary/70 shadow-md bg-primary/5" 
          : "hover:border-border/80 dark:hover:border-border/80 hover:shadow-sm",
        !model.available && "opacity-50 cursor-not-allowed",
        model.available && "cursor-pointer"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "flex items-center justify-center p-2 rounded-lg",
          model.available ? "bg-muted/40 dark:bg-muted/40" : "bg-muted/40 dark:bg-muted/40"
        )}>
          {provider?.icon && <provider.icon className="size-6" />}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{provider?.name}</span>
            {isSelected && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Check className="size-3 mr-1" /> Current
              </Badge>
            )}
            {model.featured && !isSelected && (
              <Badge variant="outline" className="bg-amber-100/30 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50">
                <Star weight="fill" className="size-3 mr-1" /> Featured
              </Badge>
            )}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium truncate">
            {model.available ? (
              <TextShimmer>{model.name}</TextShimmer>
            ) : (
              model.name
            )}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{model.description}</p>
          </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {/* Feature badges */}
      {modelFeatures.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {modelFeatures.filter(f => f.enabled).map((feature) => {
            const Icon = FEATURE_ICONS[feature.id as FeatureId]
            if (!Icon) return null
            
            // Find the feature label from our filter list
            const featureInfo = FEATURE_FILTERS.find(f => f.id === feature.id)
            const featureLabel = featureInfo?.label || feature.id
            
            // Get color class from mapping or use default
            const colorClass = FEATURE_COLORS[feature.id as string] || FEATURE_COLORS.default
            
            return (
              <Tooltip key={feature.id}>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs font-normal py-0.5", colorClass)}
                  >
                    <Icon className="size-3 mr-1" />
                    {featureLabel}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This model supports {featureLabel.toLowerCase()} capabilities</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      )}
      
      {!model.available && (
        <Badge className="w-fit py-2 bg-muted/40 hover:bg-muted/40 text-muted-foreground dark:bg-muted/40 dark:text-muted-foreground dark:hover:bg-muted/40 border-none">
          Coming soon
        </Badge>
      )}
    </div>
  )
} 