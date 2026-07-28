import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { CommandPalette } from '@/components/CommandPalette'
import { CommandPaletteProvider } from '@/components/CommandPaletteContext'
import { ScrollProgress } from '@/components/ScrollProgress'
import './globals.css'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Chun-Cheng Lee · Portfolio',
  description: 'Backend-focused software engineer. Python/Django, REST APIs, applied AI, Stripe payments.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
        <CommandPaletteProvider>
          <ScrollProgress />
          <CommandPalette />
          {children}
        </CommandPaletteProvider>
        <Analytics />
      </body>
    </html>
  )
}
