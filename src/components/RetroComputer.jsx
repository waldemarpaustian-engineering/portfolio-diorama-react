import { useEffect, useState } from 'react'
import TechSlideshowCanvas from './TechSlideshowCanvas.jsx'
import { useTheme } from '../hooks/useTheme.js'

// Vintage computer mockup with the live tech slideshow on its CRT.
export default function RetroComputer() {
  const theme = useTheme()
  const frameSrc = theme === 'dark' ? '/retro-computer-dark.png' : '/retro-computer.png'
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
  }, [frameSrc])

  return (
    <figure className={`retro-computer retro-computer--${theme}`}>
      <img
        src={frameSrc}
        alt=""
        className="retro-computer__frame"
        loading="lazy"
        decoding="async"
        onLoad={() => setReady(true)}
      />
      {ready && (
        <div className="retro-computer__screen">
          <TechSlideshowCanvas className="retro-computer__canvas" variant="card" />
        </div>
      )}
    </figure>
  )
}
