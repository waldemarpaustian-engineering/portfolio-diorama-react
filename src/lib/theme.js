import { runThemeTransition } from './themeTransition.js'

const KEY = 'portfolio-theme'

export function getTheme() {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
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
  applyTheme(getTheme())
}

export function subscribeTheme(fn) {
  const handler = (e) => fn(e.detail)
  window.addEventListener('themechange', handler)
  return () => window.removeEventListener('themechange', handler)
}
