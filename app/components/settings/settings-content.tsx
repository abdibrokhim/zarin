import { cn } from "@/lib/utils"
import { User, PaintRoller, Graph } from "@phosphor-icons/react" 
import { useState, useEffect } from "react"
import { NavItem } from "./common/nav-item"
import { MobileBackHeader } from "./mobile/mobile-back-header"
import { MobileSettingsItem } from "./mobile/mobile-settings-item"
import { AccountTab } from "./tabs/account-tab"
import { AppearanceTab } from "./tabs/appearance-tab"
import { ModelTab } from "./tabs/model-tab"
import { SettingsContentProps, SettingsTab } from "./types"

export function SettingsContent({
  onClose,
  isDrawer = false,
}: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account")
  const [mobileSubview, setMobileSubview] = useState(false)

  // We don't need this effect anymore as it's handled by parent component
  // through the onClose prop when the dialog/drawer is closed
  useEffect(() => {
    // Reset mobile subview when component is initialized
    setMobileSubview(false)
  }, [])

  const handleMobileNavigation = (tab: SettingsTab) => {
    setActiveTab(tab)
    setMobileSubview(true)
  }

  // Render mobile content
  const renderMobileContent = () => {
    if (mobileSubview) {
      return (
        <>
          <MobileBackHeader 
            activeTab={activeTab} 
            onBack={() => setMobileSubview(false)} 
          />
          {activeTab === "account" && <AccountTab isMobile />}
          {activeTab === "appearance" && <AppearanceTab isMobile />}
          {activeTab === "model" && <ModelTab isMobile />}
        </>
      )
    }
    
    // Main mobile menu
    return (
      <div className="space-y-2 p-4">
        <MobileSettingsItem 
          icon={<User className="size-5" />}
          label="Account"
          onClick={() => handleMobileNavigation("account")}
        />
        <MobileSettingsItem 
          icon={<PaintRoller className="size-5" />}
          label="Appearance" 
          onClick={() => handleMobileNavigation("appearance")}
        />
        <MobileSettingsItem 
          icon={<Graph className="size-5" />}
          label="AI Models" 
          onClick={() => handleMobileNavigation("model")}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "max-h-[70vh] overflow-y-auto",
        isDrawer ? "p-0 pb-16" : "py-0"
      )}
    >
      {isDrawer ? (
        <div className="h-full">
          {renderMobileContent()}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-[400px] gap-6">
          {/* Navigation Sidebar */}
          <div className="md:w-56 flex flex-col gap-1 p-2">
            <NavItem 
              icon={<User className="size-4" />}
              label="Account"
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
            />
            <NavItem 
              icon={<PaintRoller className="size-4" />}
              label="Appearance" 
              active={activeTab === "appearance"}
              onClick={() => setActiveTab("appearance")}
            />
            <NavItem 
              icon={<Graph className="size-4" />}
              label="AI Models" 
              active={activeTab === "model"}
              onClick={() => setActiveTab("model")}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {activeTab === "account" && <AccountTab />}
            {activeTab === "appearance" && <AppearanceTab />}
            {activeTab === "model" && <ModelTab />}
          </div>
        </div>
      )}
    </div>
  )
} 