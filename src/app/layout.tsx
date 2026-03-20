import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { Providers } from '@/components/Providers'
import { CommandPalette } from '@/components/CommandPalette'
import { ScrollProgress } from '@/components/ScrollProgress'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chun‑Cheng Lee — Portfolio',
  description: 'Backend‑leaning SWE · Python/Django · AI · Stripe · REST APIs',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Providers>
          <ScrollProgress />
          <CommandPalette />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
