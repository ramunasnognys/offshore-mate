import type { Metadata } from 'next'
import { Inter, Dela_Gothic_One } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const display = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
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
    <html lang="en">
      <body className={`${inter.className} ${display.variable}`}>{children}</body>
    </html>
  )
}