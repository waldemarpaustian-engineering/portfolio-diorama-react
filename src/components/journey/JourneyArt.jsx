// Hand-cut paper style SVG scenes — placeholders until custom illustrations land in /public/journey/.

import { useState } from 'react'

function PaperShadow({ children, className = '' }) {
  return (
    <div className={`journey-art ${className}`}>
      <div className="journey-art__shadow" aria-hidden />
      {children}
    </div>
  )
}

export function JourneyArt({ variant }) {
  switch (variant) {
    case 'studium':
      return (
        <PaperShadow className="journey-art journey-art--studium">
          <img
            src="/journey/art-studium-early-web.png"
            alt=""
            aria-hidden
            decoding="async"
            draggable={false}
          />
        </PaperShadow>
      )
    case 'banking':
      return (
        <PaperShadow className="journey-art journey-art--banking">
          <img
            src="/journey/art-banking.png"
            alt=""
            aria-hidden
            decoding="async"
            draggable={false}
          />
        </PaperShadow>
      )
    case 'frameworks':
      return (
        <PaperShadow className="journey-art journey-art--frameworks">
          <img
            src="/journey/art-frameworks.png"
            alt=""
            aria-hidden
            decoding="async"
            draggable={false}
          />
        </PaperShadow>
      )
    case 'chatbot':
      return (
        <PaperShadow className="journey-art--chatbot">
          <svg viewBox="0 0 200 160" aria-hidden>
            <ellipse cx="78" cy="72" rx="42" ry="30" fill="#f8f4ec" stroke="#2b2a33" strokeWidth="2" />
            <path d="M52 72c-8 12-8 24 0 36" fill="none" stroke="#2b2a33" strokeWidth="2" />
            <rect x="118" y="52" width="52" height="40" rx="4" fill="#fff" stroke="#2b2a33" strokeWidth="2" />
            <path d="M126 78h36M126 68h28" stroke="#4a7fd4" strokeWidth="2" strokeLinecap="round" />
            <circle cx="152" cy="58" r="8" fill="#8b9aff" stroke="#2b2a33" strokeWidth="1.5" />
          </svg>
        </PaperShadow>
      )
    case 'startup':
      return (
        <PaperShadow className="journey-art--startup">
          <svg viewBox="0 0 200 160" aria-hidden>
            <path d="M100 118c-20-40-20-72 0-90 20 18 20 50 0 90z" fill="#c8f0c8" stroke="#2b2a33" strokeWidth="2" />
            <path d="M100 118c20-40 20-72 0-90" fill="#a8d8a8" stroke="#2b2a33" strokeWidth="2" />
            <rect x="72" y="118" width="56" height="14" rx="3" fill="#e8dcc8" stroke="#2b2a33" strokeWidth="1.8" />
            <circle cx="148" cy="48" r="14" fill="#ffe8c8" stroke="#2b2a33" strokeWidth="1.8" />
          </svg>
        </PaperShadow>
      )
    case 'mobility':
      return (
        <PaperShadow className="journey-art--mobility">
          <svg viewBox="0 0 200 160" aria-hidden>
            <rect x="30" y="100" width="140" height="10" rx="2" fill="#d4c4a8" stroke="#2b2a33" strokeWidth="2" />
            <rect x="55" y="72" width="70" height="22" rx="6" fill="#b8ddf5" stroke="#2b2a33" strokeWidth="2" />
            <circle cx="68" cy="102" r="10" fill="#2b2a33" />
            <circle cx="112" cy="102" r="10" fill="#2b2a33" />
            <path d="M48 72h20l8-16h48l8 16" fill="#f8f4ec" stroke="#2b2a33" strokeWidth="2" />
          </svg>
        </PaperShadow>
      )
    case 'design':
      return (
        <PaperShadow className="journey-art--design">
          <svg viewBox="0 0 200 160" aria-hidden>
            <rect x="42" y="44" width="48" height="32" rx="4" fill="#fff" stroke="#2b2a33" strokeWidth="2" />
            <rect x="98" y="44" width="48" height="32" rx="4" fill="#fff" stroke="#2b2a33" strokeWidth="2" />
            <rect x="42" y="88" width="48" height="32" rx="4" fill="#b8ddf5" stroke="#2b2a33" strokeWidth="2" />
            <rect x="98" y="88" width="48" height="32" rx="4" fill="#ffe8c8" stroke="#2b2a33" strokeWidth="2" />
            <circle cx="66" cy="58" r="6" fill="#4a7fd4" />
            <rect x="110" y="54" width="24" height="4" rx="1" fill="#d6e4f0" />
          </svg>
        </PaperShadow>
      )
    case 'today':
    default:
      return (
        <PaperShadow className="journey-art--today">
          <svg viewBox="0 0 200 160" aria-hidden>
            <path d="M100 36c-8 0-14 10-14 22v8h28v-8c0-12-6-22-14-22z" fill="#ffe8c8" stroke="#2b2a33" strokeWidth="2" />
            <rect x="86" y="66" width="28" height="36" rx="4" fill="#f8f4ec" stroke="#2b2a33" strokeWidth="2" />
            <circle cx="100" cy="88" r="10" fill="#fff6d8" stroke="#2b2a33" strokeWidth="1.5" />
            <path d="M70 118h60" stroke="#8b9aff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <rect x="128" y="96" width="36" height="28" rx="4" fill="#fff" stroke="#2b2a33" strokeWidth="1.8" />
            <circle cx="146" cy="110" r="6" fill="none" stroke="#4a7fd4" strokeWidth="2" />
          </svg>
        </PaperShadow>
      )
  }
}

export const WALKER_BOY_FRAMES = Array.from({ length: 30 }, (_, i) =>
  `/journey/walker-boy/${String(i + 1).padStart(2, '0')}.png`,
)

export function JourneyCutout({ item }) {
  const [imageFailed, setImageFailed] = useState(false)

  if (item.type === 'image' && !imageFailed) {
    const imageStyle = item.celestial
      ? undefined
      : {
          ...(item.width != null ? { width: item.width } : {}),
          ...(item.height != null ? { height: item.height } : {}),
          ...item.style,
        }

    const img = (
      <img
        className={`journey-cutout journey-cutout--image${item.className ? ` ${item.className}` : ''}`}
        src={item.src}
        alt=""
        aria-hidden
        decoding="async"
        draggable={false}
        onError={() => setImageFailed(true)}
        style={imageStyle}
      />
    )

    if (item.celestial) {
      return (
        <div
          data-decor-id={item.id}
          className={`journey-celestial journey-celestial--${item.celestial}${item.className ? ` ${item.className}` : ''}`}
          style={{
            left: item.style?.left,
            top: item.style?.top,
            zIndex: item.style?.zIndex,
            width: item.width,
            height: item.height,
          }}
          aria-hidden
        >
          <span className="journey-celestial__halo" aria-hidden>
            <span className="journey-celestial__halo-glow" aria-hidden />
          </span>
          {img}
        </div>
      )
    }

    return (
      <img
        data-decor-id={item.id}
        className={`journey-cutout journey-cutout--image${item.className ? ` ${item.className}` : ''}`}
        src={item.src}
        alt=""
        aria-hidden
        decoding="async"
        draggable={false}
        onError={() => setImageFailed(true)}
        style={imageStyle}
      />
    )
  }

  if (item.type === 'image' && imageFailed && item.fallback) {
    return (
      <span
        className={`journey-cutout journey-cutout--${item.fallback}`}
        style={item.style}
        aria-hidden
      />
    )
  }

  if (item.type === 'image') return null

  return (
    <span
      className={`journey-cutout journey-cutout--${item.variant}`}
      style={item.style}
      aria-hidden
    />
  )
}

export function JourneyWalker() {
  return (
    <div className="journey-walker__sprite" aria-hidden>
      <img
        className="journey-walker__frame"
        src={WALKER_BOY_FRAMES[0]}
        alt=""
        decoding="async"
      />
    </div>
  )
}
