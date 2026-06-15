import { useEffect, useState } from 'react'
import { getTheme, subscribeTheme } from '../lib/theme.js'

export function useTheme() {
  const [theme, setTheme] = useState(getTheme)
  useEffect(() => subscribeTheme(setTheme), [])
  return theme
}
