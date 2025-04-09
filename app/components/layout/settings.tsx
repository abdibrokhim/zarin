"use client"

import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { useUser } from "@/app/providers/user-provider"
import { ModelSelector } from "@/components/common/model-selector"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useChatHistory } from "@/lib/chat-store/chat-history-provider"
import { AUTH_DAILY_MESSAGE_LIMIT, MODEL_DEFAULT } from "@/lib/config"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight, CaretRight, Gear, Moon, PaintBrush, SignOut, Sun, User, X } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

type SettingsTab = "account" | "appearance" | "model"

interface SettingsProps {
  trigger?: React.ReactNode
}

export function Settings({ trigger }: SettingsProps) {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const isMobile = useBreakpoint(768)

  if (!user) return null

  const defaultTrigger = (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      onClick={() => setOpen(true)}
    >
      <User className="size-4" />
      <span>Settings</span>
    </DropdownMenuItem>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger || defaultTrigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>
            <VisuallyHidden>Settings</VisuallyHidden>
          </DrawerTitle>
          <SettingsContent isDrawer onClose={() => setOpen(false)} />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="gap-0 p-0 sm:max-w-3xl rounded-3xl">
        <DialogHeader className="px-6 py-6 mb-2">
          <DialogTitle>
            Settings
          </DialogTitle>
        </DialogHeader>
        <SettingsContent onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function SettingsContent({
  onClose,
  isDrawer = false,
}: {
  onClose: () => void
  isDrawer?: boolean
}) {
  const { user, updateUser, signOut } = useUser()
  const { resetHistory } = useChatHistory()
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(theme || "dark")
  const [selectedModelId, setSelectedModelId] = useState<string>(
    user?.preferred_model || MODEL_DEFAULT
  )
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<SettingsTab>("account")
  const [mobileSubview, setMobileSubview] = useState(false)

  useEffect(() => {
    if (user?.preferred_model) {
      setSelectedModelId(user.preferred_model)
    }
  }, [user?.preferred_model])

  useEffect(() => {
    if (!open) {
      setMobileSubview(false)
    }
  }, [open])

  const handleModelSelection = async (value: string) => {
    setSelectedModelId(value)
    await updateUser({ preferred_model: value })
  }

  const handleSignOut = async () => {
    try {
      await resetHistory()
      await signOut()
      router.push("/")
      toast({ title: "History cleared successfully", status: "success" })
    } catch (e) {
      console.error("Failed to clear history:", e)
      toast({ title: "Failed to clear history", status: "error" })
    }
  }

  const themes = [
    { id: "system", name: "System", colors: ["#ffffff", "#1a1a1a"] },
    { id: "light", name: "Light", colors: ["#ffffff"] },
    { id: "dark", name: "Dark", colors: ["#1a1a1a"] },
  ]

  const handleMobileNavigation = (tab: SettingsTab) => {
    setActiveTab(tab)
    setMobileSubview(true)
  }
  const mobileBackHeader = (
    <div className="mb-4 flex items-center px-4 py-2">
      <Button variant="ghost" size="icon" onClick={() => setMobileSubview(false)}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h2 className="flex-grow text-lg font-medium text-right">
        {activeTab === "account" ? "Account" : 
         activeTab === "appearance" ? "Appearance" : "Model Preferences"}
      </h2>
    </div>
  )

  // Mobile settings option item
  const MobileSettingsItem = ({ 
    icon, 
    label, 
    onClick 
  }: { 
    icon: React.ReactNode, 
    label: string, 
    onClick: () => void 
  }) => (
    <button
      className="flex items-center justify-between w-full px-4 py-3 cursor-pointer hover:bg-accent/30 transition-all duration-300 rounded-xl"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="text-foreground/80">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="opacity-50">
        <CaretRight className="size-4" />
      </div>
    </button>
  )

  if (!user) return null

  // Render mobile content
  const renderMobileContent = () => {
    if (mobileSubview) {
      return (
        <>
          {mobileBackHeader}
          {activeTab === "account" && (
            <div className="space-y-6 px-4">
              {/* User Info */}
              <div className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-muted flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image || "/placeholder.svg"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="text-muted-foreground size-8" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{user?.display_name}</h3>
                    <p className="text-muted-foreground text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Message Usage */}
              <div className="pt-4 mt-4">
                <h3 className="mb-3 text-sm font-medium">Message Usage</h3>
                <div className="bg-secondary rounded-lg p-3">
                  <div className="mb-2 flex justify-between">
                    <span className="text-secondary-foreground text-sm">Today</span>
                    <span className="text-sm font-medium">
                      {user?.daily_message_count} / {AUTH_DAILY_MESSAGE_LIMIT}{" "}
                      messages
                    </span>
                  </div>
                  <div className="bg-muted h-1.5 w-full rounded-full">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{
                        width: `${
                          ((user?.daily_message_count || 0) /
                            AUTH_DAILY_MESSAGE_LIMIT) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs">
                    Limit of {AUTH_DAILY_MESSAGE_LIMIT} messages per day
                  </p>
                </div>
              </div>

              {/* Clear History */}
              <div className="pt-4 mt-4">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full cursor-pointer transition-all duration-300"
                >
                  <SignOut className="mr-2 h-4 w-4" />
                  Clear History
                </Button>
                <p className="text-muted-foreground mt-2 text-xs">
                  This will clear all chat history and reset your data
                </p>
              </div>
            </div>
          )}
          
          {activeTab === "appearance" && (
            <div className="space-y-6 px-4">
              <h3 className="mb-3 text-sm font-medium">Theme</h3>
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
                      "rounded-lg border p-3 transition-all duration-300 hover:bg-accent/30",
                      selectedTheme === themeOption.id
                          ? "border-accent/100 bg-accent/80"
                          : "border-accent/80"
                    )}
                  >
                    <div className="mb-2 flex space-x-1">
                      {themeOption.colors.map((color, i) => (
                        <div
                          key={i}
                          className="h-4 w-4 rounded-full border border-accent/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-left text-sm font-medium">{themeOption.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "model" && (
            <div className="space-y-6 px-4">
              <h3 className="mb-3 text-sm font-medium">Preferred Model</h3>
              <div className="relative">
                <ModelSelector
                  selectedModelId={selectedModelId}
                  setSelectedModelId={handleModelSelection}
                  className="w-full"
                />
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                This model will be used by default for new conversations
              </p>
            </div>
          )}
        </>
      )
    }
    
    // Main mobile menu
    return (
      <div className="space-y-2 p-4">
        <MobileSettingsItem 
          icon={<User className="h-5 w-5" />}
          label="Account"
          onClick={() => handleMobileNavigation("account")}
        />
        <MobileSettingsItem 
          icon={<PaintBrush className="h-5 w-5" />}
          label="Appearance" 
          onClick={() => handleMobileNavigation("appearance")}
        />
        <MobileSettingsItem 
          icon={<Gear className="h-5 w-5" />}
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
          {mobileSubview ? renderMobileContent() : renderMobileContent()}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-[400px] gap-6">
          {/* Navigation Sidebar */}
          <div className="md:w-56 flex flex-col gap-1 p-2">
            <NavItem 
              icon={<User className="h-4 w-4" />}
              label="Account"
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
            />
            <NavItem 
              icon={<PaintBrush className="h-4 w-4" />}
              label="Appearance" 
              active={activeTab === "appearance"}
              onClick={() => setActiveTab("appearance")}
            />
            <NavItem 
              icon={<Gear className="h-4 w-4" />}
              label="AI Models" 
              active={activeTab === "model"}
              onClick={() => setActiveTab("model")}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                {/* User Info */}
                <div className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
                      {user?.profile_image ? (
                        <img
                          src={user.profile_image || "/placeholder.svg"}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="text-muted-foreground size-8" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{user?.display_name}</h3>
                      <p className="text-muted-foreground text-sm">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Message Usage */}
                <div className="pt-4 mt-4">
                  <h3 className="mb-3 text-sm font-medium">Message Usage</h3>
                  <div className="bg-secondary rounded-lg p-3">
                    <div className="mb-2 flex justify-between">
                      <span className="text-secondary-foreground text-sm">Today</span>
                      <span className="text-sm font-medium">
                        {user?.daily_message_count} / {AUTH_DAILY_MESSAGE_LIMIT}{" "}
                        messages
                      </span>
                    </div>
                    <div className="bg-muted h-1.5 w-full rounded-full">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{
                          width: `${
                            ((user?.daily_message_count || 0) /
                              AUTH_DAILY_MESSAGE_LIMIT) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-muted-foreground mt-2 text-xs">
                      Limit of {AUTH_DAILY_MESSAGE_LIMIT} messages per day
                    </p>
                  </div>
                </div>

                {/* Clear History */}
                <div className="pt-4 mt-4">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full cursor-pointer transition-all duration-300"
                  >
                    <SignOut className="mr-2 h-4 w-4" />
                    Clear History
                  </Button>
                  <p className="text-muted-foreground mt-2 text-xs">
                    This will clear all chat history and reset your data
                  </p>
                </div>
              </div>
            )}
            
            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h3 className="mb-3 text-sm font-medium">Theme</h3>
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
                        "rounded-xl border p-3 transition-all duration-300 hover:bg-accent/30",
                        selectedTheme === themeOption.id
                          ? "border-accent/100 bg-accent/80"
                          : "border-accent/80"
                      )}
                    >
                      <div className="mb-2 flex space-x-1">
                        {themeOption.colors.map((color, i) => (
                          <div
                            key={i}
                            className="h-4 w-4 rounded-full border border-accent/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="text-left text-sm font-medium">{themeOption.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Model Preferences Tab */}
            {activeTab === "model" && (
              <div className="space-y-6">
                <h3 className="mb-3 text-sm font-medium">Preferred Model</h3>
                <div className="relative">
                  <ModelSelector
                    selectedModelId={selectedModelId}
                    setSelectedModelId={handleModelSelection}
                    className="w-full"
                  />
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  This model will be used by default for new conversations
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function NavItem({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 text-sm px-4 py-3 w-full text-left rounded-xl transition-all duration-300 cursor-pointer",
        active 
          ? "bg-accent/80 text-primary font-medium" 
          : "text-foreground/70 hover:bg-accent/30"
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
}
