'use client'
import { Terminal } from './Terminal'

// Reduced-motion / mobile / no-WebGL fallback: the same terminal content,
// fully visible in normal document flow, no canvas and no scroll-zoom.
export function StaticExperience() {
  return (
    <main className="min-h-screen bg-[#070a12] px-4 py-16 sm:py-24">
      <Terminal progress={1} variant="static" />
    </main>
  )
}
