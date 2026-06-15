// Hand-cut paper style SVG scenes — placeholders until custom illustrations land in /public/journey/.

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
        <PaperShadow className="journey-art--studium">
          <svg viewBox="0 0 200 160" aria-hidden>
            <rect x="52" y="28" width="96" height="72" rx="6" fill="#f8f4ec" stroke="#2b2a33" strokeWidth="2.2" />
            <rect x="60" y="38" width="80" height="48" fill="#c8e4f8" stroke="#2b2a33" strokeWidth="1.5" />
            <text x="100" y="68" textAnchor="middle" fontSize="11" fill="#4a7fd4" fontFamily="monospace">&lt;/&gt;</text>
            <path d="M88 108h24v8H88z" fill="#d4c4a8" stroke="#2b2a33" strokeWidth="1.5" />
            <rect x="40" y="118" width="120" height="8" rx="2" fill="#e8dcc8" stroke="#2b2a33" strokeWidth="1.5" />
          </svg>
        </PaperShadow>
      )
    case 'banking':
      return (
        <PaperShadow className="journey-art--banking">
          <svg viewBox="0 0 200 160" aria-hidden>
            <path d="M40 118h120v18H40z" fill="#e8dcc8" stroke="#2b2a33" strokeWidth="2" />
            <path d="M55 118V72h18v46M95 118V58h18v60M145 118V80h18v38" fill="#f0ebe3" stroke="#2b2a33" strokeWidth="2" />
            <path d="M35 72h130l-12-28H47z" fill="#f8f4ec" stroke="#2b2a33" strokeWidth="2" />
            <circle cx="100" cy="48" r="10" fill="#ffe8c8" stroke="#2b2a33" strokeWidth="1.8" />
          </svg>
        </PaperShadow>
      )
    case 'frameworks':
      return (
        <PaperShadow className="journey-art--frameworks">
          <svg viewBox="0 0 200 160" aria-hidden>
            <rect x="38" y="90" width="44" height="44" rx="4" fill="#b8ddf5" stroke="#2b2a33" strokeWidth="2" transform="rotate(-6 60 112)" />
            <rect x="78" y="78" width="44" height="44" rx="4" fill="#ffe8c8" stroke="#2b2a33" strokeWidth="2" />
            <rect x="118" y="92" width="44" height="44" rx="4" fill="#c8f0c8" stroke="#2b2a33" strokeWidth="2" transform="rotate(8 140 114)" />
            <path d="M72 100h16M108 88h16" stroke="#4a7fd4" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#arrow)" />
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4a7fd4" />
              </marker>
            </defs>
          </svg>
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

export function JourneyWalker() {
  return (
    <div className="journey-walker__sprite" aria-hidden>
      <img className="journey-walker__frame journey-walker__frame--a" src="/journey/walker-1.png" alt="" decoding="async" />
      <img className="journey-walker__frame journey-walker__frame--b" src="/journey/walker-2.png" alt="" decoding="async" />
    </div>
  )
}
