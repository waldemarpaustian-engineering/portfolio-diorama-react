import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Loader } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import Model from './Model.jsx'
import Sign from './Sign.jsx'
import Screen from './Screen.jsx'
import Board from './Board.jsx'
import { SIGNS, LANTERNS, SCREEN, BOARD, MODEL_SCALE, VIEW } from '../data/signs.js'
import { TECH } from '../data/tech.js'

// default camera position derived from the framing in data/signs.js
const camPos = [
  VIEW.radius * Math.sin(VIEW.phi) * Math.sin(VIEW.theta),
  VIEW.radius * Math.cos(VIEW.phi),
  VIEW.radius * Math.sin(VIEW.phi) * Math.cos(VIEW.theta),
]

// How long the camera takes to glide toward a sign before the page opens (seconds).
const FLY_DURATION = 0.9
// How far in front of the sign the camera comes to rest.
const FLY_DISTANCE = 3.5

// Drives a smooth camera glide toward a selected sign, then navigates.
function CameraRig({ controlsRef, target, onArrive }) {
  const { camera } = useThree()
  const anim = useRef(null)

  useEffect(() => {
    if (!target) return
    const signWorld = new THREE.Vector3(...target.p).multiplyScalar(MODEL_SCALE)
    const normal = new THREE.Vector3(...target.nrm).normalize()
    const toPos = signWorld.clone().add(normal.multiplyScalar(FLY_DISTANCE))
    toPos.y += 0.2

    anim.current = {
      t: 0,
      to: target.to,
      fromPos: camera.position.clone(),
      toPos,
      fromTarget: controlsRef.current?.target.clone() ?? new THREE.Vector3(),
      toTarget: signWorld.clone(),
    }
    if (controlsRef.current) controlsRef.current.enabled = false
  }, [target, camera, controlsRef])

  useFrame((_, delta) => {
    const a = anim.current
    if (!a) return
    a.t = Math.min(1, a.t + delta / FLY_DURATION)
    // easeInOutCubic
    const e = a.t < 0.5 ? 4 * a.t ** 3 : 1 - (-2 * a.t + 2) ** 3 / 2

    camera.position.lerpVectors(a.fromPos, a.toPos, e)
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(a.fromTarget, a.toTarget, e)
      controlsRef.current.update()
    }

    if (a.t >= 1) {
      anim.current = null
      onArrive(a.to)
    }
  })

  return null
}

// Amplitude / speed of the idle up-and-down float (ported from the old HTML version).
const FLOAT_AMPLITUDE = 0.12
const FLOAT_SPEED = 0.9

// Default look of a glowing lantern (values are in the model's own coordinate space).
const LANTERN_COLOR = '#ffb14d'
const LANTERN_INTENSITY = 9
const LANTERN_DISTANCE = 1.6
// How far to push the light from the clicked (front) surface toward the model's
// center, so it sits inside the lantern and glows in every direction, not just forward.
const LANTERN_INWARD = 0.07
// Placement mode: open the site with `?lights` to click lanterns into place.
const LANTERN_PROBE =
  typeof window !== 'undefined' && /[?&]lights\b/.test(window.location.search)

// A warm point light that lights the model's own lantern from its center — no fake bulb.
function Lantern({ p, color = LANTERN_COLOR, intensity = LANTERN_INTENSITY }) {
  const light = useRef()

  // Nudge the light inward (toward origin) so it radiates around the lantern, incl. behind.
  const pos = useMemo(() => {
    const v = new THREE.Vector3(p[0], p[1], p[2])
    if (v.lengthSq() > 1e-6) v.addScaledVector(v.clone().normalize(), -LANTERN_INWARD)
    return v
  }, [p])

  useFrame((state) => {
    // subtle flicker on the light itself so the glow feels alive
    if (light.current) {
      const f = 0.9 + Math.sin(state.clock.elapsedTime * 7 + p[0] * 10) * 0.1
      light.current.intensity = intensity * f
    }
  })

  return (
    <pointLight ref={light} position={pos} color={color} intensity={intensity} distance={LANTERN_DISTANCE} decay={2} />
  )
}

// The model + signs + lanterns, gently bobbing up and down like the original site.
function FloatingWorld({ disabled, onSelect }) {
  const group = useRef()
  const [placed, setPlaced] = useState([])

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * FLOAT_SPEED) * FLOAT_AMPLITUDE
    }
  })

  // In placement mode, clicking the model logs the model-space position (and surface
  // normal) of the click — used to place lanterns and the screen overlay precisely.
  const handleProbeClick = (e) => {
    if (!group.current) return
    e.stopPropagation()
    const local = group.current.worldToLocal(e.point.clone())
    const p = [
      Number(local.x.toFixed(4)),
      Number(local.y.toFixed(4)),
      Number(local.z.toFixed(4)),
    ]

    let nrmStr = ''
    if (e.face) {
      const nWorld = e.face.normal.clone().transformDirection(e.object.matrixWorld).normalize()
      const inv = new THREE.Matrix4().copy(group.current.matrixWorld).invert()
      const nLocal = nWorld.transformDirection(inv).normalize()
      nrmStr = `, nrm: [${nLocal.x.toFixed(3)}, ${nLocal.y.toFixed(3)}, ${nLocal.z.toFixed(3)}]`
    }

    // eslint-disable-next-line no-console
    console.log(`{ p: [${p.join(', ')}]${nrmStr} },`)
    setPlaced((prev) => [...prev, { p }])
  }

  return (
    <group
      ref={group}
      scale={MODEL_SCALE}
      onClick={LANTERN_PROBE ? handleProbeClick : undefined}
    >
      <Model />
      {SIGNS.map((s) => (
        <Sign key={s.to} {...s} disabled={disabled} onSelect={() => onSelect(s)} />
      ))}
      {[...LANTERNS, ...placed].map((l, i) => (
        <Lantern key={i} {...l} />
      ))}
      {SCREEN && <Screen tech={TECH} {...SCREEN} />}
      {BOARD && <Board src="/castle-sketch.png" {...BOARD} />}
    </group>
  )
}

export default function Scene() {
  const navigate = useNavigate()
  const controlsRef = useRef()
  const [flyTarget, setFlyTarget] = useState(null)

  return (
    <div className="stage">
      <nav className="nav">
        <div className="brand"><span className="mk" /> Waldemar&nbsp;Paustian</div>
      </nav>

      <div className="intro">
        <h1>A little world<br />of things I’ve made.</h1>
        <p>Drag to look around. Click a sign to open a page.</p>
      </div>

      <Canvas shadows camera={{ position: camPos, fov: 35 }}>
        <hemisphereLight args={['#ffffff', '#cfc6ba', 0.7]} />
        <ambientLight intensity={0.18} />
        <directionalLight
          castShadow
          position={[6, 12, 7]}
          intensity={1.9}
          color="#fff5ec"
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={60}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0005}
        />
        <directionalLight position={[-7, 5, -7]} intensity={0.4} color="#cfe0ff" />

        <Suspense fallback={null}>
          <FloatingWorld disabled={!!flyTarget} onSelect={setFlyTarget} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableDamping
          enablePan={false}
          target={[0, 0, 0]}
          minDistance={5}
          maxDistance={22}
          minPolarAngle={0.25}
          maxPolarAngle={1.5}
        />

        <CameraRig controlsRef={controlsRef} target={flyTarget} onArrive={navigate} />
      </Canvas>

      <Loader />
    </div>
  )
}
