import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeBoardTexture } from '../lib/boardTexture.js'
import { MODEL_SCALE } from '../data/signs.js'

const CW = 768
const CH = 1024
// Glanz-Sweep timing: a light streak crosses every PERIOD seconds, taking SWEEP seconds.
const PERIOD = 5
const SWEEP = 1.1

// Draws a soft diagonal light streak across the board at a given progress (0..1).
function drawShimmer(ctx, progress) {
  const band = CW * 0.22
  const cx = -band + progress * (CW + 2 * band)
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.translate(cx, 0)
  ctx.rotate(-0.32)
  const g = ctx.createLinearGradient(-band, 0, band, 0)
  g.addColorStop(0, 'rgba(255,255,255,0)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.22)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(-band, -CH, 2 * band, 3 * CH)
  ctx.restore()
}

// A crisp overlay on the chalkboard/easel with an automatic, decorative glint sweep.
// `down` / `side` nudge the plane along the board surface (in model units) without
// changing its depth, so it always stays flush on the (tilted) board.
export default function Board({ src, p, nrm, hw, hh, lines, bg, mode, down = 0, side = 0, roll = 0 }) {
  const baseRef = useRef(null)
  const anim = useRef({ t: 0, idleDrawn: false })

  // The canvas we actually display (base content + animated shimmer composited on top).
  const display = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = CW
    c.height = CH
    return c
  }, [])

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(display)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [display])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      baseRef.current = makeBoardTexture(img, { lines, bg, mode })
      anim.current.idleDrawn = false
    }
    img.src = src
    return () => {
      img.onload = null
    }
  }, [src, lines, bg, mode])

  // Orthonormal basis on the board surface: r = right, u = up, f = outward normal.
  const basis = useMemo(() => {
    const f = new THREE.Vector3(...nrm).normalize()
    const up = Math.abs(f.y) > 0.95 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0)
    const r = new THREE.Vector3().crossVectors(up, f).normalize()
    const u = new THREE.Vector3().crossVectors(f, r).normalize()
    return { r, u, f }
  }, [nrm])

  // Base orientation from the surface, then an optional roll around the normal (in
  // degrees) so the overlay can be aligned with a tilted board frame.
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(basis.r, basis.u, basis.f),
    )
    if (roll) {
      q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), (roll * Math.PI) / 180))
    }
    return q
  }, [basis, roll])

  // Lift slightly off the surface (along the normal) to avoid z-fighting, then slide
  // along the board's own up/right axes so a "down" shift never sinks it into the model.
  const pos = useMemo(() => {
    const v = new THREE.Vector3(...p).addScaledVector(basis.f, 0.008)
    if (down) v.addScaledVector(basis.u, -down)
    if (side) v.addScaledVector(basis.r, side)
    return v
  }, [p, basis, down, side])

  useFrame((_, delta) => {
    const base = baseRef.current
    if (!base) return
    const ctx = display.getContext('2d')
    const a = anim.current
    a.t += delta
    const phase = a.t % PERIOD

    if (phase < SWEEP) {
      ctx.clearRect(0, 0, CW, CH)
      ctx.drawImage(base, 0, 0)
      drawShimmer(ctx, phase / SWEEP)
      texture.needsUpdate = true
      a.idleDrawn = false
    } else if (!a.idleDrawn) {
      // draw the clean base once after the streak has passed
      ctx.clearRect(0, 0, CW, CH)
      ctx.drawImage(base, 0, 0)
      texture.needsUpdate = true
      a.idleDrawn = true
    }
  })

  const w = (2 * hw) / MODEL_SCALE
  const h = (2 * hh) / MODEL_SCALE

  return (
    <mesh position={pos} quaternion={quaternion} renderOrder={997}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0} transparent />
    </mesh>
  )
}
