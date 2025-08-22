'use client'

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react'

interface UIContextType {
  // Error handling
  errorMessage: string
  setErrorMessage: (message: string) => void
  clearError: () => void
  
  // Settings dialog
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  isEditingName: boolean
  setIsEditingName: (editing: boolean) => void
  
  // Client-side state
  isClient: boolean
  setIsClient: (client: boolean) => void
  
  // Loading states
  isDownloading: boolean
  setIsDownloading: (downloading: boolean) => void
  isSaving: boolean
  setIsSaving: (saving: boolean) => void

  // Saved schedules editing state
  editingScheduleId: string | null
  setEditingScheduleId: (id: string | null) => void

  // Desktop specific state
  activeDesktopTab: 'export' | 'save' | 'settings'
  setActiveDesktopTab: (tab: 'export' | 'save' | 'settings') => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [errorMessage, setErrorMessage] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)
  const [activeDesktopTab, setActiveDesktopTab] = useState<'export' | 'save' | 'settings'>('export')

  const clearError = useCallback(() => {
    setErrorMessage('')
  }, [])

  const value: UIContextType = {
    errorMessage,
    setErrorMessage,
    clearError,
    showSettings,
    setShowSettings,
    isEditingName,
    setIsEditingName,
    isClient,
    setIsClient,
    isDownloading,
    setIsDownloading,
    isSaving,
    setIsSaving,
    editingScheduleId,
    setEditingScheduleId,
    activeDesktopTab,
    setActiveDesktopTab
  }

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}