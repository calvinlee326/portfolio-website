'use client'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getProgress } from './scrollStore'

// Dollies the camera from far out in space straight into the monitor screen
// over the first ~half of the scroll. After that it holds at the screen.
export function CameraRig() {
  useFrame((state) => {
    const p = getProgress()
    const zoomP = Math.min(p / 0.5, 1)
    const eased = 1 - Math.pow(1 - zoomP, 3)
    const targetZ = THREE.MathUtils.lerp(9, 0.8, eased)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1)

    // Gentle parallax drift while still approaching, settling to centered on dive
    const drift = 1 - eased
    const t = state.clock.elapsedTime
    const px = (Math.sin(t * 0.2) * 0.3 + state.pointer.x * 0.5) * drift
    const py = (Math.cos(t * 0.15) * 0.2 + state.pointer.y * 0.3) * drift
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, px, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, py, 0.05)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}
