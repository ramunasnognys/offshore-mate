import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'Offshore Calendar',
  description: 'Generate offshore work rotation schedules',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${delaGothic.variable}`}>
      <body className={`${inter.className}`}>
        {children}
      </body>
    </html>
  )
}