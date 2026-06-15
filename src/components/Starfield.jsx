import { useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme.js'

function seedRand(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Soft starry sky for dark mode — fixed behind all pages.
export default function Starfield() {
  const theme = useTheme()
  const canvasRef = useRef(null)
  const starsRef = useRef([])
  const rafRef = useRef(0)

  useEffect(() => {
    if (theme !== 'dark') return undefined

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rnd = seedRand(42)
    let w = 0
    let h = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.floor((w * h) / 5200)
      starsRef.current = Array.from({ length: count }, () => ({
        x: rnd() * w,
        y: rnd() * h,
        r: rnd() * 1.1 + 0.25,
        a: rnd() * 0.45 + 0.35,
        phase: rnd() * Math.PI * 2,
        speed: rnd() * 0.7 + 0.25,
      }))
    }

    function draw(t) {
      ctx.fillStyle = '#030308'
      ctx.fillRect(0, 0, w, h)

      for (const s of starsRef.current) {
        const twinkle = 0.55 + 0.45 * Math.sin(t * 0.0012 * s.speed + s.phase)
        ctx.globalAlpha = s.a * twinkle
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    rafRef.current = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  if (theme !== 'dark') return null

  return <canvas ref={canvasRef} className="starfield" aria-hidden />
}
