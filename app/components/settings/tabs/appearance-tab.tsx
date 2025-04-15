import { cn } from "@/lib/utils"
import { Sunglasses, MoonStars, Browser } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function AppearanceTab({ isMobile = false }: { isMobile?: boolean }) {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(theme || "dark")

  useEffect(() => {
    if (theme) {
      setSelectedTheme(theme)
    }
  }, [theme])

  const themes = [
    { id: "light", name: "Light", icon: <Sunglasses className="size-4" /> },
    { id: "dark", name: "Dark", icon: <MoonStars className="size-4" /> },
    { id: "system", name: "System", icon: <Browser className="size-4" /> },
  ]

  return (
    <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
      <div className="grid grid-cols-3 gap-3">
        {themes.map((themeOption) => (
          <button
            key={themeOption.id}
            type="button"
            onClick={() => {
              setSelectedTheme(themeOption.id)
              setTheme(themeOption.id)
            }}
            className={cn(
              isMobile 
                ? "rounded-lg border p-3 transition-all duration-300 hover:bg-accent/30"
                : "rounded-xl border p-3 transition-all duration-300 hover:bg-accent/30 flex flex-col items-center justify-center",
              selectedTheme === themeOption.id
                ? "border-accent/100 bg-accent/80"
                : "border-accent/80"
            )}
          >
            <div className="mb-2 flex space-x-1">
              {themeOption.icon}
            </div>
            <p className="text-left text-sm font-medium">{themeOption.name}</p>
          </button>
        ))}
      </div>
    </div>
  )
} 