import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeSignTexture } from '../lib/signTexture.js'
import { MODEL_SCALE } from '../data/signs.js'

const _sign = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _scl = new THREE.Vector3()
const warm = new THREE.Color('#ffc488')

// A single navigation plaque, fixed flat on its board, facing the diorama's front.
export default function Sign({ label, to, p, hw, hh, nrm, onSelect, disabled }) {
  const mesh = useRef()
  const [hovered, setHovered] = useState(false)

  const texture = useMemo(() => makeSignTexture(label, hw, hh), [label, hw, hh])

  // Build a fixed orientation: +Z (the plate's front) points along the board normal, kept upright.
  const quaternion = useMemo(() => {
    const f = new THREE.Vector3(nrm[0], nrm[1], nrm[2]).normalize()
    const up = Math.abs(f.y) > 0.95 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0)
    const r = new THREE.Vector3().crossVectors(up, f).normalize()
    const u = new THREE.Vector3().crossVectors(f, r).normalize()
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(r, u, f))
  }, [nrm])

  const normal = useMemo(() => new THREE.Vector3(nrm[0], nrm[1], nrm[2]).normalize(), [nrm])
  const w = (2 * hw) / MODEL_SCALE
  const h = (2 * hh) / MODEL_SCALE

  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    // hide the sign when it faces away from the camera (you orbited behind it)
    m.getWorldPosition(_sign)
    _dir.copy(state.camera.position).sub(_sign)
    m.visible = normal.dot(_dir) > 0
    // smooth hover feedback
    const targetScale = hovered ? 1.07 : 1.0
    m.scale.lerp(_scl.setScalar(targetScale), 0.2)
    const tg = hovered ? 0.45 : 0
    m.material.emissiveIntensity += (tg - m.material.emissiveIntensity) * 0.2
  })

  return (
    <mesh
      ref={mesh}
      position={p}
      quaternion={quaternion}
      renderOrder={999}
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) onSelect?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (disabled) return
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.8}
        metalness={0}
        side={THREE.FrontSide}
        transparent
        depthTest={false}
        depthWrite={false}
        emissive={warm}
        emissiveIntensity={0}
      />
    </mesh>
  )
}
