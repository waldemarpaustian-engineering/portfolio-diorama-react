import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeBoardTexture, drawSymbol } from '../lib/boardTexture.js'
import { MODEL_SCALE } from '../data/signs.js'

const CW = 768
const CH = 1024
// Glanz-Sweep timing: a light streak crosses every PERIOD seconds, taking SWEEP seconds.
const PERIOD = 5
const SWEEP = 1.1
// Hover pulse: how fast/strong the symbol beats while hovered.
const PULSE_SPEED = 6
const PULSE_AMOUNT = 0.18

// On hover the symbol shifts toward this bordeaux tone (not black). HOVER_MIX = max blend at full hover.
const HOVER_COLOR = '#6e1622'
const HOVER_MIX = 0.85

// Blends #rrggbb `a` toward #rrggbb `b` by `amt` (0..1). Returns an rgb() string.
function mixColor(a, b, amt) {
  if (typeof a !== 'string' || a[0] !== '#' || a.length < 7) return a
  const na = parseInt(a.slice(1, 7), 16)
  const nb = parseInt(b.slice(1, 7), 16)
  const l = (sa, sb) => Math.round(sa + (sb - sa) * amt)
  return `rgb(${l((na >> 16) & 255, (nb >> 16) & 255)},${l((na >> 8) & 255, (nb >> 8) & 255)},${l(na & 255, nb & 255)})`
}

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
// With `pulse`, the symbol (e.g. a heart) beats while the cursor hovers the board.
// `down` / `side` nudge the plane along the board surface (model units) without changing depth.
export default function Board({
  src, p, nrm, hw, hh, lines, bg, mode, symbol, symbolColor, textColor, pulse = false, shimmer = true, down = 0, side = 0, roll = 0,
}) {
  const baseRef = useRef(null)
  const symRef = useRef(null)
  const hoverRef = useRef(false)
  const anim = useRef({ t: 0, beat: 1, hov: 0, idleDrawn: false })

  // The canvas we actually display (base content + animated shimmer/symbol on top).
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
    const opts = { lines, bg, mode, symbol, symbolColor, textColor, omitSymbol: pulse }
    const apply = (img) => {
      const r = makeBoardTexture(img, opts)
      baseRef.current = r.canvas
      symRef.current = r.symbol
      anim.current.idleDrawn = false
    }
    if (!src) {
      apply(null)
      return undefined
    }
    const img = new Image()
    img.onload = () => apply(img)
    img.src = src
    return () => {
      img.onload = null
    }
  }, [src, lines, bg, mode, symbol, symbolColor, textColor, pulse])

  // Orthonormal basis on the board surface: r = right, u = up, f = outward normal.
  const basis = useMemo(() => {
    const f = new THREE.Vector3(...nrm).normalize()
    const up = Math.abs(f.y) > 0.95 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0)
    const r = new THREE.Vector3().crossVectors(up, f).normalize()
    const u = new THREE.Vector3().crossVectors(f, r).normalize()
    return { r, u, f }
  }, [nrm])

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(basis.r, basis.u, basis.f),
    )
    if (roll) {
      q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), (roll * Math.PI) / 180))
    }
    return q
  }, [basis, roll])

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
    const sweeping = shimmer && phase < SWEEP

    // pulse factor + hover darkening for the symbol
    if (pulse) {
      const target = hoverRef.current ? 1 + Math.sin(a.t * PULSE_SPEED) * PULSE_AMOUNT : 1
      a.beat += (target - a.beat) * (hoverRef.current ? 1 : 0.15)
      a.hov += ((hoverRef.current ? 1 : 0) - a.hov) * 0.18
    }
    const beating = pulse && (hoverRef.current || Math.abs(a.beat - 1) > 0.004 || a.hov > 0.004)

    if (sweeping || beating) {
      ctx.clearRect(0, 0, CW, CH)
      ctx.drawImage(base, 0, 0)
      if (sweeping) drawShimmer(ctx, phase / SWEEP)
      if (pulse && symRef.current) {
        drawSymbol(ctx, symRef.current, a.beat, mixColor(symRef.current.color, HOVER_COLOR, HOVER_MIX * a.hov))
      }
      texture.needsUpdate = true
      a.idleDrawn = false
    } else if (!a.idleDrawn) {
      ctx.clearRect(0, 0, CW, CH)
      ctx.drawImage(base, 0, 0)
      if (pulse && symRef.current) drawSymbol(ctx, symRef.current, 1)
      texture.needsUpdate = true
      a.idleDrawn = true
    }
  })

  const w = (2 * hw) / MODEL_SCALE
  const h = (2 * hh) / MODEL_SCALE

  const hoverProps = pulse
    ? {
        onPointerOver: (e) => {
          e.stopPropagation()
          hoverRef.current = true
        },
        onPointerOut: () => {
          hoverRef.current = false
        },
      }
    : {}

  return (
    <mesh position={pos} quaternion={quaternion} renderOrder={997} {...hoverProps}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0} transparent />
    </mesh>
  )
}
