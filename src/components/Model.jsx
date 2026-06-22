import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

// Loads the Draco-compressed GLB. The Draco decoder is self-hosted at /draco/
// instead of drei's default Google CDN (gstatic) — for GDPR compliance.
export default function Model(props) {
  const { scene } = useGLTF('/treehouse-optimized.glb', '/draco/')
  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
  }, [scene])
  return <primitive object={scene} {...props} />
}

useGLTF.preload('/treehouse-optimized.glb', '/draco/')
