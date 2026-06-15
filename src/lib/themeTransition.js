const DURATION_MS = 1500

let handler = null
let busy = false

export function registerThemeTransitionHandler(fn) {
  handler = fn
  return () => { handler = null }
}

export function prefersReducedThemeMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function runThemeTransition(toTheme, applyTheme) {
  if (busy || !handler || prefersReducedThemeMotion()) {
    applyTheme()
    return
  }

  busy = true
  const kind = toTheme === 'light' ? 'dawn' : 'dusk'
  handler(kind, applyTheme)
  setTimeout(() => { busy = false }, DURATION_MS + 100)
}

export const THEME_TRANSITION_MS = DURATION_MS
