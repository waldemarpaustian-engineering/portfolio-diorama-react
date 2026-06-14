// A gentle synthesized heartbeat ("lub-dub") for Web Audio — no audio file needed.
// start() fades a looping heartbeat in; stop() fades it out. Meant to play while hovering.
export function createHeartbeat() {
  let ctx = null
  let master = null
  let timer = null
  let running = false

  function ensure() {
    if (ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)
  }

  // One soft low thump with a quick downward pitch drop (a chest-thump feel).
  function thump(t, f, peak, dur) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(f * 1.7, t)
    o.frequency.exponentialRampToValueAtTime(f, t + 0.05)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + dur + 0.03)
  }

  // "lub" (lower, stronger) then "dub" (slightly higher, softer) shortly after.
  function beat() {
    const t = ctx.currentTime + 0.02
    thump(t, 58, 0.7, 0.2)
    thump(t + 0.17, 72, 0.42, 0.17)
  }

  function loop() {
    if (!running) return
    beat()
    timer = setTimeout(loop, 920) // ~65 bpm, calm resting heartbeat
  }

  function start() {
    ensure()
    if (ctx.state === 'suspended') ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0.4, ctx.currentTime, 0.06)
    if (running) return
    running = true
    loop()
  }

  function stop() {
    running = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.1)
    }
  }

  function dispose() {
    stop()
    if (ctx) ctx.close()
    ctx = null
  }

  return { start, stop, dispose }
}
