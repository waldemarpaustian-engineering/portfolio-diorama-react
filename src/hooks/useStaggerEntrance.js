import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

// Staggered page entrance — respects prefers-reduced-motion.
export function useStaggerEntrance(itemSelector = '.page-enter') {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const items = root.querySelectorAll(itemSelector)
    if (!items.length) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const animation = animate(items, {
      opacity: [0, 1],
      translateY: [22, 0],
      duration: 680,
      ease: 'out(3)',
      delay: stagger(72, { start: 90 }),
    })

    return () => animation.pause()
  }, [itemSelector])

  return rootRef
}
