import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chun‑Cheng Lee — Portfolio',
  description: 'Backend‑leaning SWE · Python/Django · AI · Stripe · REST APIs',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100">{children}</body>
    </html>
  )
}
