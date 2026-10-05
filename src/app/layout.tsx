import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { CommandPalette } from '@/components/CommandPalette'
import { CommandPaletteProvider } from '@/components/CommandPaletteContext'
import { ScrollProgress } from '@/components/ScrollProgress'
import { NAME, SITE_URL } from '@/lib/content'
import './globals.css'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

const title = `${NAME} · Portfolio`
const description = 'Backend-focused software engineer. Python/Django, REST APIs, applied AI, Stripe payments.'

// The preview image comes from app/opengraph-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: { type: 'website', url: '/', siteName: NAME, title, description },
  twitter: { card: 'summary_large_image', title, description },
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
