// Continuous generative arpeggio — soft, futuristic, with varied transitions (no fixed loop).
export function createBoardMelody() {
  let ctx = null
  let master = null
  let lp = null
  let schedulerTimer = null
  let nodes = []
  let running = false
  let noteIndex = 0
  let nextNoteTime = 0

  // calm minor-pentatonic pool — pleasant, slightly sci-fi when arpeggiated freely
  const POOL = [293.66, 329.63, 349.23, 392, 440, 493.88, 523.25]

  function ensure() {
    if (ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.0001
    lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 1550
    lp.Q.value = 0.45
    lp.connect(master)
    master.connect(ctx.destination)
  }

  function track(node) {
    nodes.push(node)
    return node
  }

  function clamp(i) {
    return Math.max(0, Math.min(POOL.length - 1, i))
  }

  // favour small steps, sometimes leap or pause — feels organic, not repetitive
  function pickNext() {
    const r = Math.random()
    if (r < 0.42) noteIndex = clamp(noteIndex + (Math.random() < 0.5 ? -1 : 1))
    else if (r < 0.68) noteIndex = clamp(noteIndex + (Math.random() < 0.5 ? -2 : 2))
    else if (r < 0.84) noteIndex = Math.floor(Math.random() * POOL.length)
    else if (r < 0.92) noteIndex = noteIndex
    else noteIndex = clamp(noteIndex + (Math.random() < 0.5 ? -3 : 3))
    return POOL[noteIndex]
  }

  function pickStep() {
    const r = Math.random()
    if (r < 0.12) return 0.72 + Math.random() * 0.22
    if (r < 0.22) return 0.28 + Math.random() * 0.12
    return 0.44 + Math.random() * 0.28
  }

  function startBed() {
    ;[146.83, 147.4, 220].forEach((f, i) => {
      const o = track(ctx.createOscillator())
      o.type = 'sine'
      o.frequency.value = f
      const g = ctx.createGain()
      g.gain.value = i < 2 ? 0.007 : 0.004
      o.connect(g)
      g.connect(lp)
      o.start()
    })

    const lfo = track(ctx.createOscillator())
    lfo.type = 'sine'
    lfo.frequency.value = 0.045
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 220
    lfo.connect(lfoGain)
    lfoGain.connect(lp.frequency)
    lfo.start()
  }

  function playBlip(t, freq) {
    const attack = 0.2 + Math.random() * 0.16
    const release = 0.62 + Math.random() * 0.42
    const peak = 0.014 + Math.random() * 0.011
    const glide = Math.random() < 0.35

    const o1 = ctx.createOscillator()
    o1.type = 'sine'
    o1.frequency.setValueAtTime(glide ? freq * 0.992 : freq, t)
    if (glide) o1.frequency.exponentialRampToValueAtTime(freq, t + attack * 0.7)

    const o2 = ctx.createOscillator()
    o2.type = 'sine'
    o2.frequency.setValueAtTime(freq * (1.002 + Math.random() * 0.002), t)

    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(peak, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release)

    o1.connect(g)
    o2.connect(g)
    g.connect(lp)
    o1.start(t)
    o2.start(t)
    o1.stop(t + attack + release + 0.1)
    o2.stop(t + attack + release + 0.1)
  }

  function scheduler() {
    if (!running || !ctx) return
    while (nextNoteTime < ctx.currentTime + 0.16) {
      playBlip(nextNoteTime, pickNext())
      nextNoteTime += pickStep()
    }
    schedulerTimer = setTimeout(scheduler, 32)
  }

  function start() {
    ensure()
    if (ctx.state === 'suspended') ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0.38, ctx.currentTime, 0.45)
    if (running) return
    running = true
    if (nodes.length === 0) startBed()
    noteIndex = Math.floor(Math.random() * POOL.length)
    nextNoteTime = ctx.currentTime + 0.08
    scheduler()
  }

  function stop() {
    running = false
    if (schedulerTimer) {
      clearTimeout(schedulerTimer)
      schedulerTimer = null
    }
    nodes.forEach((n) => {
      try { n.stop() } catch { /* already stopped */ }
    })
    nodes = []
    if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.45)
    }
  }

  function dispose() {
    stop()
    if (ctx) ctx.close()
    ctx = null
    lp = null
  }

  return { start, stop, dispose }
}
