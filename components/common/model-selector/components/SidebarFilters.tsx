"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Star, ArrowCounterClockwise } from "@phosphor-icons/react"
import { FeatureId, FEATURE_ICONS, UseCaseId, USE_CASE_ICONS } from "@/lib/models/types"
import { PROVIDERS_OPTIONS } from "@/lib/models/config"
import { useState } from "react"
import SearchDynamicButton from "./SearchDynamicButton"

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
  const [providerSearch, setProviderSearch] = useState("")
  const [useCaseSearch, setUseCaseSearch] = useState("")
  const [featureSearch, setFeatureSearch] = useState("")

  // Filter the providers based on search
  const filteredProviders = PROVIDERS_OPTIONS.filter(provider => 
    provider.name.toLowerCase().includes(providerSearch.toLowerCase())
  )

  // Filter the use cases based on search
  const filteredUseCases = USE_CASE_FILTERS.filter(useCase => 
    useCase.label.toLowerCase().includes(useCaseSearch.toLowerCase())
  )

  // Filter the features based on search
  const filteredFeatures = FEATURE_FILTERS.filter(feature => 
    feature.label.toLowerCase().includes(featureSearch.toLowerCase())
  )

  return (
    <div className="hidden lg:flex flex-col border-r border-border dark:border-border h-full min-h-0">
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
      
      <div className="flex-1 flex flex-col min-h-0">
        {/* Filter by provider */}
        <div className="flex-1 space-y-2 px-4 overflow-y-auto min-h-0">
          <div className="flex items-center justify-between sticky top-0 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-muted-foreground">Providers</h4>
            <SearchDynamicButton 
              placeholder="Search providers" 
              onSearch={setProviderSearch}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Button 
              variant={activeTab === "all" ? "secondary" : "ghost"} 
              className="justify-start" 
              onClick={() => setActiveTab("all")}
            >
              <Star className="size-4 mr-2" />
              All Providers
            </Button>
            
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
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
              ))
            ) : (
              <div className="text-xs text-center text-muted-foreground py-2 px-1">
                No providers found
              </div>
            )}
          </div>
        </div>
        
        <Separator className="my-2" />
        
        {/* Filter by use case */}
        <div className="flex-1 space-y-2 px-4 overflow-y-auto min-h-0">
          <div className="flex items-center justify-between sticky top-0 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-muted-foreground">Use Cases</h4>
            <SearchDynamicButton 
              placeholder="Search use cases" 
              onSearch={setUseCaseSearch}
            />
          </div>
          <div className="flex flex-col space-y-1">
            {filteredUseCases.length > 0 ? (
              filteredUseCases.map((useCase) => {
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
              })
            ) : (
              <div className="text-xs text-center text-muted-foreground py-2 px-1">
                No use cases found
              </div>
            )}
          </div>
        </div>
        
        <Separator className="my-2" />
        
        {/* Filter by features */}
        <div className="flex-1 space-y-2 px-4 overflow-y-auto min-h-0">
          <div className="flex items-center justify-between sticky top-0 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-muted-foreground">Features</h4>
            <SearchDynamicButton 
              placeholder="Search features" 
              onSearch={setFeatureSearch}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Button
              variant={activeFeature === "all" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setActiveFeature("all")}
            >
              <Star className="size-4 mr-2" />
              All Features
            </Button>
          
            {filteredFeatures.length > 0 ? (
              filteredFeatures.map((feature) => {
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
              })
            ) : (
              <div className="text-xs text-center text-muted-foreground py-2 px-1">
                No features found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 