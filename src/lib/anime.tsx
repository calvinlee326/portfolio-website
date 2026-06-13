'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { animate } from 'animejs'

const REDUCED = '(prefers-reduced-motion: reduce)'
const TOUCH = '(hover: none)'

function motionDisabled(): boolean {
  return window.matchMedia(REDUCED).matches || window.matchMedia(TOUCH).matches
}

// Magnetic hover: the element eases toward the cursor and springs back on leave.
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || motionDisabled()) return
    const target: T = el

    function onMove(e: PointerEvent) {
      const r = target.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      animate(target, { translateX: x, translateY: y, duration: 350, ease: 'out(3)' })
    }
    function onLeave() {
      animate(target, { translateX: 0, translateY: 0, duration: 600, ease: 'out(4)' })
    }

    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerleave', onLeave)
    return () => {
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])
  return ref
}

// 3D tilt: the card rotates toward the cursor in perspective for a depth feel.
function useTilt<T extends HTMLElement>(max: number) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || motionDisabled()) return
    const target: T = el

    target.style.transition = 'transform 200ms ease-out'
    function onMove(e: PointerEvent) {
      const r = target.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      target.style.transform = `perspective(800px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`
    }
    function onLeave() {
      target.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    }

    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerleave', onLeave)
    return () => {
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerleave', onLeave)
    }
  }, [max])
  return ref
}

export function Tilt({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useTilt<HTMLDivElement>(max)
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
