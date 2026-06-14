import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { drawTech, drawCRT } from '../lib/screenTexture.js'
import { createMonitorGlitch } from '../lib/monitorGlitch.js'
import { MODEL_SCALE } from '../data/signs.js'

// Seconds each technology stays on screen, and how long the crossfade to the next lasts.
const PERIOD = 2.4
const FADE = 0.7

// Pseudo-random 0..1 for per-frame glitch flicker on the mesh.
function frameRand(t, n) {
  const f = Math.floor(t * 60)
  return Math.abs(Math.sin(f * 12.9898 + n * 78.233) * 43758.5453) % 1
}

// A crisp, self-lit overlay on the monitor that cycles through technology logos.
// On hover it glitches like a failing CRT and plays a crackly static sound.
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

  const quaternion = useMemo(() => {
    const f = new THREE.Vector3(...nrm).normalize()
    const up = Math.abs(f.y) > 0.95 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0)
    const r = new THREE.Vector3().crossVectors(up, f).normalize()
    const u = new THREE.Vector3().crossVectors(f, r).normalize()
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(r, u, f))
  }, [nrm])

  const pos = useMemo(() => {
    const f = new THREE.Vector3(...nrm).normalize()
    return new THREE.Vector3(...p).addScaledVector(f, 0.008)
  }, [p, nrm])

  const w = (2 * hw) / MODEL_SCALE
  const h = (2 * hh) / MODEL_SCALE
  const anim = useRef({ t: 0, idx: 0, lastIdx: -1, hov: 0, scan: 0 })
  const hoverRef = useRef(false)
  const matRef = useRef()
  const glowRef = useRef()
  const groupRef = useRef()
  const glitchSound = useRef(null)

  useEffect(() => {
    glitchSound.current = createMonitorGlitch()
    return () => {
      glitchSound.current?.dispose()
      glitchSound.current = null
    }
  }, [])

  useFrame((_, delta) => {
    if (!tech.length) return
    const a = anim.current
    a.t += delta
    a.scan += delta
    a.hov += ((hoverRef.current ? 1 : 0) - a.hov) * Math.min(1, delta * 10)
    if (a.t >= PERIOD) {
      a.t -= PERIOD
      a.idx = (a.idx + 1) % tech.length
    }

    const fading = a.t > PERIOD - FADE
    const glitching = a.hov > 0.02
    // Repaint every frame while glitching (animated overlay), or when the slide changes/fades.
    if (glitching || fading || a.lastIdx !== a.idx) {
      const ctx = canvas.getContext('2d')
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      drawTech(ctx, W, H, tech[a.idx], 1)
      if (fading) {
        const next = tech[(a.idx + 1) % tech.length]
        drawTech(ctx, W, H, next, (a.t - (PERIOD - FADE)) / FADE)
      }
      if (glitching) drawCRT(ctx, W, H, a.hov, a.scan)

      a.lastIdx = a.idx
      texture.needsUpdate = true
    }

    if (matRef.current) {
      const r = frameRand(a.scan, 0)
      const r2 = frameRand(a.scan, 1)
      // harsh brightness swings + occasional near-blackout on the mesh
      let bright = 1 + 0.35 * a.hov
      if (glitching) {
        bright *= 0.55 + r * 0.9
        if (r2 > 0.78) bright *= 0.08
        else if (r2 > 0.62) bright *= 0.35
      }
      matRef.current.color.setScalar(Math.max(0.05, bright))
      matRef.current.opacity = glitching && r > 0.88 ? 0.15 + r2 * 0.3 : 1
    }
    if (glowRef.current) {
      const r = frameRand(a.scan, 2)
      glowRef.current.opacity = glitching ? (0.2 + r * 0.55) * a.hov : 0
    }
    // tiny positional jitter — screen "twitches"
    if (groupRef.current && glitching) {
      const j = w * 0.012 * a.hov
      groupRef.current.position.set(
        pos.x + (frameRand(a.scan, 3) - 0.5) * j,
        pos.y + (frameRand(a.scan, 4) - 0.5) * j * 0.6,
        pos.z + (frameRand(a.scan, 5) - 0.5) * j * 0.3,
      )
    } else if (groupRef.current) {
      groupRef.current.position.copy(pos)
    }
  })

  return (
    <group
      ref={groupRef}
      quaternion={quaternion}
      onPointerOver={(e) => {
        e.stopPropagation()
        hoverRef.current = true
        glitchSound.current?.start()
      }}
      onPointerOut={() => {
        hoverRef.current = false
        glitchSound.current?.stop()
      }}
    >
      <mesh renderOrder={997} scale={[1.06, 1.09, 1]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          ref={glowRef}
          map={texture}
          toneMapped={false}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh renderOrder={998}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial ref={matRef} map={texture} toneMapped={false} transparent />
      </mesh>
    </group>
  )
}
