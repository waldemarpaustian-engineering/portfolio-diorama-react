import { useEffect, useRef } from 'react'
import { registerThemeTransitionHandler, THEME_TRANSITION_MS } from '../lib/themeTransition.js'

// Coordinates timing only — background CSS animates; no overlay on the island.
export default function ThemeTransition() {
  const endTimer = useRef(0)

  useEffect(() => {
    return registerThemeTransitionHandler((nextKind, applyTheme) => {
      clearTimeout(endTimer.current)
      document.documentElement.dataset.themeTransition = nextKind
      endTimer.current = window.setTimeout(() => {
        applyTheme()
        delete document.documentElement.dataset.themeTransition
      }, THEME_TRANSITION_MS)
    })
  }, [])

  return null
}
