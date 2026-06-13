'use client'
import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface SceneProps {
  dark: boolean
  pointer: RefObject<{ x: number; y: number }>
}

export function Scene({ dark, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)

  useFrame(() => {
    const g = group.current
    if (!g) return
    const { x, y } = pointer.current
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, x * 0.6, 0.04)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.4, 0.04)
    g.rotation.z += 0.0015
  })

  return (
    <group ref={group}>
      <Icosahedron args={[1.4, 12]}>
        <MeshDistortMaterial
          color={dark ? '#0ea5e9' : '#3b82f6'}
          emissive={dark ? '#0369a1' : '#1d4ed8'}
          emissiveIntensity={0.45}
          roughness={0.18}
          metalness={0.55}
          distort={0.4}
          speed={1.6}
        />
      </Icosahedron>
    </group>
  )
}
