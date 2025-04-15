"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useModels } from "./model-selector/hooks/useModels"
import { useFilters } from "./model-selector/hooks/useFilters"
import { ModelSelectorLayout } from "./model-selector/ModelSelectorLayout"
import { FEATURE_FILTERS, USE_CASE_FILTERS, SORT_OPTIONS } from "./model-selector/constants"

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
  // Dialog open state
  const [isOpen, setIsOpen] = useState(false)
  
  // Input ref for focus management
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Filter and sort states from custom hook
  const {
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
    resetFilters
  } = useFilters()
  
  // Filtered and sorted models
  const { filteredModels, selectedModel, selectedProvider } = useModels({
    selectedModelId,
    searchQuery,
    activeTab,
    activeUseCase,
    activeFeature,
    sortBy,
    showFeaturedOnly
  })
  
  // Focus search input when dialog opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Use a slight delay to ensure the dialog is fully rendered
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Function to handle selecting a model
  const handleSelectModel = useCallback((modelId: string) => {
    setSelectedModelId(modelId)
    setIsOpen(false)
  }, [setSelectedModelId])

  return (
    <ModelSelectorLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      selectedModel={selectedModel}
      selectedProvider={selectedProvider}
      className={className}
      searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
      filteredModels={filteredModels}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeUseCase={activeUseCase}
      setActiveUseCase={setActiveUseCase}
      activeFeature={activeFeature}
      setActiveFeature={setActiveFeature}
      sortBy={sortBy}
      setSortBy={setSortBy}
      showFeaturedOnly={showFeaturedOnly}
      setShowFeaturedOnly={setShowFeaturedOnly}
      resetFilters={resetFilters}
      onSelectModel={handleSelectModel}
      FEATURE_FILTERS={FEATURE_FILTERS}
      USE_CASE_FILTERS={USE_CASE_FILTERS}
      SORT_OPTIONS={SORT_OPTIONS}
    />
  )
}
