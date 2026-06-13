'use client'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Monitor } from './Monitor'
import { CameraRig } from './CameraRig'

// The space scene: starfield + the CRT monitor, with the camera diving in.
// Always rendered against deep-space dark regardless of theme.
export default function SceneCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 42 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#03040a']} />
      <fog attach="fog" args={['#03040a', 7, 18]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[3, 3, 5]} intensity={1.1} color="#22d3ee" />
      <pointLight position={[-4, -2, 3]} intensity={0.5} color="#a78bfa" />
      <Stars radius={70} depth={45} count={3500} factor={4} saturation={0} fade speed={0.8} />
      <Monitor />
      <CameraRig />
    </Canvas>
  )
}
