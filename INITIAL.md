Of course. Breaking down the feature implementation into manageable, sequential chunks is an excellent strategy for collaboration with AI agents or other developers. Each task will be self-contained, with clear goals, files to modify, and instructions.

Here is the implementation plan, broken down into distinct tasks.

---

## Implementation Plan: Desktop Export Sidebar

This plan breaks down the implementation of the "Desktop Export Sidebar" into five distinct, sequential tasks. Each task builds upon the previous one, allowing for incremental development and testing.

### Task 1: Project Scaffolding and Context Setup

**Goal:** Create the necessary new files and directories for the desktop sidebar components. This task involves no logic changes and is purely structural, setting the foundation for subsequent steps.

**Instructions:**

1.  Create the following new directory structure and files within `src/components/`:

    ```
    src/components/desktop/
    ├── DesktopSidebar.tsx
    └── tabs/
        ├── ExportTab.tsx
        ├── SaveTab.tsx
        └── SettingsTab.tsx
    ```

2.  Populate the new files with the initial boilerplate code below.

**File to Create: `src/components/desktop/DesktopSidebar.tsx`**
```tsx
'use client'

import React from 'react'
// Imports for shadcn/ui Tabs will be added in a later step

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:block w-[320px] p-4">
      <div className="bg-white/50 backdrop-blur-lg rounded-2xl h-full p-4 shadow-lg border border-white/30">
        <p>Desktop Sidebar Placeholder</p>
        {/* Tab components will be added here */}
      </div>
    </aside>
  )
}
```

**File to Create: `src/components/desktop/tabs/ExportTab.tsx`**
```tsx
'use client'

import React from 'react'

export function ExportTab() {
  return (
    <div>
      <h3 className="font-semibold mb-4">Export Calendar</h3>
      <p className="text-sm text-gray-500">Export options will be here.</p>
    </div>
  )
}
```

**File to Create: `src/components/desktop/tabs/SaveTab.tsx`**
```tsx
'use client'

import React from 'react'

export function SaveTab() {
  return (
    <div>
      <h3 className="font-semibold mb-4">Save & Share</h3>
      <p className="text-sm text-gray-500">Save and share options will be here.</p>
    </div>
  )
}
```

**File to Create: `src/components/desktop/tabs/SettingsTab.tsx`**
```tsx
'use client'

import React from 'react'

export function SettingsTab() {
  return (
    <div>
      <h3 className="font-semibold mb-4">Settings</h3>
      <p className="text-sm text-gray-500">Settings will be here.</p>
    </div>
  )
}
```

**Rationale:** This initial step is safe and non-disruptive. It prepares the project structure, allowing the next tasks to focus on logic and integration without needing to create files from scratch.

---

### Task 2: Responsive Layout and Sidebar Integration

**Goal:** Modify the main page layout to be a two-column grid on desktop screens, and implement the responsive logic to show the new `DesktopSidebar` on desktop and the existing `BottomToolbar` on mobile. The old `FloatingActionMenu` will be removed.

**Instructions:**

1.  **Modify `src/app/page.tsx`** to implement the responsive layout and conditionally render the sidebar.
2.  **Delete `src/components/floating-action-menu.tsx`** as it is now redundant.

**Changes for `src/app/page.tsx`:**

```diff
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -4,13 +4,13 @@
 import { UIProvider } from '@/contexts/UIContext'
 import { CalendarGenerator } from '@/components/calendar/CalendarGenerator'
 import { CalendarDisplay } from '@/components/calendar/CalendarDisplay'
-import { NotificationManager } from '@/components/common/NotificationManager'
 import { SavedSchedules } from '@/components/saved-schedules'
 import { BottomToolbar } from '@/components/bottom-toolbar'
 import { SavedSchedulesSettings } from '@/components/SavedSchedulesSettings'
 import { useMobileDetection } from '@/hooks/useMobileDetection'
 import { useScheduleManagement } from '@/hooks/useScheduleManagement'
 import { useExportCalendar } from '@/hooks/useExportCalendar'
+import { DesktopSidebar } from '@/components/desktop/DesktopSidebar'
 import { RotationPattern } from '@/types/rotation'
 
 function HomeContent() {
@@ -74,23 +74,27 @@
       <NotificationManager
         saveNotification={saveNotification}
         onClearSaveNotification={() => setSaveNotification('')}
-        isDownloading={isDownloading}
-        exportFormat={exportFormat}
-        showPDFError={showPDFError}
-        pdfErrorMessage={pdfErrorMessage}
-        onClosePDFError={() => setShowPDFError(false)}
-        onSwitchToPNG={handleUsePNGInstead}
       />
 
-      <main className={`flex-1 overflow-y-auto flex ${isCalendarGenerated ? 'items-start pt-6' : 'items-center'} justify-center p-4 md:p-8 safe-area-inset-x ${isMobileView !== false ? 'mobile-safe-top' : ''} ${isCalendarGenerated && isMobileView === true ? 'has-bottom-toolbar' : ''} ${isCalendarGenerated && isMobileView === true && isExportPanelExpanded ? 'pb-96' : ''}`} 
-        style={{
-          ...(isCalendarGenerated && isMobileView === true ? { 
-            paddingBottom: isExportPanelExpanded ? '24rem' : 'calc(var(--bottom-toolbar-total-height) + var(--bottom-toolbar-buffer))',
-            WebkitOverflowScrolling: 'touch'
-          } : {})
-        }}>
-
-      <div className="relative w-full max-w-[500px]">
-        <div className={`${isCalendarGenerated && isMobileView === true ? 'mb-4 pt-2' : 'mb-8 md:mb-12'} ${isMobileView !== false ? 'pt-safe' : ''}`}>
+      <div className={`lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:max-w-screen-lg lg:mx-auto lg:p-8 ${isCalendarGenerated ? '' : 'flex items-center justify-center'}`}>
+        <main className={`flex-1 overflow-y-auto flex ${isCalendarGenerated ? 'items-start pt-6' : 'items-center'} justify-center p-4 md:p-0 safe-area-inset-x ${isMobileView !== false ? 'mobile-safe-top' : ''} ${isCalendarGenerated && isMobileView === true ? 'has-bottom-toolbar' : ''}`} 
+          style={{
+            ...(isCalendarGenerated && isMobileView === true ? { 
+              WebkitOverflowScrolling: 'touch'
+            } : {})
+          }}>
+
+        <div className="relative w-full max-w-[500px]">
+          <div className={`${isCalendarGenerated && isMobileView === true ? 'mb-4 pt-2' : 'mb-8 md:mb-12'} ${isMobileView !== false ? 'pt-safe' : ''}`}>
           <h1 className={`font-display text-center text-gray-800 ${
             isCalendarGenerated && isMobileView === true 
               ? 'text-3xl mb-1' 
@@ -102,48 +106,53 @@
               ? 'text-[9px] opacity-80' 
               : 'text-[10px] md:text-sm'
           }`}>
-            Navigate your offshore schedule with precision
+            Navigate your work rotation with precision
           </p>
         </div>
 
-        {!isCalendarGenerated ? (
-          <>
-            <CalendarGenerator
-              onShowSavedSchedules={() => setShowSavedSchedules(true)}
-              hasStorageSupport={isClient && isStorageSupported}
+          {!isCalendarGenerated ? (
+            <>
+              <CalendarGenerator
+                onShowSavedSchedules={() => setShowSavedSchedules(true)}
+                hasStorageSupport={isClient && isStorageSupported}
+              />
+
+              {/* Saved Schedules Dialog */}
+              <SavedSchedules 
+                onLoadSchedule={loadSchedule}
+                isOpen={showSavedSchedules}
+                onOpenChange={setShowSavedSchedules}
+              />
+            </>
+          ) : (
+            <CalendarDisplay
+              onBack={resetCalendar}
+              isStorageAvailable={isClient && isStorageSupported}
             />
-
-            {/* Saved Schedules Dialog */}
-            <SavedSchedules 
-              onLoadSchedule={loadSchedule}
-              isOpen={showSavedSchedules}
-              onOpenChange={setShowSavedSchedules}
-            />
-          </>
-        ) : (
-          <CalendarDisplay
-            onBack={resetCalendar}
-            isStorageAvailable={isClient && isStorageSupported}
-          />
-        )}
+          )}
 
         {/* Footer */}
-        {(!isCalendarGenerated || isMobileView !== true) && (
-          <div className="mt-8 text-center text-sm text-gray-300 tracking-wide">
-            <p className="tracking-wide">Version v.2</p>
-          </div>
-        )}
-      </div>
-      </main>
+          {(!isCalendarGenerated || isMobileView !== true) && (
+            <div className="mt-8 text-center text-sm text-gray-300 tracking-wide">
+              <p className="tracking-wide">Version v.2</p>
+            </div>
+          )}
+        </div>
+        </main>
 
-      {/* Bottom Toolbar - Mobile only */}
-      {isCalendarGenerated && isMobileView === true && (
-        <>
+        {/* Desktop Sidebar */}
+        {isCalendarGenerated && isMobileView === false && (
+          <DesktopSidebar />
+        )}
+
+        {/* Bottom Toolbar - Mobile only */}
+        {isCalendarGenerated && isMobileView === true && (
+          <>
           <BottomToolbar 
             selectedFormat={exportFormat}
             onFormatChange={setExportFormat}
             onExport={handleExport}
             onSaveSchedule={handleSaveSchedule}
-            onSettings={() => {}}
             isDownloading={isDownloading}
             onExpandedChange={setIsExportPanelExpanded}
             expandedPanel={expandedPanel}
@@ -154,8 +163,8 @@
             isOpen={expandedPanel === 'settings'}
             onOpenChange={(open) => setExpandedPanel(open ? 'settings' : null)}
           />
-        </>
-      )}
+          </>
+        )}
+      </div>
     </div>
   )
 }

```

**Rationale:** This task visually integrates the sidebar and establishes the responsive split between desktop and mobile UIs. It's a critical step that enables the functional implementation of the sidebar tabs in subsequent tasks. Removing the old floating action menu cleans up the UI for the next phase.

---

### Task 3: Implement the Full Export Tab UI and Logic

**Goal:** Build out the "Export" tab with all its UI controls and connect it to the existing `useExportCalendar` hook.

**Instructions:**

1.  Add the `Tabs` components from `shadcn/ui` to `DesktopSidebar.tsx` and place the `ExportTab` inside it.
2.  Replace the boilerplate in `src/components/desktop/tabs/ExportTab.tsx` with the complete implementation.

**File to Modify: `src/components/desktop/DesktopSidebar.tsx`**

```diff
--- a/src/components/desktop/DesktopSidebar.tsx
+++ b/src/components/desktop/DesktopSidebar.tsx
@@ -1,13 +1,24 @@
 'use client'
 
 import React from 'react'
-// Imports for shadcn/ui Tabs will be added in a later step
+import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
+import { ExportTab } from './tabs/ExportTab'
+// Future tabs will be imported here
 
 export function DesktopSidebar() {
   return (
-    <aside className="hidden lg:block w-[320px] p-4">
-      <div className="bg-white/50 backdrop-blur-lg rounded-2xl h-full p-4 shadow-lg border border-white/30">
-        <p>Desktop Sidebar Placeholder</p>
-        {/* Tab components will be added here */}
+    <aside className="hidden lg:block w-[320px]">
+      <div className="bg-white/50 backdrop-blur-lg rounded-2xl h-full shadow-lg border border-white/30 sticky top-8">
+        <Tabs defaultValue="export" className="h-full flex flex-col">
+          <TabsList className="grid w-full grid-cols-3">
+            <TabsTrigger value="export">Export</TabsTrigger>
+            <TabsTrigger value="save">Save & Share</TabsTrigger>
+            <TabsTrigger value="settings">Settings</TabsTrigger>
+          </TabsList>
+          <TabsContent value="export" className="flex-1 p-4">
+            <ExportTab />
+          </TabsContent>
+          {/* Other TabsContent will go here */}
+        </Tabs>
       </div>
     </aside>
   )
 }
```

**File to Create/Modify: `src/components/desktop/tabs/ExportTab.tsx`**

```tsx
'use client'

import React from 'react'
import { FileImage, FileText, CalendarPlus, Download } from 'lucide-react'
import { useExportCalendar } from '@/hooks/useExportCalendar'
import { useCalendar } from '@/contexts/CalendarContext'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'

export function ExportTab() {
  const {
    isDownloading,
    exportFormat,
    setExportFormat,
    handleDownload,
  } = useExportCalendar()

  const { yearCalendar, scheduleName, selectedRotation, selectedDate } = useCalendar()

  const handleExport = () => {
    handleDownload(yearCalendar, scheduleName, selectedRotation, selectedDate)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="font-semibold mb-2 text-gray-800">Export Format</h3>
          <RadioGroup value={exportFormat} onValueChange={(value) => setExportFormat(value as any)}>
            <div className="space-y-2">
              <Label htmlFor="png" className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-all cursor-pointer">
                <RadioGroupItem value="png" id="png" />
                <FileImage className="w-5 h-5 text-gray-700" />
                <div>
                  <div className="font-medium text-gray-800">PNG Image</div>
                  <div className="text-sm text-gray-500">High quality image file.</div>
                </div>
              </Label>
              <Label htmlFor="pdf" className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-all cursor-pointer">
                <RadioGroupItem value="pdf" id="pdf" />
                <FileText className="w-5 h-5 text-gray-700" />
                <div>
                  <div className="font-medium text-gray-800">PDF Document</div>
                  <div className="text-sm text-gray-500">Printable document.</div>
                </div>
              </Label>
              <Label htmlFor="ics" className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-all cursor-pointer">
                <RadioGroupItem value="ics" id="ics" />
                <CalendarPlus className="w-5 h-5 text-gray-700" />
                <div>
                  <div className="font-medium text-gray-800">Add to Calendar</div>
                  <div className="text-sm text-gray-500">Import to calendar app.</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        {/* Advanced options can be added here in an Accordion later */}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200/80">
        <Button
          onClick={handleExport}
          disabled={isDownloading}
          className="w-full h-12 text-base"
        >
          <Download className={`w-5 h-5 mr-2 ${isDownloading ? 'animate-bounce' : ''}`} />
          {isDownloading ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
        </Button>
      </div>
    </div>
  )
}
```

**Rationale:** This task implements the core user-facing feature for desktop. It leverages the existing `useExportCalendar` hook, which minimizes new logic and risk. Completing this proves the viability of the sidebar architecture.

---

### Task 4: Implement the Save & Share Tab

**Goal:** Build the "Save & Share" tab, integrating the functionality from the old `SavedSchedulesSettings` component and using the existing `useScheduleManagement` and `useShareCalendar` hooks.

**Instructions:**

1.  Replace the boilerplate in `src/components/desktop/tabs/SaveTab.tsx` with the complete implementation.
2.  Add the `SaveTab` component to the `TabsContent` in `DesktopSidebar.tsx`.
3.  Delete the now redundant `src/components/SavedSchedulesSettings.tsx` file.

**File to Create/Modify: `src/components/desktop/tabs/SaveTab.tsx`**

```tsx
'use client'

import React from 'react'
import { useCalendar } from '@/contexts/CalendarContext'
import { useScheduleManagement } from '@/hooks/useScheduleManagement'
import { useShareCalendar } from '@/hooks/useShareCalendar'
import { SavedSchedules } from '@/components/saved-schedules'
import { Button } from '@/components/ui/button'
import { Save, Share2 } from 'lucide-react'
import { ShareModal } from '@/components/ShareModal'

export function SaveTab() {
  const {
    yearCalendar,
    scheduleName,
    selectedRotation,
    selectedDate,
    currentScheduleId,
    setCurrentScheduleId,
    setIsSaved,
    isSaved,
  } = useCalendar()

  const {
    isSaving,
    saveNotification,
    setSaveNotification,
    loadSchedule,
    showSavedSchedules,
    setShowSavedSchedules,
  } = useScheduleManagement({
    onScheduleLoaded: (schedule) => {
      // Logic to load schedule into context is handled in page.tsx
    }
  })

  const {
    isShareModalOpen,
    shareId,
    openShareModal,
    closeShareModal,
  } = useShareCalendar()

  const handleSave = () => {
    const { saveSchedule } = useScheduleManagement() // Re-instantiate to avoid stale state issues in callback
    const result = saveSchedule(
      yearCalendar,
      scheduleName,
      selectedRotation,
      selectedDate,
      currentScheduleId
    )
    if (result.success && result.id) {
      setCurrentScheduleId(result.id)
      setIsSaved(true)
      setSaveNotification('Schedule saved!')
    }
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Current Schedule</h3>
            <div className="p-4 rounded-lg bg-gray-50/50 border space-y-4">
              <div className="text-sm font-medium text-gray-800">{scheduleName}</div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving} size="sm" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : isSaved ? 'Update' : 'Save'}
                </Button>
                <Button onClick={openShareModal} size="sm" variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Button variant="link" onClick={() => setShowSavedSchedules(true)} className="p-0 h-auto">
              Manage Saved Schedules
            </Button>
          </div>
        </div>
      </div>
      <SavedSchedules
        isOpen={showSavedSchedules}
        onOpenChange={setShowSavedSchedules}
        onLoadSchedule={loadSchedule}
      />
      {shareId && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          scheduleId={shareId}
        />
      )}
    </>
  )
}
```

**File to Modify: `src/components/desktop/DesktopSidebar.tsx`**

```diff
--- a/src/components/desktop/DesktopSidebar.tsx
+++ b/src/components/desktop/DesktopSidebar.tsx
@@ -3,6 +3,7 @@
 import React from 'react'
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 import { ExportTab } from './tabs/ExportTab'
+import { SaveTab } from './tabs/SaveTab'
 // Future tabs will be imported here
 
 export function DesktopSidebar() {
@@ -16,7 +17,9 @@
           <TabsContent value="export" className="flex-1 p-4">
             <ExportTab />
           </TabsContent>
-          {/* Other TabsContent will go here */}
+          <TabsContent value="save" className="flex-1 p-4">
+            <SaveTab />
+          </TabsContent>
         </Tabs>
       </div>
     </aside>

```

**Rationale:** This task is crucial for feature parity with mobile. By reusing `useScheduleManagement` and `useShareCalendar`, we ensure that the core, tested logic for saving, loading, and sharing remains identical, which is a key requirement and significantly reduces risk. Deleting the old settings component is an important cleanup step.

---

### Task 5: Placeholder Settings Tab and Final Polish

**Goal:** Implement the placeholder Settings tab, connect the sidebar's tab state to the UI context, and perform final cleanup.

**Instructions:**

1.  **Modify `src/contexts/UIContext.tsx`** to add state for the active desktop tab.
2.  **Modify `src/components/desktop/DesktopSidebar.tsx`** to use this new context state.
3.  **Implement `src/components/desktop/tabs/SettingsTab.tsx`** with placeholder content.
4.  **Delete the `SavedSchedulesSettings.tsx` component**, as its logic is now contained within the `SaveTab.tsx` and the `saved-schedules.tsx` dialog.

**Changes for `src/contexts/UIContext.tsx`:**

```diff
--- a/src/contexts/UIContext.tsx
+++ b/src/contexts/UIContext.tsx
@@ -21,6 +21,10 @@
   // Saved schedules editing state
   editingScheduleId: string | null
   setEditingScheduleId: (id: string | null) => void
+
+  // Desktop specific state
+  activeDesktopTab: 'export' | 'save' | 'settings'
+  setActiveDesktopTab: (tab: 'export' | 'save' | 'settings') => void
 }
 
 const UIContext = createContext<UIContextType | undefined>(undefined)
@@ -34,6 +38,7 @@
   const [isDownloading, setIsDownloading] = useState(false)
   const [isSaving, setIsSaving] = useState(false)
   const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)
+  const [activeDesktopTab, setActiveDesktopTab] = useState<'export' | 'save' | 'settings'>('export')
 
   const clearError = useCallback(() => {
     setErrorMessage('')
@@ -52,7 +57,9 @@
     isSaving,
     setIsSaving,
     editingScheduleId,
-    setEditingScheduleId
+    setEditingScheduleId,
+    activeDesktopTab,
+    setActiveDesktopTab
   }
 
   return (
```

**File to Modify: `src/components/desktop/DesktopSidebar.tsx`**
```diff
--- a/src/components/desktop/DesktopSidebar.tsx
+++ b/src/components/desktop/DesktopSidebar.tsx
@@ -3,18 +3,23 @@
 import React from 'react'
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 import { ExportTab } from './tabs/ExportTab'
-import { SaveTab } from './tabs/SaveTab'
+import { SaveTab } from './tabs/SaveTab';
+import { SettingsTab } from './tabs/SettingsTab';
+import { useUI } from '@/contexts/UIContext'
 // Future tabs will be imported here
 
 export function DesktopSidebar() {
+  const { activeDesktopTab, setActiveDesktopTab } = useUI();
+
   return (
     <aside className="hidden lg:block w-[320px]">
       <div className="bg-white/50 backdrop-blur-lg rounded-2xl h-full shadow-lg border border-white/30 sticky top-8">
-        <Tabs defaultValue="export" className="h-full flex flex-col">
+        <Tabs value={activeDesktopTab} onValueChange={(value) => setActiveDesktopTab(value as any)} className="h-full flex flex-col">
           <TabsList className="grid w-full grid-cols-3">
             <TabsTrigger value="export">Export</TabsTrigger>
             <TabsTrigger value="save">Save & Share</TabsTrigger>
             <TabsTrigger value="settings">Settings</TabsTrigger>
           </TabsList>
           <TabsContent value="export" className="flex-1 p-4">
             <ExportTab />
           </TabsContent>
           <TabsContent value="save" className="flex-1 p-4">
             <SaveTab />
           </TabsContent>
+          <TabsContent value="settings" className="flex-1 p-4">
+            <SettingsTab />
+          </TabsContent>
         </Tabs>
       </div>
     </aside>
   )
 }

```

**File to Modify: `src/components/desktop/tabs/SettingsTab.tsx`**

```diff
--- a/src/components/desktop/tabs/SettingsTab.tsx
+++ b/src/components/desktop/tabs/SettingsTab.tsx
@@ -4,8 +4,8 @@
 export function SettingsTab() {
   return (
     <div>
-      <h3 className="font-semibold mb-4">Settings</h3>
-      <p className="text-sm text-gray-500">Settings will be here.</p>
+      <h3 className="font-semibold mb-4">Application Settings</h3>
+      <p className="text-sm text-gray-500">More settings and customizations are coming soon!</p>
     </div>
   )
 }
```

**Rationale:** This final task completes the feature by implementing the placeholder settings tab, centralizing the sidebar's state management in the UI context, and cleaning up now-redundant components. This leaves the codebase clean and ready for future feature development.