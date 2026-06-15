import { Cloud, Clouds } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../hooks/useTheme.js'

// Warm, fluffy background clouds — light mode only, behind the diorama.
export default function SkyClouds() {
  const theme = useTheme()
  if (theme === 'dark') return null

  return (
    <group position={[0, 1.5, -6]}>
      <pointLight position={[2, 10, -12]} intensity={0.55} color="#fff3dc" distance={42} decay={2} />
      <pointLight position={[-10, 7, -14]} intensity={0.35} color="#ffe8c8" distance={36} decay={2} />
      <Clouds limit={140} range={52} material={THREE.MeshBasicMaterial}>
        <Cloud
          seed={1}
          segments={22}
          bounds={[16, 3.2, 2]}
          volume={10}
          color="#fffaf2"
          fade={100}
          speed={0.1}
          growth={3.2}
          opacity={0.68}
          position={[0, 5, -16]}
        />
        <Cloud
          seed={2}
          segments={20}
          bounds={[12, 2.8, 2]}
          volume={8}
          color="#fff5e8"
          fade={95}
          speed={0.08}
          growth={2.8}
          opacity={0.62}
          position={[-14, 4.5, -12]}
        />
        <Cloud
          seed={3}
          segments={20}
          bounds={[13, 2.4, 2]}
          volume={8.5}
          color="#fff9f0"
          fade={98}
          speed={0.12}
          growth={3}
          opacity={0.65}
          position={[15, 3.8, -14]}
        />
        <Cloud
          seed={4}
          segments={18}
          bounds={[10, 2.2, 2]}
          volume={6.5}
          color="#ffefd6"
          fade={90}
          speed={0.07}
          growth={2.4}
          opacity={0.55}
          position={[-7, 7, -18]}
        />
        <Cloud
          seed={5}
          segments={16}
          bounds={[9, 2, 2]}
          volume={5.5}
          color="#fff3e4"
          fade={88}
          speed={0.09}
          growth={2.2}
          opacity={0.5}
          position={[9, 6.5, -20]}
        />
      </Clouds>
    </group>
  )
}
