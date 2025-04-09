"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TextShimmer } from "@/components/motion-primitives/text-shimmer"
import { MODELS_OPTIONS, PROVIDERS_OPTIONS, SUBSCRIPTION_URL } from "@/lib/config"
import { cn } from "@/lib/utils"
import { CaretDown, Check, Crown, Image, MagnifyingGlass, Sparkle, Rocket, Brain, WifiHigh, LightbulbFilament, X, GlobeSimple } from "@phosphor-icons/react"
import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ModelSelectorProps = {
  selectedModelId: string
  setSelectedModelId: (modelId: string) => void
  className?: string
}

// Feature badge config with colors
const FEATURE_CONFIG = {
  "file-upload": {
    label: "Vision",
    icon: Image,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  },
  "web-search": {
    label: "Search",
    icon: GlobeSimple,
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  },
  "reasoning": {
    label: "Reasoning",
    icon: Brain,
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  },
  "deep-reasoning": {
    label: "Deep Reasoning",
    icon: LightbulbFilament,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  "deeper-reasoning": {
    label: "Advanced Reasoning",
    icon: Sparkle,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
}

export function ModelSelector({
  selectedModelId,
  setSelectedModelId,
  className,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  const selectedModel = MODELS_OPTIONS.find((model) => model.id === selectedModelId)
  const selectedProvider = PROVIDERS_OPTIONS.find(
    (provider) => provider.id === selectedModel?.provider
  )

  // Add search input ref for focus management
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Listen for model selector toggle event
  useEffect(() => {
    const handleToggleModelSelector = () => {
      setIsOpen(prev => !prev);
    };

    // Listen for the custom event
    document.addEventListener('toggleModelSelector', handleToggleModelSelector);
    return () => document.removeEventListener('toggleModelSelector', handleToggleModelSelector);
  }, []);

  // Focus search input when dialog opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Use a slight delay to ensure the dialog is fully rendered
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Filter models based on search query and selected provider tab
  const filteredModels = MODELS_OPTIONS.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProvider = activeTab === "all" || model.provider === activeTab
    return matchesSearch && matchesProvider
  })

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId)
    setIsOpen(false)
  }

  // Add keyboard navigation for the model grid
  const handleKeyNavigation = (e: React.KeyboardEvent, modelId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectModel(modelId);
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "dark:bg-secondary justify-between min-w-[160px] border border-zinc-200 dark:border-zinc-800",
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
        
        <DialogContent className="sm:max-w-[650px] p-0 gap-0 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <DialogHeader className="px-6 py-6">
            <DialogTitle>
              Select AI Model
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
            {/* Search */}
            <div className="relative group">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 transition-all duration-300 group-focus-within:text-primary" />
              <Input 
                ref={searchInputRef}
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-muted/40 border-zinc-200 dark:border-zinc-500 transition-all duration-300 rounded-lg"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            
            {/* Provider filter tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start bg-transparent p-0 h-auto space-x-2">
                <TabsTrigger 
                  value="all" 
                  className={`data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-3 py-1 h-auto rounded-full text-xs
                    ${activeTab === "all" && "text-zinc-500 dark:text-zinc-400"}
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
          
          {/* Pro Banner */}
          <a 
            href={SUBSCRIPTION_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block px-4 pt-4"
          >
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-950 dark:text-amber-100 hover:shadow-md dark:hover:shadow-amber-900/10 transition-all duration-300 cursor-pointer rounded-lg mb-2 group">
              <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full border border-amber-200 dark:border-amber-800/50 shadow-sm group-hover:shadow group-hover:scale-105 transition-transform duration-300">
                <Crown weight="fill" className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Upgrade to Pro</span>
                <span className="text-xs text-amber-700 dark:text-amber-300">Unlock all models + higher usage limits</span>
              </div>
              <Rocket className="size-5 ml-auto text-amber-500 dark:text-amber-400 group-hover:translate-y-1 transition-transform duration-300" />
            </div>
          </a>
          
          {/* Models Grid */}
          <div className="p-4 overflow-y-auto max-h-[400px] grid gap-3 grid-cols-1 sm:grid-cols-2">
            {filteredModels.length === 0 ? (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No models found matching your search
              </div>
            ) : (
              filteredModels.map((model) => {
                const provider = PROVIDERS_OPTIONS.find(
                  (provider) => provider.id === model.provider
                )
                const isSelected = selectedModelId === model.id
                const modelFeatures = model.features || []
                
                return (
                  <div
                    key={model.id}
                    onClick={() => model.available && handleSelectModel(model.id)}
                    onKeyDown={(e) => model.available && handleKeyNavigation(e, model.id)}
                    tabIndex={model.available ? 0 : -1}
                    role="button"
                    aria-pressed={isSelected}
                    className={cn(
                      "flex flex-col p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
                      isSelected 
                        ? "border-zinc-500 dark:border-zinc-400 shadow-md" 
                        : "hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm hover:translate-y-[-2px]",
                      !model.available && "opacity-50 cursor-not-allowed",
                      model.available && "cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "flex items-center justify-center p-2 rounded-lg",
                        model.available ? "bg-zinc-100 dark:bg-zinc-800" : "bg-zinc-100/50 dark:bg-zinc-800/50"
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
                        </div>
                        <span className="font-medium truncate">
                          {model.available ? (
                            <TextShimmer>{model.name}</TextShimmer>
                          ) : (
                            model.name
                          )}
                        </span>
                      </div>
                    </div>
                    
                    {/* Feature badges */}
                    {modelFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                        {modelFeatures.filter(f => f.enabled).map((feature) => {
                          const featureConfig = FEATURE_CONFIG[feature.id as keyof typeof FEATURE_CONFIG]
                          if (!featureConfig) return null
                          
                          return (
                            <Tooltip key={feature.id}>
                              <TooltipTrigger asChild>
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs font-normal py-0.5", featureConfig.color)}
                                >
                                  <featureConfig.icon className="size-3 mr-1" />
                                  {featureConfig.label}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This model supports {featureConfig.label.toLowerCase()} capabilities</p>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    )}
                    
                    {!model.available && (
                      <Badge className="w-fit mt-2 bg-zinc-200 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 border-none">
                        Coming soon
                      </Badge>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
