import { useState, useCallback } from 'react'

// Custom hook to manage filter state for the model selector
export function useFilters() {
  // Search query state
  const [searchQuery, setSearchQuery] = useState("")
  
  // Filter states
  const [activeTab, setActiveTab] = useState("all")
  const [activeUseCase, setActiveUseCase] = useState("all")
  const [activeFeature, setActiveFeature] = useState("all")
  
  // Sort and visibility states
  const [sortBy, setSortBy] = useState("relevance")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  
  // Reset all filters function
  const resetFilters = useCallback(() => {
    setSearchQuery("")
    setActiveTab("all")
    setActiveUseCase("all")
    setActiveFeature("all")
    setSortBy("relevance")
    setShowFeaturedOnly(false)
  }, [])
  
  return {
    // Search
    searchQuery,
    setSearchQuery,
    
    // Filters
    activeTab,
    setActiveTab,
    activeUseCase,
    setActiveUseCase,
    activeFeature,
    setActiveFeature,
    
    // Sort and visibility
    sortBy,
    setSortBy,
    showFeaturedOnly,
    setShowFeaturedOnly,
    
    // Helpers
    resetFilters,
  }
} 