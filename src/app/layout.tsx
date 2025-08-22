import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { getHomepageMetadata } from '@/lib/seo/metadata'

// Load Inter font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Load Dela Gothic One font
const delaGothic = localFont({
  src: '../fonts/DelaGothicOne-Regular.ttf',
  variable: '--font-dela-gothic',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'], // Provide fallback fonts
})

// Comprehensive SEO metadata using our enhanced system
export const metadata: Metadata = getHomepageMetadata()

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${delaGothic.variable}`}>
      <body className={`${inter.className}`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}