import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useProgress } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import * as THREE from 'three'
import Model from './Model.jsx'
import Sign from './Sign.jsx'
import Screen from './Screen.jsx'
import Board from './Board.jsx'
import Fireflies from './Fireflies.jsx'
import SoundToggle from './SoundToggle.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import SceneLoader from './SceneLoader.jsx'
import { useTheme } from '../hooks/useTheme.js'
import { SIGNS, LANTERNS, SWARMS, SCREEN, BOARDS, MODEL_SCALE, VIEW } from '../data/signs.js'
import { TECH } from '../data/tech.js'

// default camera position derived from the framing in data/signs.js
const camPos = [
  VIEW.radius * Math.sin(VIEW.phi) * Math.sin(VIEW.theta),
  VIEW.radius * Math.cos(VIEW.phi),
  VIEW.radius * Math.sin(VIEW.phi) * Math.cos(VIEW.theta),
]

// Calm sign transition: glide toward the plaque, then white blur dissolve → new page.
const TRANSITION_DURATION = 1.4
const GLIDE_PORTION = 0.55
const FADE_START = 0.28
const FLY_DISTANCE = 2.5

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2
}

function easeOutQuad(t) {
  return 1 - (1 - t) ** 2
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

// Slow dolly toward the island after assets load — replaces blur/fog reveal.
const INTRO_DURATION = 2.1
const INTRO_PULLBACK = 1.32

function IntroCamera({ controlsRef, ready, onDone }) {
  const { camera } = useThree()
  const anim = useRef(null)
  const finished = useRef(false)

  const endPos = useMemo(() => new THREE.Vector3(...camPos), [])
  const startPos = useMemo(() => {
    const v = endPos.clone().multiplyScalar(INTRO_PULLBACK)
    v.y += 0.45
    return v
  }, [endPos])

  useEffect(() => {
    if (!ready || finished.current) return
    camera.position.copy(startPos)
    anim.current = { t: 0 }
    if (controlsRef.current) controlsRef.current.enabled = false
  }, [ready, camera, controlsRef, startPos])

  useFrame((_, delta) => {
    const a = anim.current
    if (!a || finished.current) return
    a.t = Math.min(1, a.t + delta / INTRO_DURATION)
    const e = easeOutCubic(a.t)
    camera.position.lerpVectors(startPos, endPos, e)
    if (controlsRef.current) {
      controlsRef.current.update()
      if (a.t >= 1) controlsRef.current.enabled = true
    }
    if (a.t >= 1) {
      anim.current = null
      finished.current = true
      onDone?.()
    }
  })

  return null
}

function CameraRig({ controlsRef, target, onPortalProgress, onArrive }) {
  const { camera } = useThree()
  const anim = useRef(null)

  useEffect(() => {
    if (!target) return
    const signWorld = new THREE.Vector3(...target.p).multiplyScalar(MODEL_SCALE)
    const normal = new THREE.Vector3(...target.nrm).normalize()
    const toPos = signWorld.clone().add(normal.clone().multiplyScalar(FLY_DISTANCE))
    toPos.y += 0.12

    anim.current = {
      t: 0,
      to: target.to,
      fromPos: camera.position.clone(),
      toPos,
      fromTarget: controlsRef.current?.target.clone() ?? new THREE.Vector3(),
      toTarget: signWorld.clone(),
    }
    onPortalProgress?.(0)
    if (controlsRef.current) controlsRef.current.enabled = false
  }, [target, camera, controlsRef, onPortalProgress])

  useFrame((_, delta) => {
    const a = anim.current
    if (!a) return

    a.t = Math.min(1, a.t + delta / TRANSITION_DURATION)
    const glideT = Math.min(1, a.t / GLIDE_PORTION)
    const e = easeInOutCubic(glideT)

    camera.position.lerpVectors(a.fromPos, a.toPos, e)
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(a.fromTarget, a.toTarget, e)
      controlsRef.current.update()
    }

    const fadeT = Math.max(0, (a.t - FADE_START) / (1 - FADE_START))
    onPortalProgress?.(easeOutQuad(fadeT))

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
// `pulseAmount` / `pulseSpeed` control how strongly the light beats (default = subtle flicker).
function Lantern({
  p,
  color = LANTERN_COLOR,
  intensity = LANTERN_INTENSITY,
  distance = LANTERN_DISTANCE,
  pulseAmount = 0.1,
  pulseSpeed = 7,
  pulseFloor,
}) {
  const light = useRef()

  // Nudge the light inward (toward origin) so it radiates around the lantern, incl. behind.
  const pos = useMemo(() => {
    const v = new THREE.Vector3(p[0], p[1], p[2])
    if (v.lengthSq() > 1e-6) v.addScaledVector(v.clone().normalize(), -LANTERN_INWARD)
    return v
  }, [p])

  // Pulse between `floor` (darkest) and `peak` (brightest). `pulseFloor` lets the dark dip
  // drop deeper than the bright peak rises, for a stronger "breathing" feel.
  const floor = pulseFloor != null ? pulseFloor : 1 - pulseAmount
  const peak = 1 + pulseAmount

  useFrame((state) => {
    if (light.current) {
      const s = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * pulseSpeed + p[0] * 10)
      light.current.intensity = intensity * (floor + (peak - floor) * s)
    }
  })

  return (
    <pointLight ref={light} position={pos} color={color} intensity={intensity} distance={distance} decay={2} />
  )
}

// The model + signs + lanterns, gently bobbing up and down like the original site.
function FloatingWorld({ disabled, onSelect }) {
  const group = useRef()
  const [placed, setPlaced] = useState([])
  const { t } = useTranslation()

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
        <Sign key={s.to} {...s} label={t(`signs.${s.to.slice(1)}`)} disabled={disabled} onSelect={() => onSelect(s)} />
      ))}
      {[...LANTERNS, ...placed].map((l, i) => (
        <Lantern key={i} {...l} />
      ))}
      {SWARMS.map((s, i) => (
        <Fireflies key={i} {...s} />
      ))}
      {SCREEN && <Screen tech={TECH} {...SCREEN} />}
      {BOARDS.map((b, i) => (
        <Board key={b.gallery?.[0] ?? b.src ?? i} {...b} />
      ))}
    </group>
  )
}

export default function Scene() {
  const navigate = useNavigate()
  const controlsRef = useRef()
  const [flyTarget, setFlyTarget] = useState(null)
  const [portal, setPortal] = useState(0)
  const [introDone, setIntroDone] = useState(false)
  const { active: loading } = useProgress()
  const { t } = useTranslation()
  const theme = useTheme()
  const uiFade = Math.max(0, 1 - portal * 1.6)
  const blur = portal * 18

  const uiStyle = {
    opacity: introDone ? uiFade : 0,
    transition: 'opacity 1.1s ease 0.15s',
  }

  return (
    <div className="stage">
      <nav className="nav" style={uiStyle}>
        <div className="brand"><span className="mk" /> Waldemar&nbsp;Paustian</div>
        <div className="nav-actions">
          <LanguageSwitcher />
          <ThemeToggle />
          <SoundToggle />
        </div>
      </nav>

      <div className="intro" style={{ ...uiStyle, pointerEvents: uiFade < 0.05 ? 'none' : undefined }}>
        <h1>{t('nav.title')}</h1>
        <p>{t('nav.subtitle')}</p>
      </div>

      <div className="stage-canvas">
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

        <IntroCamera
          controlsRef={controlsRef}
          ready={!loading}
          onDone={() => setIntroDone(true)}
        />

        <CameraRig
          controlsRef={controlsRef}
          target={flyTarget}
          onPortalProgress={setPortal}
          onArrive={navigate}
        />
      </Canvas>
      </div>

      <div
        className="portal-overlay"
        style={{
          opacity: portal > 0.004 ? 1 : 0,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          background: theme === 'dark'
            ? `rgba(8, 8, 14, ${portal * 0.92})`
            : `rgba(252, 250, 247, ${portal * 0.92})`,
        }}
        aria-hidden={portal < 0.01}
      />

      <SceneLoader />
    </div>
  )
}
