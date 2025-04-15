"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Funnel, MagnifyingGlass, Star, X, SortAscending, CaretDown } from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SearchAndSortProps = {
  searchInputRef: React.RefObject<HTMLInputElement>
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  showFeaturedOnly: boolean
  setShowFeaturedOnly: (show: boolean) => void
  handleInputClick: (e: React.MouseEvent) => void
  SORT_OPTIONS: { value: string, label: string }[]
}

export function SearchAndSort({
  searchInputRef,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  showFeaturedOnly,
  setShowFeaturedOnly,
  handleInputClick,
  SORT_OPTIONS,
}: SearchAndSortProps) {
  // Find the current sort option label
  const currentSortOption = SORT_OPTIONS.find(option => option.value === sortBy)?.label || 'Sort by'
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="relative group flex-grow" onClick={handleInputClick}>
        <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 transition-all duration-300 group-focus-within:text-primary" />
        <Input 
          ref={searchInputRef}
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-muted/40 border-border dark:border-border transition-all duration-300 rounded-lg w-full"
          onClick={handleInputClick}
        />
        {searchQuery && (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setSearchQuery("")
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      
      {/* Sort and filters for mobile and desktop */}
      <div className="flex h-full gap-2 justify-end">
        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 w-[140px] md:w-[180px] justify-between">
              <div className="flex items-center">
                <SortAscending className="size-4 mr-2" />
                <span>{currentSortOption}</span>
              </div>
              <CaretDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end"
            className="w-[180px] bg-background"
          >
            {SORT_OPTIONS.map(option => (
              <DropdownMenuItem 
                key={option.value}
                className="cursor-pointer"
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 