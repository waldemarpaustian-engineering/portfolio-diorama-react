import { runThemeTransition } from './themeTransition.js'

const KEY = 'portfolio-theme'

export function getTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(KEY)
  return stored === 'dark' ? 'dark' : 'light'
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light'
}

export function setTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light'
  localStorage.setItem(KEY, next)
  applyTheme(next)
  window.dispatchEvent(new CustomEvent('themechange', { detail: next }))
  return next
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  runThemeTransition(next, () => setTheme(next))
  return next
}

export function initTheme() {
  const theme = getTheme()
  applyTheme(theme)
  if (localStorage.getItem(KEY) == null) {
    localStorage.setItem(KEY, 'light')
  }
}

export function subscribeTheme(fn) {
  const handler = (e) => fn(e.detail)
  window.addEventListener('themechange', handler)
  return () => window.removeEventListener('themechange', handler)
}
