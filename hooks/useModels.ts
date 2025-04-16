import { useEffect, useMemo } from 'react'
import { MODELS_OPTIONS, PROVIDERS_OPTIONS } from "@/lib/models/config"
import { FeatureId, UseCaseId } from "@/lib/models/types"

type UseModelsProps = {
  selectedModelId: string
  searchQuery: string
  activeTab: string
  activeUseCase: string
  activeFeature: string
  sortBy: string
  showFeaturedOnly: boolean
}

export function useModels({
  selectedModelId,
  searchQuery,
  activeTab,
  activeUseCase,
  activeFeature,
  sortBy,
  showFeaturedOnly
}: UseModelsProps) {
  // Find selected model and provider
  const selectedModel = useMemo(() => 
    MODELS_OPTIONS.find((model) => model.id === selectedModelId),
    [selectedModelId]
  )
  
  const selectedProvider = useMemo(() => 
    PROVIDERS_OPTIONS.find((provider) => provider.id === selectedModel?.provider),
    [selectedModel]
  )
  
  // Filter models based on all criteria
  const filteredModels = useMemo(() => {
    // First apply all filtering criteria
    let filtered = MODELS_OPTIONS.filter((model) => {
      // Text search match
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Provider match
      const matchesProvider = activeTab === "all" || model.provider === activeTab
      
      // Use case match (if a specific use case is selected)
      let matchesUseCase = true
      if (activeUseCase !== "all") {
        matchesUseCase = model.use_cases?.some(uc => 
          uc.id === activeUseCase && uc.enabled
        ) || false
      }
      
      // Feature match (if a specific feature is selected)
      let matchesFeature = true
      if (activeFeature !== "all") {
        matchesFeature = model.features?.some(f => 
          f.id === activeFeature && f.enabled
        ) || false
      }
      
      // Featured only filter (if enabled)
      const matchesFeatured = !showFeaturedOnly || model.featured === true
      
      // Combine all filters
      return matchesSearch && matchesProvider && matchesUseCase && 
             matchesFeature && matchesFeatured && model.available !== false
    })
    
    // Then sort the filtered results
    if (sortBy === "featured") {
      filtered = [...filtered].sort((a, b) => {
        // First by featured status (featured first)
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        
        // If both have same featured status, sort alphabetically
        return a.name.localeCompare(b.name)
      })
    } else {
      // Default sorting (relevance) - by name
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    }
    
    return filtered
  }, [searchQuery, activeTab, activeUseCase, activeFeature, sortBy, showFeaturedOnly])
  
  return {
    filteredModels,
    selectedModel,
    selectedProvider
  }
} 