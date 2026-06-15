// Delicate quiet chime while hovering insects — soft high partials, no buzz.
import { isSoundEnabled, registerStopper } from './audioGate.js'

export function createInsectBuzz() {
  let ctx = null
  let master = null
  let nodes = []
  let running = false

  function ensure() {
    if (ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 2800
    lp.connect(master)

    // bell-like partials (very quiet, slowly breathing)
    const base = 740
    ;[
      { f: base, g: 0.014 },
      { f: base * 1.498, g: 0.009 },
      { f: base * 2.01, g: 0.005 },
    ].forEach(({ f, g }, i) => {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      const og = ctx.createGain()
      og.gain.value = g
      const swell = ctx.createOscillator()
      swell.type = 'sine'
      swell.frequency.value = 0.25 + i * 0.11
      const swellGain = ctx.createGain()
      swellGain.gain.value = g * 0.55
      swell.connect(swellGain)
      swellGain.connect(og.gain)
      o.connect(og)
      og.connect(lp)
      o.start()
      swell.start()
      nodes.push(o, swell)
    })
  }

  function start() {
    if (!isSoundEnabled()) return
    ensure()
    if (ctx.state === 'suspended') ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0.045, ctx.currentTime, 0.2)
    running = true
  }

  function stop() {
    running = false
    if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.25)
    }
  }

  const unreg = registerStopper(stop)

  function dispose() {
    unreg()
    stop()
    nodes.forEach((n) => {
      try { n.stop() } catch { /* already stopped */ }
    })
    nodes = []
    if (ctx) ctx.close()
    ctx = null
  }

  return { start, stop, dispose }
}
