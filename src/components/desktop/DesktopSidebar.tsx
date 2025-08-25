'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExportTab } from './tabs/ExportTab'
import { SaveTab } from './tabs/SaveTab'
import { SettingsTab } from './tabs/SettingsTab'
import { useUI } from '@/contexts/UIContext'
import { ExportFormat } from '@/hooks/useExportCalendar'

interface DesktopSidebarProps {
  exportFormat: ExportFormat
  onFormatChange: (format: ExportFormat) => void
  onExport: () => void
  onSaveSchedule: () => void
  isDownloading: boolean
  onLoadSchedule: (scheduleId: string) => void
}

export function DesktopSidebar({
  exportFormat,
  onFormatChange,
  onExport,
  onSaveSchedule,
  isDownloading,
  onLoadSchedule
}: DesktopSidebarProps) {
  const { activeDesktopTab, setActiveDesktopTab } = useUI()

  return (
    <aside className="hidden lg:block w-[320px]">
      {/* Align sidebar with calendar cards - account for header + spacing */}
      <div className="bg-white/50 backdrop-blur-lg rounded-2xl h-fit shadow-lg border border-white/30 sticky top-8">
        <Tabs value={activeDesktopTab} onValueChange={(value) => setActiveDesktopTab(value as 'export' | 'save' | 'settings')} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="save">Save & Share</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="flex-1 p-4 mt-0">
            <ExportTab 
              selectedFormat={exportFormat}
              onFormatChange={onFormatChange}
              onExport={onExport}
              isDownloading={isDownloading}
            />
          </TabsContent>
          
          <TabsContent value="save" className="flex-1 p-4 mt-0">
            <SaveTab 
              onSaveSchedule={onSaveSchedule}
              onLoadSchedule={onLoadSchedule}
            />
          </TabsContent>
          
          <TabsContent value="settings" className="flex-1 p-4 mt-0">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  )
}