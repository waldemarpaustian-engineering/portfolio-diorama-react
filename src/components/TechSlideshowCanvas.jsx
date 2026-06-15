import { useEffect, useRef } from 'react'
import { TECH } from '../data/tech.js'
import { paintTechSlideshow, TECH_FADE, TECH_PERIOD } from '../lib/techSlideshow.js'

// Same tech-logo slideshow as the diorama monitor — for 2D overlays.
export default function TechSlideshowCanvas({ tech = TECH, className, variant = 'full' }) {
  const canvasRef = useRef(null)
  const anim = useRef({ t: 0, idx: 0, lastIdx: -1 })
  const sizeRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !tech.length) return undefined

    let raf = 0
    let last = 0
    let dpr = 1
    let logicalW = 0
    let logicalH = 0

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return
      logicalW = parent.clientWidth
      logicalH = parent.clientHeight
      if (!logicalW || !logicalH) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(logicalW * dpr))
      canvas.height = Math.max(1, Math.floor(logicalH * dpr))
      canvas.style.width = `${logicalW}px`
      canvas.style.height = `${logicalH}px`
      anim.current.lastIdx = -1
    }

    function frame(now) {
      const delta = last ? Math.min(0.048, (now - last) / 1000) : 0.016
      last = now
      if (!logicalW || !logicalH) {
        resize()
        raf = requestAnimationFrame(frame)
        return
      }
      const a = anim.current
      a.t += delta
      if (a.t >= TECH_PERIOD) {
        a.t -= TECH_PERIOD
        a.idx = (a.idx + 1) % tech.length
      }
      const fading = a.t > TECH_PERIOD - TECH_FADE
      const sizeChanged = sizeRef.current.w !== logicalW || sizeRef.current.h !== logicalH
      if (fading || a.lastIdx !== a.idx || sizeChanged) {
        const ctx = canvas.getContext('2d')
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        paintTechSlideshow(ctx, logicalW, logicalH, tech, a, variant)
        a.lastIdx = a.idx
        sizeRef.current = { w: logicalW, h: logicalH }
      }
      raf = requestAnimationFrame(frame)
    }

    resize()
    raf = requestAnimationFrame(frame)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [tech, variant])

  return <canvas ref={canvasRef} className={className} aria-hidden />
}
