import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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

// A small swarm of motes that drift around a point (e.g. a lantern). With `follow`, motes
// drift toward the cursor when it comes close and trail behind with staggered lag.
export default function Fireflies({
  p,
  count = 12,
  radius = 0.22,
  color = '#ffd9a0',
  size = 0.05,
  speed = 1,
  glow = true,
  buzz = false,
  follow = false,
  followRadius,
}) {
  const tex = useMemo(() => getSprite(glow), [glow])
  const refs = useRef([])
  const buzzSound = useRef(null)
  const groupRef = useRef()
  const { camera } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(), [])
  const planeNormal = useMemo(() => new THREE.Vector3(), [])
  const hitPoint = useMemo(() => new THREE.Vector3(), [])
  const localCursor = useMemo(() => new THREE.Vector3(), [])
  const worldCenter = useMemo(() => new THREE.Vector3(), [])
  const smooth = useRef({ x: 0, y: 0, z: 0, pull: 0 })

  const reach = followRadius ?? radius * 4.2

  useEffect(() => {
    if (!buzz) return undefined
    buzzSound.current = createInsectBuzz()
    return () => {
      buzzSound.current?.dispose()
      buzzSound.current = null
    }
  }, [buzz])

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

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed
    const sm = smooth.current
    let targetPull = 0

    if (follow && groupRef.current) {
      groupRef.current.getWorldPosition(worldCenter)
      camera.getWorldDirection(planeNormal)
      plane.setFromNormalAndCoplanarPoint(planeNormal, worldCenter)
      raycaster.setFromCamera(state.pointer, camera)
      if (raycaster.ray.intersectPlane(plane, hitPoint)) {
        localCursor.copy(groupRef.current.worldToLocal(hitPoint))
        const dist = localCursor.length()
        if (dist < reach) {
          targetPull = (1 - dist / reach) ** 1.4
          const chase = delta * (5 + targetPull * 8)
          sm.x += (localCursor.x - sm.x) * chase
          sm.y += (localCursor.y - sm.y) * chase
          sm.z += (localCursor.z - sm.z) * chase
        }
      }
    }

    sm.pull += (targetPull - sm.pull) * Math.min(1, delta * 6)
    if (sm.pull < 0.01 && targetPull === 0) {
      const home = delta * 3
      sm.x *= 1 - home
      sm.y *= 1 - home
      sm.z *= 1 - home
    }

    for (let i = 0; i < parts.length; i++) {
      const d = parts[i]
      const s = refs.current[i]
      if (!s) continue

      const jitter = glow ? 0 : radius * 0.12
      let bx = d.cx + Math.sin(t * d.sx + d.px) * d.rx + (jitter ? Math.sin(t * 9 + d.px) * jitter : 0)
      let by = d.cy + Math.sin(t * d.sy + d.py) * d.ry + (jitter ? Math.cos(t * 11 + d.py) * jitter : 0)
      let bz = d.cz + Math.cos(t * d.sz + d.pz) * d.rz + (jitter ? Math.sin(t * 10 + d.pz) * jitter : 0)

      if (follow && sm.pull > 0.01) {
        const lag = 0.22 + (i / parts.length) * 0.58
        const a = sm.pull * lag
        bx += (sm.x - bx) * a
        by += (sm.y - by) * a
        bz += (sm.z - bz) * a
      }

      s.position.set(bx, by, bz)

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
    <group ref={groupRef} position={p}>
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
