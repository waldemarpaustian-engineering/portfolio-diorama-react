// Global sound on/off — nature soundscape + all hover/interaction sounds share this gate.
let enabled = false
const stoppers = new Set()

export function isSoundEnabled() {
  return enabled
}

export function setSoundEnabled(on) {
  enabled = on
  if (!on) stoppers.forEach((stop) => stop())
}

/** Register a callback that runs when sound is turned off (e.g. fade out a hover loop). */
export function registerStopper(stop) {
  stoppers.add(stop)
  return () => stoppers.delete(stop)
}
