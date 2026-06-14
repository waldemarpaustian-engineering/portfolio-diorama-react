// Gentle three-note melody for board hover — rising motif (dream → plan → do feel).
export function createBoardMelody() {
  let ctx = null
  let master = null
  let timer = null
  let running = false

  // soft ascending triad (C5 → E5 → G5), quiet sines
  const NOTES = [523.25, 659.25, 783.99]
  const NOTE_GAP = 0.52
  const LOOP_PAUSE = 1.4

  function ensure() {
    if (ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)
  }

  function playNote(t, freq, peak) {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(freq, t)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + 0.04)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + 0.6)
  }

  function playPhrase() {
    if (!ctx || !running) return
    const t0 = ctx.currentTime + 0.03
    NOTES.forEach((f, i) => playNote(t0 + i * NOTE_GAP, f, 0.07 - i * 0.008))
    timer = setTimeout(playPhrase, (NOTES.length * NOTE_GAP + LOOP_PAUSE) * 1000)
  }

  function start() {
    ensure()
    if (ctx.state === 'suspended') ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.15)
    if (running) return
    running = true
    playPhrase()
  }

  function stop() {
    running = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2)
    }
  }

  function dispose() {
    stop()
    if (ctx) ctx.close()
    ctx = null
  }

  return { start, stop, dispose }
}
