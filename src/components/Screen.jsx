import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { drawTech } from '../lib/screenTexture.js'
import { MODEL_SCALE } from '../data/signs.js'

// Seconds each technology stays on screen, and how long the crossfade to the next lasts.
const PERIOD = 2.4
const FADE = 0.7

// A crisp, self-lit overlay on the monitor that cycles through technology logos.
export default function Screen({ tech, p, nrm, hw, hh }) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = Math.round((1024 * hh) / hw)
    return c
  }, [hw, hh])

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [canvas])

  // Orient the plane so its front (+Z) points along the monitor's surface normal.
  const quaternion = useMemo(() => {
    const f = new THREE.Vector3(...nrm).normalize()
    const up = Math.abs(f.y) > 0.95 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0)
    const r = new THREE.Vector3().crossVectors(up, f).normalize()
    const u = new THREE.Vector3().crossVectors(f, r).normalize()
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(r, u, f))
  }, [nrm])

  // Lift the plane slightly off the surface (along the normal) to avoid z-fighting.
  const pos = useMemo(() => {
    const f = new THREE.Vector3(...nrm).normalize()
    return new THREE.Vector3(...p).addScaledVector(f, 0.008)
  }, [p, nrm])

  const w = (2 * hw) / MODEL_SCALE
  const h = (2 * hh) / MODEL_SCALE
  const anim = useRef({ t: 0, idx: 0, lastIdx: -1 })

  useFrame((_, delta) => {
    if (!tech.length) return
    const a = anim.current
    a.t += delta
    if (a.t >= PERIOD) {
      a.t -= PERIOD
      a.idx = (a.idx + 1) % tech.length
    }

    const fading = a.t > PERIOD - FADE
    // Only repaint while fading or right after switching — saves work during the hold.
    if (!fading && a.lastIdx === a.idx) return

    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    drawTech(ctx, W, H, tech[a.idx], 1)
    if (fading) {
      const next = tech[(a.idx + 1) % tech.length]
      drawTech(ctx, W, H, next, (a.t - (PERIOD - FADE)) / FADE)
    }

    a.lastIdx = a.idx
    texture.needsUpdate = true
  })

  return (
    <mesh position={pos} quaternion={quaternion} renderOrder={998}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} toneMapped={false} transparent />
    </mesh>
  )
}
