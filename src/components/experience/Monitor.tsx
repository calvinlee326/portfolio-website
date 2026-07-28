'use client'
import { RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { NAME } from '@/lib/content'

const SCREEN = '#34d399'
const SCREEN_DIM = '#059669'

// Procedural retro CRT monitor floating in space. The camera dives into the
// screen, so the boot text lives on the screen plane (crisp SDF text).
export function Monitor() {
  const group = useRef<THREE.Group>(null)
  const screenMat = useRef<THREE.MeshStandardMaterial>(null)
  const cursor = useRef<THREE.Object3D>(null)

  useFrame((state) => {
    const g = group.current
    if (!g) return
    // Slow idle float / rotation while it drifts in space
    const t = state.clock.elapsedTime
    g.rotation.y = Math.sin(t * 0.2) * 0.08
    g.rotation.x = Math.sin(t * 0.15) * 0.04
    g.position.y = Math.sin(t * 0.4) * 0.04
    // Subtle CRT flicker + a blinking cursor so the screen reads as powered on
    if (screenMat.current) {
      screenMat.current.emissiveIntensity = 0.6 + Math.sin(t * 23) * 0.02 + Math.sin(t * 7.3) * 0.03
    }
    if (cursor.current) cursor.current.visible = t % 1 < 0.55
  })

  return (
    <group ref={group}>
      {/* Bezel */}
      <RoundedBox args={[3.5, 2.55, 0.35]} radius={0.12} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#161616" metalness={0.4} roughness={0.45} />
      </RoundedBox>

      {/* Screen — emissive so it glows in the dark */}
      <mesh position={[0, 0.08, 0.18]}>
        <planeGeometry args={[3.0, 1.95]} />
        <meshStandardMaterial ref={screenMat} color="#050705" emissive="#06281a" emissiveIntensity={0.6} roughness={0.3} />
      </mesh>

      {/* Light cast by the screen */}
      <pointLight position={[0, 0.1, 0.6]} intensity={0.8} color={SCREEN} distance={4} />

      {/* Boot text on the screen */}
      <group position={[-1.35, 0.78, 0.2]}>
        <Text fontSize={0.15} color={SCREEN} anchorX="left" anchorY="top">portfolio.os v1.0</Text>
        <Text position={[0, -0.32, 0]} fontSize={0.13} color={SCREEN_DIM} anchorX="left" anchorY="top">{'> booting…'}</Text>
        <Text position={[0, -0.62, 0]} fontSize={0.15} color="#e5e5e5" anchorX="left" anchorY="top">{`user: ${NAME}`}</Text>
        <Text position={[0, -0.92, 0]} fontSize={0.13} color="#34d399" anchorX="left" anchorY="top">status: open to work</Text>
        <Text position={[0, -1.4, 0]} fontSize={0.12} color={SCREEN_DIM} anchorX="left" anchorY="top">scroll to enter</Text>
        <Text ref={cursor} position={[1.02, -1.4, 0]} fontSize={0.12} color={SCREEN} anchorX="left" anchorY="top">▌</Text>
      </group>

      {/* Neck + base */}
      <mesh position={[0, -1.55, -0.1]}>
        <cylinderGeometry args={[0.12, 0.16, 0.5, 16]} />
        <meshStandardMaterial color="#161616" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.85, -0.1]}>
        <boxGeometry args={[1.1, 0.12, 0.6]} />
        <meshStandardMaterial color="#101010" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  )
}
