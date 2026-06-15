// Short warm wood "tock" for navigation sign hover — one-shot, quiet.
import { isSoundEnabled } from './audioGate.js'

let ctx = null

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function playSignHover(pitch = 1) {
  if (!isSoundEnabled()) return
  const ac = getCtx()
  if (!ac) return
  const t = ac.currentTime + 0.01
  const master = ac.createGain()
  master.gain.value = 0.14
  master.connect(ac.destination)

  // low wooden body
  const body = ac.createOscillator()
  body.type = 'sine'
  body.frequency.setValueAtTime(118 * pitch, t)
  body.frequency.exponentialRampToValueAtTime(72 * pitch, t + 0.09)
  const bg = ac.createGain()
  bg.gain.setValueAtTime(0.0001, t)
  bg.gain.exponentialRampToValueAtTime(0.55, t + 0.006)
  bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.11)
  body.connect(bg)
  bg.connect(master)
  body.start(t)
  body.stop(t + 0.13)

  // short tap transient
  const size = Math.floor(ac.sampleRate * 0.025)
  const buf = ac.createBuffer(1, size, ac.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1
  const noise = ac.createBufferSource()
  noise.buffer = buf
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 920 * pitch
  bp.Q.value = 1.2
  const ng = ac.createGain()
  ng.gain.setValueAtTime(0.0001, t)
  ng.gain.exponentialRampToValueAtTime(0.35, t + 0.003)
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.035)
  noise.connect(bp)
  bp.connect(ng)
  ng.connect(master)
  noise.start(t)
  noise.stop(t + 0.04)
}

// Slightly different pitch per route so signs feel distinct but cohesive.
const PITCH = { '/about': 0.96, '/works': 1.04, '/blog': 1.0, '/contact': 1.08 }

export function playSignHoverFor(to) {
  playSignHover(PITCH[to] ?? 1)
}
