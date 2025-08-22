'use client'

import React from 'react'
import { Settings, Palette, Download, Info, Mail } from 'lucide-react'

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4 text-gray-800">Application Settings</h3>
        <p className="text-sm text-gray-600 mb-4">
          Customize your Offshore Mate experience.
        </p>
      </div>

      {/* Coming Soon Sections */}
      <div className="space-y-4">
        {/* Export Preferences */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-700">Export Preferences</h4>
          </div>
          <p className="text-xs text-gray-500">
            Default format, quality settings, and naming conventions.
          </p>
          <p className="text-xs text-orange-600 mt-1 font-medium">Coming Soon</p>
        </div>

        {/* Theme Settings */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-700">Appearance</h4>
          </div>
          <p className="text-xs text-gray-500">
            Color themes, dark mode, and calendar customization.
          </p>
          <p className="text-xs text-orange-600 mt-1 font-medium">Coming Soon</p>
        </div>

        {/* Advanced Settings */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-700">Advanced</h4>
          </div>
          <p className="text-xs text-gray-500">
            Keyboard shortcuts, data management, and integrations.
          </p>
          <p className="text-xs text-orange-600 mt-1 font-medium">Coming Soon</p>
        </div>
      </div>

      {/* Current Version Info */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-blue-700">Version Information</h4>
        </div>
        <div className="text-xs text-blue-600 space-y-1">
          <p>Offshore Mate v.2</p>
          <p>Desktop features enabled</p>
          <p>Built with Next.js 15 & TypeScript</p>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="p-3 rounded-lg bg-green-50 border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-green-600" />
          <h4 className="font-medium text-green-700">Have suggestions?</h4>
        </div>
        <p className="text-xs text-green-600 mb-3">
          We're constantly improving Offshore Mate. Your feedback helps us prioritize new features and improvements.
        </p>
        <a 
          href="mailto:offshoremate.app@gmail.com?subject=Offshore Mate Feedback&body=Hi! I have some feedback about Offshore Mate:%0D%0A%0D%0A[Please describe your suggestion, bug report, or feature request here]%0D%0A%0D%0AThanks!"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-800 transition-colors underline underline-offset-2 hover:underline-offset-4"
          aria-label="Send feedback email to Offshore Mate team"
        >
          <Mail className="w-3 h-3" aria-hidden="true" />
          offshoremate.app@gmail.com
        </a>
      </div>
    </div>
  )
}