import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'

// Warm loading screen while the GLB and assets load — matches the stage palette.
export default function SceneLoader() {
  const { active, progress } = useProgress()
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    if (active) {
      setMounted(true)
      return undefined
    }
    const t = setTimeout(() => setMounted(false), 500)
    return () => clearTimeout(t)
  }, [active])

  if (!mounted) return null

  const pct = Math.round(progress)
  const barWidth = active ? Math.max(progress, pct === 0 ? 6 : 2) : progress

  return (
    <div className={`scene-loader${active ? '' : ' scene-loader--out'}`} aria-live="polite">
      <div className="scene-loader__panel">
        <div className="scene-loader__brand">
          <span className="scene-loader__dot" />
          Waldemar Paustian
        </div>
        <div className="scene-loader__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="scene-loader__bar" style={{ width: `${barWidth}%` }} />
        </div>
        <div className="scene-loader__pct">{pct}%</div>
      </div>
    </div>
  )
}
