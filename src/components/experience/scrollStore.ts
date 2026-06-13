'use client'
import { useSyncExternalStore } from 'react'

// Global scroll progress (0 = top, 1 = bottom), shared between the WebGL frame
// loop (imperative getProgress) and React (useProgress). rAF-coalesced so a
// burst of scroll events produces at most one update per frame.
let progress = 0
let initialized = false
let ticking = false
const listeners = new Set<() => void>()

function recompute() {
  ticking = false
  const max = document.documentElement.scrollHeight - window.innerHeight
  const next = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
  if (next !== progress) {
    progress = next
    listeners.forEach((l) => l())
  }
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(recompute)
}

export function initScrollProgress(): () => void {
  if (initialized || typeof window === 'undefined') return () => {}
  initialized = true
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  recompute()
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    initialized = false
  }
}

export function getProgress(): number {
  return progress
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function useProgress(): number {
  return useSyncExternalStore(subscribe, getProgress, () => 0)
}
