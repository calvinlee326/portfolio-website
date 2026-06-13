'use client'
import { Canvas } from '@react-three/fiber'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { Scene } from './hero/Scene'

export default function Hero3D() {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== 'light'
  const containerRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [visible, setVisible] = useState(true)

  // Pause the render loop while the hero is scrolled out of view (saves CPU/GPU)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Track the cursor globally so the orb reacts even though the canvas is
  // pointer-events:none (keeps the hero buttons fully clickable)
  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 4]} intensity={1.3} color={dark ? '#22d3ee' : '#60a5fa'} />
        <pointLight position={[-4, -2, -2]} intensity={0.9} color={dark ? '#34d399' : '#a78bfa'} />
        <Scene dark={dark} pointer={pointer} />
      </Canvas>
    </div>
  )
}
