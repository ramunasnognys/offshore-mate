'use client'

import React from 'react'
import { Settings, Palette, Download, Info, Mail } from 'lucide-react'
import { GenerateButton } from '@/components/ui/generate-button'

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2 text-gray-800 text-lg">Application Settings</h3>
        <p className="text-sm text-gray-600">
          Customize your Offshore Mate experience.
        </p>
      </div>

      {/* Coming Soon Sections */}
      <div className="space-y-4">
        {/* Export Preferences */}
        <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
              <Download className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Export Preferences</h4>
              <p className="text-xs text-gray-500 mt-1">Default format, quality settings, and naming conventions.</p>
            </div>
          </div>
          <GenerateButton
            variant="secondary"
            size="sm"
            disabled
            className="mt-2"
          >
            Coming Soon
          </GenerateButton>
        </div>

        {/* Theme Settings */}
        <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
              <Palette className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Appearance</h4>
              <p className="text-xs text-gray-500 mt-1">Color themes, dark mode, and calendar customization.</p>
            </div>
          </div>
          <GenerateButton
            variant="secondary"
            size="sm"
            disabled
            className="mt-2"
          >
            Coming Soon
          </GenerateButton>
        </div>

        {/* Advanced Settings */}
        <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
              <Settings className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Advanced</h4>
              <p className="text-xs text-gray-500 mt-1">Keyboard shortcuts, data management, and integrations.</p>
            </div>
          </div>
          <GenerateButton
            variant="secondary"
            size="sm"
            disabled
            className="mt-2"
          >
            Coming Soon
          </GenerateButton>
        </div>
      </div>

      {/* Current Version Info */}
      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-blue-200">
            <Info className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h4 className="font-medium text-blue-800">Version Information</h4>
            <p className="text-xs text-blue-600 mt-1">Current build and platform information</p>
          </div>
        </div>
        <div className="text-xs text-blue-700 space-y-1 bg-white/50 p-3 rounded-lg">
          <p>Offshore Mate v.2</p>
          <p>Desktop features enabled</p>
          <p>Built with Next.js 15 & TypeScript</p>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="p-4 rounded-xl bg-green-50/50 border border-green-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-green-200">
            <Mail className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h4 className="font-medium text-green-800">Have suggestions?</h4>
            <p className="text-xs text-green-600 mt-1">We&apos;re constantly improving Offshore Mate</p>
          </div>
        </div>
        <p className="text-xs text-green-700 mb-3">
          Your feedback helps us prioritize new features and improvements.
        </p>
        <a 
          href="mailto:offshoremate.app@gmail.com?subject=Offshore Mate Feedback&body=Hi! I have some feedback about Offshore Mate:%0D%0A%0D%0A[Please describe your suggestion, bug report, or feature request here]%0D%0A%0D%0AThanks!"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-800 transition-colors underline underline-offset-2 hover:underline-offset-4"
          aria-label="Send feedback email to Offshore Mate team"
        >
          Contact us
        </a>
      </div>
    </div>
  )
}