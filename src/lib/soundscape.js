// A tiny procedural nature soundscape (Web Audio, no audio files):
//  - occasional little bird chirp bursts, picked from several different "voices"
//  - a sporadic, gently pulsing cricket/insect bed (short bursts with pauses)
// Everything runs through one master gain so it can be faded in/out by the toggle.
// Browsers only allow audio after a user gesture, so call setEnabled(true) from a click.
export function createSoundscape() {
  let ctx = null
  let master = null
  let chirpTimer = null
  let cricketTimer = null
  let cricketEnv = null
  let enabled = false

  // An oscillator with a quick attack + exponential decay envelope. Returns it so the
  // caller can shape its frequency curve. The bird "voices" below build calls from these.
  function osc(t, dur, peak, type = 'sine') {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(peak, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + dur + 0.02)
    return o
  }

  // Voice 1: a few whistled notes, each with a small up-then-down sweep (the original).
  function voiceWhistle(now) {
    const notes = 2 + Math.floor(Math.random() * 3)
    const base = 1900 + Math.random() * 1500
    let t = now
    for (let i = 0; i < notes; i++) {
      const dur = 0.10 + Math.random() * 0.05
      const o = osc(t, dur, 0.18, 'sine')
      const f0 = base * (0.9 + Math.random() * 0.35)
      const f1 = f0 * (1.15 + Math.random() * 0.45)
      o.frequency.setValueAtTime(f0, t)
      o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.5)
      o.frequency.exponentialRampToValueAtTime(f0 * 0.85, t + dur)
      t += 0.09 + Math.random() * 0.07
    }
  }

  // Voice 2: a fast trill — many short notes at a near-constant high pitch.
  function voiceTrill(now) {
    const n = 7 + Math.floor(Math.random() * 7)
    const f = 2500 + Math.random() * 1300
    let t = now
    for (let i = 0; i < n; i++) {
      const o = osc(t, 0.05, 0.13, 'triangle')
      o.frequency.setValueAtTime(f * (0.97 + Math.random() * 0.06), t)
      o.frequency.linearRampToValueAtTime(f * 1.04, t + 0.04)
      t += 0.05 + Math.random() * 0.015
    }
  }

  // Voice 3: a two-note call (high then lower), like a "fee-bee".
  function voiceTwoNote(now) {
    const f = 2700 + Math.random() * 900
    const o1 = osc(now, 0.2, 0.18, 'sine')
    o1.frequency.setValueAtTime(f, now)
    o1.frequency.exponentialRampToValueAtTime(f * 0.96, now + 0.2)
    const t2 = now + 0.24 + Math.random() * 0.06
    const f2 = f * (0.68 + Math.random() * 0.08)
    const o2 = osc(t2, 0.24, 0.17, 'sine')
    o2.frequency.setValueAtTime(f2, t2)
    o2.frequency.exponentialRampToValueAtTime(f2 * 0.96, t2 + 0.22)
  }

  // Voice 4: a single long whistle gliding downward.
  function voiceDescend(now) {
    const f = 3200 + Math.random() * 900
    const o = osc(now, 0.45, 0.17, 'sine')
    o.frequency.setValueAtTime(f, now)
    o.frequency.exponentialRampToValueAtTime(f * 0.5, now + 0.42)
  }

  const VOICES = [voiceWhistle, voiceTrill, voiceTwoNote, voiceDescend]

  // Play a randomly chosen bird voice.
  function chirp() {
    if (!ctx) return
    const now = ctx.currentTime + 0.02
    VOICES[Math.floor(Math.random() * VOICES.length)](now)
  }

  function scheduleChirp() {
    const delay = 3500 + Math.random() * 7000
    chirpTimer = setTimeout(() => {
      if (enabled) chirp()
      scheduleChirp()
    }, delay)
  }

  // Cricket bed: band-passed noise pulsed by a fast LFO (the "chirp" rhythm), then gated by
  // a sporadic envelope so crickets sing in short bursts with pauses, not permanently.
  function startCrickets() {
    const size = 2 * ctx.sampleRate
    const buf = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    noise.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 4600
    bp.Q.value = 14
    // pulse gain oscillates 0..1 at the chirp rate (base 0.5 + square LFO ±0.5)
    const pulse = ctx.createGain()
    pulse.gain.value = 0.5
    const lfo = ctx.createOscillator()
    lfo.type = 'square'
    lfo.frequency.value = 11
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.5
    lfo.connect(lfoGain)
    lfoGain.connect(pulse.gain)
    // sporadic on/off envelope for whole cricket bursts
    cricketEnv = ctx.createGain()
    cricketEnv.gain.value = 0
    noise.connect(bp)
    bp.connect(pulse)
    pulse.connect(cricketEnv)
    cricketEnv.connect(master)
    noise.start()
    lfo.start()
    scheduleCricket()
  }

  // Fade a cricket "song" in for a few seconds, then out, then wait a random pause.
  function scheduleCricket() {
    const wait = 2500 + Math.random() * 7000
    cricketTimer = setTimeout(() => {
      if (enabled && ctx && cricketEnv) {
        const t = ctx.currentTime
        const dur = 1.5 + Math.random() * 3.5
        const peak = 0.04 + Math.random() * 0.05
        cricketEnv.gain.cancelScheduledValues(t)
        cricketEnv.gain.setValueAtTime(cricketEnv.gain.value, t)
        cricketEnv.gain.linearRampToValueAtTime(peak, t + 0.5)
        cricketEnv.gain.setValueAtTime(peak, t + dur)
        cricketEnv.gain.linearRampToValueAtTime(0, t + dur + 0.7)
      }
      scheduleCricket()
    }, wait)
  }

  function init() {
    if (ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    startCrickets()
    scheduleChirp()
  }

  function setEnabled(on) {
    enabled = on
    if (on) {
      init()
      if (ctx.state === 'suspended') ctx.resume()
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.6)
    } else if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
    }
  }

  function dispose() {
    enabled = false
    if (chirpTimer) clearTimeout(chirpTimer)
    if (cricketTimer) clearTimeout(cricketTimer)
    if (ctx) ctx.close()
    ctx = null
  }

  return { setEnabled, dispose }
}
