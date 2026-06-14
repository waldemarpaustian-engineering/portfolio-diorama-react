import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Loader } from '@react-three/drei'
import Model from './Model.jsx'
import Sign from './Sign.jsx'
import { SIGNS, MODEL_SCALE, VIEW } from '../data/signs.js'

// default camera position derived from the framing in data/signs.js
const camPos = [
  VIEW.radius * Math.sin(VIEW.phi) * Math.sin(VIEW.theta),
  VIEW.radius * Math.cos(VIEW.phi),
  VIEW.radius * Math.sin(VIEW.phi) * Math.cos(VIEW.theta),
]

export default function Scene() {
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
              <Sign key={s.to} {...s} />
            ))}
          </group>
        </Suspense>

        <OrbitControls
          enableDamping
          enablePan={false}
          target={[0, 0, 0]}
          minDistance={5}
          maxDistance={22}
          minPolarAngle={0.25}
          maxPolarAngle={1.5}
        />
      </Canvas>

      <Loader />
    </div>
  )
}
