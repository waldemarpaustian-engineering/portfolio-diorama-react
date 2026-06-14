// The four navigation signs.
// p   = position in the model's own coordinate space (read from the GLB)
// nrm = the direction the sign faces (front of the diorama)
// hw/hh = half width / half height of the plaque (world units, before model scale)
export const SIGNS = [
  { label: 'About Me', to: '/about',   p: [-0.6935, -0.1042, -0.1743], hw: 0.36, hh: 0.09, nrm: [0.248, -0.034, 0.968] },
  { label: 'Works',    to: '/works',   p: [-0.6983, -0.1990, -0.1727], hw: 0.36, hh: 0.08, nrm: [0.173,  0.048, 0.984] },
  { label: 'Blog',     to: '/blog',    p: [-0.6946, -0.2912, -0.1738], hw: 0.36, hh: 0.08, nrm: [0.536, -0.050, 0.843] },
  { label: 'Contact',  to: '/contact', p: [-0.6961, -0.3867, -0.1736], hw: 0.34, hh: 0.08, nrm: [0.503,  0.152, 0.851] },
]

// Warm lantern glows, in the model's own coordinate space (same space as a sign's `p`).
// The GLB is a single baked mesh, so we light the lanterns from the outside instead of
// toggling an emissive material. To find positions: open the site with `?lights` in the
// URL, click each lantern (it lights up live + logs its coordinates), then paste them here.
export const LANTERNS = [
  { p: [0.7907, 0.0843, -0.1496] },
  { p: [0.6612, 0.0758, -0.1548] },
  { p: [-0.8913, -0.1882, -0.1546] },
  // lantern on the desk — dimmer + a clear breathing pulse that lights the poster
  { p: [0.162, -0.2368, -0.3553], intensity: 5.5, distance: 1.4, pulseAmount: 0.3, pulseSpeed: 1.8, pulseFloor: 0.25 },
]

// Cozy firefly swarms drifting around a lantern. `p` is in the model's own coordinate space
// (same as a lantern's `p`). Tweak `count`, `radius` (spread), `size`, `color`, `speed`.
export const SWARMS = [
  { p: [0.7907, 0.0843, -0.1496], count: 9, radius: 0.09, color: '#141008', size: 0.005, speed: 1.3, glow: false, buzz: true },
]

// The monitor overlay (crisp tech-logo slideshow). Set once we know where the screen is:
// open the site with `?lights`, click the CENTER of the monitor screen, and copy the
// logged `p` and `nrm` here. hw/hh = half width / half height of the screen plane.
// Leave as null to disable the overlay.
export const SCREEN = { p: [-0.0968, -0.1909, -0.3091], nrm: [0.114, 0.441, 0.890], hw: 0.3, hh: 0.175 }

// Framed boards/posters with crisp image + text overlays. Place each one the same way as
// the screen: open with `?lights`, click the CENTER of the board, copy the logged `p` and
// `nrm`. `src` = image (omit for text-only), `mode` = 'top' | 'cover' | 'paper',
// `lines` = the text, `symbol` = the little glyph below it.
export const BOARDS = [
  // board next to the bicycle
  { src: '/board-art.png', mode: 'top', p: [0.4358, -0.4051, 0.5849], nrm: [-0.606, 0.48, 0.635], hw: 0.21, hh: 0.3, down: 0.008, bg: '#f5f0e6', roll: 3 },
  // poster in front of the desk (text only for now — image to follow, then set src + mode:'top')
  {
    mode: 'paper',
    lines: ['Ideas', 'become', 'magic.'],
    symbol: '\u2665',
    symbolColor: '#b62f2f',
    pulse: true,
    shimmer: false,
    heartbeat: true,
    p: [0.2479, -0.0125, -0.4347],
    nrm: [0.031, 0.003, 1.0],
    hw: 0.215,
    hh: 0.34,
    down: 0.004,
    bg: '#B0844C',
    textColor: '#15110c',
  },
]

// Model is scaled so its largest dimension ≈ 6 units (maxDim of this GLB ≈ 1.893).
export const MODEL_SCALE = 6 / 1.893

// Default camera framing (looks at the front of the diorama).
export const VIEW = { theta: 0.38, phi: 1.15, radius: 11.0 }
