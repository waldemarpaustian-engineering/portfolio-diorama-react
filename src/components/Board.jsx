import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { makeBoardTexture } from '../lib/boardTexture.js'
import { MODEL_SCALE } from '../data/signs.js'

// A crisp overlay on the chalkboard/easel: sketch + "Dream / Plan / Do" text.
// `down` / `side` nudge the plane along the board surface (in model units) without
// changing its depth, so it always stays flush on the (tilted) board.
export default function Board({ src, p, nrm, hw, hh, lines, bg, down = 0, side = 0, roll = 0 }) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setTexture(makeBoardTexture(img, lines, bg))
    img.src = src
    return () => {
      img.onload = null
    }
  }, [src, lines, bg])

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

  const w = (2 * hw) / MODEL_SCALE
  const h = (2 * hh) / MODEL_SCALE

  if (!texture) return null

  return (
    <mesh position={pos} quaternion={quaternion} renderOrder={997}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0} transparent />
    </mesh>
  )
}
