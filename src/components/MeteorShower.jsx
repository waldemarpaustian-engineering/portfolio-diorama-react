import { useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme.js'

function seedRand(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function spawnMeteor(w, h, rnd) {
  const angle = -0.58 - rnd() * 0.52
  const speed = 120 + rnd() * 80
  const length = 52 + rnd() * 58
  return {
    x: rnd() * w * 1.12 - w * 0.06,
    y: rnd() * h * 0.38 + h * 0.04,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    length,
    life: 0,
    maxLife: 0.95 + rnd() * 0.55,
    brightness: 0.58 + rnd() * 0.32,
  }
}

function drawMeteor(ctx, m, dt) {
  m.life += dt / 1000
  if (m.life > m.maxLife) return false

  m.x += m.vx * (dt / 1000)
  m.y += m.vy * (dt / 1000)

  const progress = m.life / m.maxLife
  const fade = progress < 0.1 ? progress / 0.1 : 1 - (progress - 0.1) / 0.9
  const alpha = fade * m.brightness

  const len = Math.hypot(m.vx, m.vy) || 1
  const ux = -m.vx / len
  const uy = -m.vy / len
  const headX = m.x
  const headY = m.y
  const tailX = m.x + ux * m.length
  const tailY = m.y + uy * m.length

  ctx.save()

  ctx.globalAlpha = alpha * 0.28
  ctx.strokeStyle = 'rgba(210,220,255,0.9)'
  ctx.lineWidth = 2.4
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(tailX, tailY)
  ctx.lineTo(headX, headY)
  ctx.stroke()

  const grad = ctx.createLinearGradient(tailX, tailY, headX, headY)
  grad.addColorStop(0, 'rgba(255,255,255,0)')
  grad.addColorStop(0.5, `rgba(225,232,255,${0.42 * alpha})`)
  grad.addColorStop(1, `rgba(255,255,255,${0.95 * alpha})`)
  ctx.globalAlpha = 1
  ctx.strokeStyle = grad
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(tailX, tailY)
  ctx.lineTo(headX, headY)
  ctx.stroke()

  ctx.globalAlpha = alpha * 0.5
  const glow = ctx.createRadialGradient(headX, headY, 0, headX, headY, 4)
  glow.addColorStop(0, 'rgba(255,255,255,0.9)')
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(headX, headY, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalAlpha = alpha
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(headX, headY, 1.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
  return true
}

// Shooting stars above the 3D canvas (dark mode only).
export default function MeteorShower() {
  const theme = useTheme()
  const canvasRef = useRef(null)
  const meteorsRef = useRef([])
  const rafRef = useRef(0)

  useEffect(() => {
    if (theme !== 'dark') return undefined

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rnd = seedRand(77)
    let w = 0
    let h = 0
    let lastT = 0
    let nextMeteorAt = 0

    function scheduleNext(from) {
      nextMeteorAt = from + 6500 + rnd() * 7500
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      meteorsRef.current = []
      nextMeteorAt = performance.now() + 2800 + rnd() * 3200
    }

    function draw(t) {
      const dt = lastT ? Math.min(48, t - lastT) : 16
      lastT = t

      ctx.clearRect(0, 0, w, h)

      if (t >= nextMeteorAt && meteorsRef.current.length === 0) {
        meteorsRef.current.push(spawnMeteor(w, h, rnd))
        scheduleNext(t)
      }

      meteorsRef.current = meteorsRef.current.filter((m) => drawMeteor(ctx, m, dt))

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

  return <canvas ref={canvasRef} className="meteor-shower" aria-hidden />
}
