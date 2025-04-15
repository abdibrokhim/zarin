"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Star, ArrowCounterClockwise } from "@phosphor-icons/react"
import { FeatureId, FEATURE_ICONS, UseCaseId, USE_CASE_ICONS } from "@/lib/models/types"
import { PROVIDERS_OPTIONS } from "@/lib/models/config"

type SidebarFiltersProps = {
  activeTab: string
  setActiveTab: (tab: string) => void
  activeUseCase: string
  setActiveUseCase: (useCase: string) => void
  activeFeature: string
  setActiveFeature: (feature: string) => void
  resetFilters: () => void
  FEATURE_FILTERS: { id: FeatureId | string, label: string }[]
  USE_CASE_FILTERS: { id: UseCaseId | string, label: string, icon?: any }[]
}

export function SidebarFilters({
  activeTab,
  setActiveTab,
  activeUseCase,
  setActiveUseCase,
  activeFeature,
  setActiveFeature,
  resetFilters,
  FEATURE_FILTERS,
  USE_CASE_FILTERS,
}: SidebarFiltersProps) {
  return (
    <div className="hidden lg:flex flex-col border-r border-border dark:border-border h-full overflow-y-auto">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-medium">Filters</h3>
        <Button 
          size="icon"
          variant="ghost" 
          className=""
          onClick={resetFilters}
        >
          <ArrowCounterClockwise className="size-4" />
        </Button>
      </div>
      
      {/* Filter by provider */}
      <div className="space-y-2 px-4 overflow-y-auto">
        <h4 className="text-sm font-medium text-muted-foreground sticky top-0 bg-transparent backdrop-blur-xs">Providers</h4>
        <div className="flex flex-col space-y-1">
          <Button 
            variant={activeTab === "all" ? "secondary" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("all")}
          >
            <Star className="size-4 mr-2" />
            All Providers
          </Button>
          
          {PROVIDERS_OPTIONS.map((provider) => (
            <Button
              key={provider.id}
              variant={activeTab === provider.id ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                !provider.available && "opacity-50 cursor-not-allowed"
              )}
              disabled={!provider.available}
              onClick={() => setActiveTab(provider.id)}
            >
              {provider.icon && <provider.icon className="size-4 mr-2" />}
              {provider.name}
            </Button>
          ))}
        </div>
      </div>
      
      <Separator className="my-2" />
      
      {/* Filter by use case */}
      <div className="space-y-2 px-4 overflow-y-auto">
        <h4 className="text-sm font-medium text-muted-foreground sticky top-0 bg-transparent backdrop-blur-xs">Use Cases</h4>
        <div className="flex flex-col space-y-1">
          {USE_CASE_FILTERS.map((useCase) => {
            const Icon = useCase.id !== "all" 
              ? USE_CASE_ICONS[useCase.id as UseCaseId] 
              : Star
            
            return (
              <Button
                key={useCase.id}
                variant={activeUseCase === useCase.id ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveUseCase(useCase.id)}
              >
                <Icon className="size-4 mr-2" />
                {useCase.label}
              </Button>
            )
          })}
        </div>
      </div>
      
      <Separator className="my-2" />
      
      {/* Filter by features */}
      <div className="space-y-2 px-4 overflow-y-auto">
        <h4 className="text-sm font-medium text-muted-foreground sticky top-0 bg-transparent backdrop-blur-xs">Features</h4>
        <div className="flex flex-col space-y-1">
          <Button
            variant={activeFeature === "all" ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => setActiveFeature("all")}
          >
            <Star className="size-4 mr-2" />
            All Features
          </Button>
        
          {FEATURE_FILTERS.map((feature) => {
            const Icon = FEATURE_ICONS[feature.id as FeatureId]
            
            return (
              <Button
                key={feature.id}
                variant={activeFeature === feature.id ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveFeature(feature.id)}
              >
                <Icon className="size-4 mr-2" />
                {feature.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
} 