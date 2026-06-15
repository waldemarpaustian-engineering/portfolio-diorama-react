import { useState } from 'react'
import TechSlideshowCanvas from './TechSlideshowCanvas.jsx'

// Vintage computer mockup with the live tech slideshow on its CRT.
export default function RetroComputer() {
  const [ready, setReady] = useState(false)

  return (
    <figure className="retro-computer">
      <img
        src="/retro-computer.png"
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
