import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

// Loads the Draco-compressed GLB. drei sets up the Draco decoder automatically
// (loaded from its default CDN, gstatic.com) so it always matches the library
// version. Note: this is a third-party request — see the privacy policy.
export default function Model(props) {
  const { scene } = useGLTF('/treehouse-optimized.glb')
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

useGLTF.preload('/treehouse-optimized.glb')
