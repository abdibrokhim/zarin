import type React from "react"

export type SettingsTab = "account" | "appearance" | "model"

export interface SettingsProps {
  trigger?: React.ReactNode
}

export interface SettingsContentProps {
  onClose: () => void
  isDrawer?: boolean
}

export interface NavItemProps {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}

export interface MobileSettingsItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export interface MobileBackHeaderProps {
  activeTab: SettingsTab
  onBack: () => void
} 