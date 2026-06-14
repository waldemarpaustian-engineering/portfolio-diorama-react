import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Loader } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import Model from './Model.jsx'
import Sign from './Sign.jsx'
import { SIGNS, MODEL_SCALE, VIEW } from '../data/signs.js'

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
          <group scale={MODEL_SCALE}>
            <Model />
            {SIGNS.map((s) => (
              <Sign
                key={s.to}
                {...s}
                disabled={!!flyTarget}
                onSelect={() => setFlyTarget(s)}
              />
            ))}
          </group>
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
