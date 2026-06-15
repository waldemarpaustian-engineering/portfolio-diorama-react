// Quiet monitor hover sound: soft high hiss, occasional gentle "sch sch" — no bass.
import { isSoundEnabled, registerStopper } from './audioGate.js'

export function createMonitorGlitch() {
  let ctx = null
  let master = null
  let hiss = null
  let hissGain = null
  let schTimer = null
  let running = false

  function ensure() {
    if (ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)

    const size = 2 * ctx.sampleRate
    const buf = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1

    hiss = ctx.createBufferSource()
    hiss.buffer = buf
    hiss.loop = true

    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 3200

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 8500

    hissGain = ctx.createGain()
    hissGain.gain.value = 0.006

    hiss.connect(hp)
    hp.connect(lp)
    lp.connect(hissGain)
    hissGain.connect(master)
    hiss.start()
  }

  function schBurst() {
    if (!ctx || !running || !hissGain) return
    const t = ctx.currentTime
    const peak = 0.014 + Math.random() * 0.01
    hissGain.gain.cancelScheduledValues(t)
    hissGain.gain.setValueAtTime(hissGain.gain.value, t)
    hissGain.gain.linearRampToValueAtTime(peak, t + 0.015)
    hissGain.gain.linearRampToValueAtTime(0.005, t + 0.05 + Math.random() * 0.03)
  }

  function scheduleSch() {
    const delay = 220 + Math.random() * 420
    schTimer = setTimeout(() => {
      if (running) {
        schBurst()
        if (Math.random() > 0.35) {
          setTimeout(() => { if (running) schBurst() }, 70 + Math.random() * 50)
        }
      }
      scheduleSch()
    }, delay)
  }

  function start() {
    if (!isSoundEnabled()) return
    ensure()
    if (ctx.state === 'suspended') ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.1)
    if (running) return
    running = true
    scheduleSch()
  }

  function stop() {
    running = false
    if (schTimer) {
      clearTimeout(schTimer)
      schTimer = null
    }
    if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.12)
      if (hissGain) hissGain.gain.setTargetAtTime(0.006, ctx.currentTime, 0.08)
    }
  }

  const unreg = registerStopper(stop)

  function dispose() {
    unreg()
    stop()
    if (hiss) {
      hiss.stop()
      hiss = null
    }
    if (ctx) ctx.close()
    ctx = null
    hissGain = null
  }

  return { start, stop, dispose }
}
