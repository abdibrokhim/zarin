"use client"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeatureId, FEATURE_ICONS, UseCaseId, USE_CASE_ICONS } from "@/lib/models/types"
import { PROVIDERS_OPTIONS } from "@/lib/models/config"
import { Star } from "@phosphor-icons/react"

type MobileFiltersProps = {
  activeTab: string
  setActiveTab: (tab: string) => void
  activeUseCase: string
  setActiveUseCase: (useCase: string) => void
  activeFeature: string
  setActiveFeature: (feature: string) => void
  FEATURE_FILTERS: { id: FeatureId | string, label: string }[]
  USE_CASE_FILTERS: { id: UseCaseId | string, label: string, icon?: any }[]
}

export function MobileFilters({
  activeTab,
  setActiveTab,
  activeUseCase,
  setActiveUseCase,
  activeFeature,
  setActiveFeature,
  FEATURE_FILTERS,
  USE_CASE_FILTERS,
}: MobileFiltersProps) {
  return (
    <>
      {/* Provider filter tabs for mobile */}
      <div className="lg:hidden overflow-x-auto pb-2">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-transparent p-0 h-auto space-x-2">
            <TabsTrigger 
              value="all" 
              className={`data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-3 py-1 h-auto rounded-full text-xs
                ${activeTab === "all" && "text-muted-foreground dark:text-muted-foreground"}
              `}
            >
              All
            </TabsTrigger>
            
            {PROVIDERS_OPTIONS.map((provider) => (
              <TabsTrigger
                key={provider.id}
                value={provider.id}
                className={`data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-3 py-1 h-auto rounded-full text-xs flex items-center gap-1
                  ${!provider.available && "opacity-50 cursor-not-allowed"}
                `}
                disabled={!provider.available}
              >
                {provider.icon && <provider.icon className="size-3" />}
                {provider.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Use cases for mobile */}
      <div className="lg:hidden overflow-x-auto pb-2">
        <div className="flex space-x-2">
          {USE_CASE_FILTERS.map((useCase) => {
            const Icon = useCase.id !== "all" 
              ? USE_CASE_ICONS[useCase.id as UseCaseId] 
              : Star
            
            return (
              <Badge
                key={useCase.id}
                variant={activeUseCase === useCase.id ? "secondary" : "outline"}
                className="py-1.5 cursor-pointer whitespace-nowrap"
                onClick={() => setActiveUseCase(useCase.id)}
              >
                <Icon className="size-3 mr-1" />
                {useCase.label}
              </Badge>
            )
          })}
        </div>
      </div>
      
      {/* Feature filters for mobile */}
      <div className="lg:hidden overflow-x-auto pb-2">
        <div className="flex space-x-2">
          {FEATURE_FILTERS.slice(0, 6).map((feature) => {
            const Icon = FEATURE_ICONS[feature.id as FeatureId]
            
            return (
              <Badge
                key={feature.id}
                variant={activeFeature === feature.id ? "secondary" : "outline"}
                className="py-1.5 cursor-pointer whitespace-nowrap"
                onClick={() => setActiveFeature(feature.id === activeFeature ? "all" : feature.id)}
              >
                <Icon className="size-3 mr-1" />
                {feature.label}
              </Badge>
            )
          })}
        </div>
      </div>
    </>
  )
} 