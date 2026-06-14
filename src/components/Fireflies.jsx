import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createInsectBuzz } from '../lib/insectBuzz.js'

// Two shared sprite textures: a soft warm glow (fireflies) and a soft dark dot (insects).
const texCache = {}
function getSprite(glow) {
  const key = glow ? 'glow' : 'dot'
  if (texCache[key]) return texCache[key]
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 64
  const x = c.getContext('2d')
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32)
  if (glow) {
    g.addColorStop(0, 'rgba(255,252,238,1)')
    g.addColorStop(0.25, 'rgba(255,226,168,0.85)')
    g.addColorStop(1, 'rgba(255,200,120,0)')
  } else {
    // a small dark insect body: solid-ish core that fades softly at the edge
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.55, 'rgba(255,255,255,1)')
    g.addColorStop(0.8, 'rgba(255,255,255,0.6)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
  }
  x.fillStyle = g
  x.fillRect(0, 0, 64, 64)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  texCache[key] = t
  return t
}

// A small swarm of motes that drift around a point (e.g. a lantern). With `glow` (default)
// they look like warm fireflies; with `glow: false` they're small dark insects buzzing nearby.
// With `buzz`, hovering the swarm plays a gentle wing hum.
export default function Fireflies({
  p, count = 12, radius = 0.22, color = '#ffd9a0', size = 0.05, speed = 1, glow = true, buzz = false,
}) {
  const tex = useMemo(() => getSprite(glow), [glow])
  const refs = useRef([])
  const buzzSound = useRef(null)

  useEffect(() => {
    if (!buzz) return undefined
    buzzSound.current = createInsectBuzz()
    return () => {
      buzzSound.current?.dispose()
      buzzSound.current = null
    }
  }, [buzz])

  // Per-mote wander parameters: an ellipsoidal orbit + random offset, phase and twinkle.
  const parts = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        rx: radius * (0.55 + Math.random() * 0.6),
        ry: radius * (0.35 + Math.random() * 0.5),
        rz: radius * (0.55 + Math.random() * 0.6),
        cx: (Math.random() - 0.5) * radius * 0.5,
        cy: (Math.random() - 0.1) * radius * 0.6,
        cz: (Math.random() - 0.5) * radius * 0.5,
        sx: 0.3 + Math.random() * 0.8,
        sy: 0.6 + Math.random() * 1.4,
        sz: 0.3 + Math.random() * 0.8,
        px: Math.random() * Math.PI * 2,
        py: Math.random() * Math.PI * 2,
        pz: Math.random() * Math.PI * 2,
        tw: 1.5 + Math.random() * 3,
        tp: Math.random() * Math.PI * 2,
        s0: size * (0.6 + Math.random() * 0.8),
      })),
    [count, radius, size],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    for (let i = 0; i < parts.length; i++) {
      const d = parts[i]
      const s = refs.current[i]
      if (!s) continue
      // smooth orbit + a fast small jitter so insects look like they're buzzing
      const jitter = glow ? 0 : radius * 0.12
      s.position.set(
        d.cx + Math.sin(t * d.sx + d.px) * d.rx + (jitter ? Math.sin(t * 9 + d.px) * jitter : 0),
        d.cy + Math.sin(t * d.sy + d.py) * d.ry + (jitter ? Math.cos(t * 11 + d.py) * jitter : 0),
        d.cz + Math.cos(t * d.sz + d.pz) * d.rz + (jitter ? Math.sin(t * 10 + d.pz) * jitter : 0),
      )
      const tw = 0.5 + 0.5 * Math.sin(t * d.tw + d.tp)
      if (glow) {
        s.material.opacity = 0.3 + 0.7 * tw
        s.scale.setScalar(d.s0 * (0.7 + 0.5 * tw))
      } else {
        s.material.opacity = 0.8 + 0.2 * tw
        s.scale.setScalar(d.s0 * (0.9 + 0.15 * tw))
      }
    }
  })

  return (
    <group position={p}>
      {buzz && (
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation()
            buzzSound.current?.start()
          }}
          onPointerOut={() => {
            buzzSound.current?.stop()
          }}
        >
          <sphereGeometry args={[radius * 2.4, 14, 14]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      {parts.map((d, i) => (
        <sprite key={i} ref={(el) => { refs.current[i] = el }}>
          <spriteMaterial
            map={tex}
            color={color}
            transparent
            depthWrite={false}
            blending={glow ? THREE.AdditiveBlending : THREE.NormalBlending}
            opacity={0.9}
          />
        </sprite>
      ))}
    </group>
  )
}
