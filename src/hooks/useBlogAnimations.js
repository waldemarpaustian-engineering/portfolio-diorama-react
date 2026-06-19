import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Reveals children with a staggered GSAP rise as they scroll into view.
// `selector` is matched inside the returned ref container.
export function useScrollReveal(selector = '[data-reveal]', deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const items = Array.from(root.querySelectorAll(selector))
    if (!items.length) return

    if (prefersReducedMotion()) {
      items.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    gsap.set(items, { opacity: 0, y: 28 })

    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((entry, i) => {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              delay: i * 0.06,
            })
            io.unobserve(entry.target)
          })
      },
      // threshold 0 (not a ratio) so elements taller than the viewport — e.g. a
      // long article's whole prose block — still trigger; rootMargin handles timing.
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )

    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

// Tracks how far the page is scrolled (0–1) for a reading-progress bar.
export function useReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return progress
}
