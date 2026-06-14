import { useEffect, useRef, useState } from 'react'
import { createSoundscape } from '../lib/soundscape.js'

// Small speaker button that fades the procedural nature soundscape in/out.
// Starts off (browsers block autoplay until a user gesture — this click is the gesture).
export default function SoundToggle() {
  const sound = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    sound.current = createSoundscape()
    return () => sound.current?.dispose()
  }, [])

  const toggle = () => {
    const next = !on
    setOn(next)
    sound.current?.setEnabled(next)
  }

  return (
    <button
      className="sound-toggle"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Ton ausschalten' : 'Ton einschalten'}
      title={on ? 'Ton aus' : 'Ton an'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        {on ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <>
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </>
        )}
      </svg>
    </button>
  )
}
