// Soft retro monitor hover sound: warm hum + gentle shimmer, occasional quiet blips.
// Much calmer than harsh static — meant to feel cozy, not broken.
import { isSoundEnabled, registerStopper } from './audioGate.js'

export function createMonitorGlitch() {
  let ctx = null
  let master = null
  let hum = null
  let shimmer = null
  let blipTimer = null
  let running = false

  function ensure() {
    if (ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)

    // warm low hum (sine + soft fifth), like an old screen powering up
    hum = ctx.createOscillator()
    hum.type = 'sine'
    hum.frequency.value = 92
    const humGain = ctx.createGain()
    humGain.gain.value = 0.022
    const humLp = ctx.createBiquadFilter()
    humLp.type = 'lowpass'
    humLp.frequency.value = 220
    hum.connect(humLp)
    humLp.connect(humGain)
    humGain.connect(master)
    hum.start()

    const fifth = ctx.createOscillator()
    fifth.type = 'sine'
    fifth.frequency.value = 92 * 1.5
    const fifthGain = ctx.createGain()
    fifthGain.gain.value = 0.008
    fifth.connect(humLp)
    fifth.start()

    // very quiet filtered noise that slowly breathes — texture, not crackle
    const size = 2 * ctx.sampleRate
    const buf = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
    shimmer = ctx.createBufferSource()
    shimmer.buffer = buf
    shimmer.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1800
    bp.Q.value = 4
    const sg = ctx.createGain()
    sg.gain.value = 0.012
    const swell = ctx.createOscillator()
    swell.type = 'sine'
    swell.frequency.value = 0.4
    const swellGain = ctx.createGain()
    swellGain.gain.value = 0.008
    swell.connect(swellGain)
    swellGain.connect(sg.gain)
    shimmer.connect(bp)
    bp.connect(sg)
    sg.connect(master)
    shimmer.start()
    swell.start()
  }

  // occasional soft blip — short sine ping with a gentle pitch drop
  function blip() {
    if (!ctx || !running) return
    const t = ctx.currentTime + 0.02
    const f = 520 + Math.random() * 380
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(f, t)
    o.frequency.exponentialRampToValueAtTime(f * 0.82, t + 0.12)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.045 + Math.random() * 0.025, t + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + 0.16)
  }

  function scheduleBlip() {
    const delay = 900 + Math.random() * 2200
    blipTimer = setTimeout(() => {
      if (running) blip()
      scheduleBlip()
    }, delay)
  }

  function start() {
    if (!isSoundEnabled()) return
    ensure()
    if (ctx.state === 'suspended') ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0.35, ctx.currentTime, 0.12)
    if (running) return
    running = true
    scheduleBlip()
  }

  function stop() {
    running = false
    if (blipTimer) {
      clearTimeout(blipTimer)
      blipTimer = null
    }
    if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.15)
    }
  }

  const unreg = registerStopper(stop)

  function dispose() {
    unreg()
    stop()
    if (hum) {
      hum.stop()
      hum = null
    }
    if (shimmer) {
      shimmer.stop()
      shimmer = null
    }
    if (ctx) ctx.close()
    ctx = null
  }

  return { start, stop, dispose }
}
