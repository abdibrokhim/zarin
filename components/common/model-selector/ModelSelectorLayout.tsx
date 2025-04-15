"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CaretDown } from "@phosphor-icons/react"
import { Model, Provider, FeatureId, UseCaseId } from "@/lib/models/types"
import { SidebarFilters } from "./components/SidebarFilters"
import { MobileFilters } from "./components/MobileFilters"
import { SearchAndSort } from "./components/SearchAndSort"
import { ModelList } from "./components/ModelList"

type ModelSelectorLayoutProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  selectedModel: Model | undefined
  selectedProvider: Provider | undefined
  className?: string
  searchInputRef: React.RefObject<HTMLInputElement>
  filteredModels: Model[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  activeUseCase: string
  setActiveUseCase: (useCase: string) => void
  activeFeature: string
  setActiveFeature: (feature: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  showFeaturedOnly: boolean
  setShowFeaturedOnly: (show: boolean) => void
  resetFilters: () => void
  onSelectModel: (modelId: string) => void
  FEATURE_FILTERS: { id: FeatureId | string, label: string }[]
  USE_CASE_FILTERS: { id: UseCaseId | string, label: string, icon?: any }[]
  SORT_OPTIONS: { value: string, label: string }[]
}

export function ModelSelectorLayout({
  isOpen,
  setIsOpen,
  selectedModel,
  selectedProvider,
  className,
  searchInputRef,
  filteredModels,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  activeUseCase,
  setActiveUseCase,
  activeFeature,
  setActiveFeature,
  sortBy,
  setSortBy,
  showFeaturedOnly,
  setShowFeaturedOnly,
  resetFilters,
  onSelectModel,
  FEATURE_FILTERS,
  USE_CASE_FILTERS,
  SORT_OPTIONS,
}: ModelSelectorLayoutProps) {
  
  // Prevent input clicks from closing the dialog
  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "dark:bg-transparent justify-between min-w-[160px] border border-outline dark:border-outline dark:hover:bg-muted",
              !selectedModel?.available && "cursor-not-allowed opacity-50",
              className
            )}
          >
            <div className="flex items-center gap-2">
              {selectedProvider?.icon && <selectedProvider.icon className="size-5" />}
              <span>{selectedModel?.name}</span>
            </div>
            <CaretDown className="size-4 opacity-50" />
          </Button>
        </DialogTrigger>
        
        <DialogContent 
          className="sm:max-w-[95vw] md:max-w-[95vw] lg:max-w-[95vw] xl:max-w-[1400px] h-[95vh] p-0 gap-0 overflow-hidden rounded-3xl border border-border dark:border-border"
          onInteractOutside={(e) => {
            // Prevent interactions with tooltip from closing the dialog
            if ((e.target as HTMLElement)?.closest('[role="tooltip"]')) {
              e.preventDefault()
            }
          }}
          onPointerDownOutside={(e) => {
            // Additional protection for outside clicks
            const target = e.target as HTMLElement
            if (target.closest('[role="dialog"]') || target.closest('[role="tooltip"]')) {
              e.preventDefault()
            }
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] h-full overflow-hidden">
            {/* Sidebar filters - desktop only */}
            <SidebarFilters
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeUseCase={activeUseCase}
              setActiveUseCase={setActiveUseCase}
              activeFeature={activeFeature}
              setActiveFeature={setActiveFeature}
              resetFilters={resetFilters}
              FEATURE_FILTERS={FEATURE_FILTERS}
              USE_CASE_FILTERS={USE_CASE_FILTERS}
            />
            
            {/* Main content area */}
            <div className="flex flex-col h-full">
              <DialogHeader className="p-4 border-b border-border dark:border-border">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">
                    Select AI Model
                  </DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="p-4 border-b border-border dark:border-border flex flex-col gap-2">
                {/* Search and sort controls */}
                <SearchAndSort
                  searchInputRef={searchInputRef}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  showFeaturedOnly={showFeaturedOnly}
                  setShowFeaturedOnly={setShowFeaturedOnly}
                  handleInputClick={handleInputClick}
                  SORT_OPTIONS={SORT_OPTIONS}
                />
                
                {/* Mobile filter options */}
                <MobileFilters
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  activeUseCase={activeUseCase}
                  setActiveUseCase={setActiveUseCase}
                  activeFeature={activeFeature}
                  setActiveFeature={setActiveFeature}
                  FEATURE_FILTERS={FEATURE_FILTERS}
                  USE_CASE_FILTERS={USE_CASE_FILTERS}
                />
              </div>
              
              <div className="flex flex-col overflow-y-auto h-[calc(100vh-200px)]">
                {/* total models count */}
                <div className="flex items-center justify-end px-4 pt-2">
                  <p className="text-sm text-muted-foreground justify-end">
                    showing {filteredModels.length} models
                  </p>
                </div>
                {/* Models Grid */}
                <div className="flex flex-col gap-2">
                  <ModelList
                    models={filteredModels}
                    selectedModelId={selectedModel?.id || ""}
                    onSelectModel={onSelectModel}
                    resetFilters={resetFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
} 