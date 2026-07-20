'use client'
import { useEffect, useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useCommandPalette } from '@/components/CommandPaletteContext'
import { StaticExperience } from '@/components/experience/StaticExperience'
import { Terminal } from '@/components/experience/Terminal'
import { initScrollProgress, useProgress } from '@/components/experience/scrollStore'
import { rangeProgress } from '@/components/experience/util'

// three stays out of the server bundle and the initial client bundle
const SceneCanvas = dynamic(() => import('@/components/experience/SceneCanvas'), { ssr: false })

function canEnhance(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.matchMedia('(hover: none)').matches) return false
  if (window.innerWidth < 768) return false
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

// Decided once on the client. SSR + hydration see `false` (static fallback),
// then it upgrades to the 3D experience if the device supports it.
let enhanceCache: boolean | null = null
function getEnhanceSnapshot(): boolean {
  if (enhanceCache === null) enhanceCache = canEnhance()
  return enhanceCache
}
const noopSubscribe = () => () => {}

function useEnhanced(): boolean {
  return useSyncExternalStore(noopSubscribe, getEnhanceSnapshot, () => false)
}

function TopBar() {
  const { setOpen } = useCommandPalette()
  return (
    <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 sm:px-6">
      <span className="font-mono text-sm font-bold text-slate-200">~/chun-cheng</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setOpen(true)}
          className="hidden rounded-lg px-2 py-1 font-mono text-xs text-slate-400 transition hover:bg-white/10 hover:text-slate-200 sm:block"
          aria-label="Open command palette"
        >
          ⌘K
        </button>
        <a
          href="/classic"
          className="rounded-lg px-2 py-1 font-mono text-xs text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
        >
          classic↗
        </a>
        <ThemeToggle />
      </div>
    </div>
  )
}

function Enhanced() {
  const progress = useProgress()
  useEffect(() => initScrollProgress(), [])

  const terminalOpacity = rangeProgress(progress, 0.42, 0.55)
  const canvasOpacity = 1 - rangeProgress(progress, 0.5, 0.66) * 0.85
  const showHint = progress < 0.04

  // Spring-smoothed so the reveal eases in rather than tracking the scrollbar linearly.
  const opacityMV = useMotionValue(terminalOpacity)
  const smoothOpacity = useSpring(opacityMV, { stiffness: 120, damping: 20 })
  useEffect(() => opacityMV.set(terminalOpacity), [terminalOpacity, opacityMV])

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#03040a]" style={{ opacity: canvasOpacity }}>
        <SceneCanvas />
      </div>

      {/* Scroll driver — gives the page height the zoom + reveal scrub against */}
      <div style={{ height: '600vh' }} aria-hidden />

      <motion.div
        className="fixed inset-0 z-10 flex items-center justify-center p-4 sm:p-8"
        style={{ opacity: smoothOpacity, pointerEvents: progress > 0.5 ? 'auto' : 'none' }}
      >
        <Terminal progress={progress} variant="fixed" />
      </motion.div>

      <TopBar />

      <div
        className="pointer-events-none fixed inset-x-0 bottom-8 z-20 flex flex-col items-center gap-1 font-mono text-xs text-slate-400 transition-opacity duration-500"
        style={{ opacity: showHint ? 1 : 0 }}
      >
        <span>scroll to enter</span>
        <span className="animate-bounce">↓</span>
      </div>
    </>
  )
}

export default function Page() {
  const enhanced = useEnhanced()
  // SSR + reduced/mobile/no-WebGL → accessible static terminal (content in HTML)
  if (!enhanced) return <StaticExperience />
  return <Enhanced />
}
