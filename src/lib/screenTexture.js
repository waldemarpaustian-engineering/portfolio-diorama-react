// Draws a single technology "slide" (brand-colored screen + logo + name) onto a 2D
// canvas context. Used by the monitor overlay to show a crisp, glowing tech slideshow.

function channels(hex) {
  const n = parseInt(hex, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function darken([r, g, b], f) {
  return `rgb(${Math.round(r * f)}, ${Math.round(g * f)}, ${Math.round(b * f)})`
}

// Perceived luminance (0..1) to pick a readable foreground color.
function luminance([r, g, b]) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

export function drawTech(ctx, W, H, icon, alpha = 1) {
  const rgb = channels(icon.hex)
  const fg = luminance(rgb) > 0.62 ? '#11151b' : '#ffffff'

  ctx.save()
  ctx.globalAlpha = alpha

  // brand-colored screen background
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, `#${icon.hex}`)
  g.addColorStop(1, darken(rgb, 0.72))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // logo (24x24 viewBox path), centered in the upper area
  const target = Math.min(W, H) * 0.62
  const s = target / 24
  ctx.save()
  ctx.translate((W - target) / 2, H * 0.4 - target / 2)
  ctx.scale(s, s)
  ctx.fillStyle = fg
  ctx.fill(new Path2D(icon.path))
  ctx.restore()

  // technology name below the logo
  ctx.fillStyle = fg
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${Math.round(H * 0.12)}px -apple-system, Segoe UI, Helvetica, Arial, sans-serif`
  ctx.fillText(icon.title, W / 2, H * 0.84)

  ctx.restore()
}

// Pseudo-random 0..1, stable for one animation frame (changes every ~16 ms).
function frameRand(t, n) {
  const f = Math.floor(t * 60)
  return Math.abs(Math.sin(f * 12.9898 + n * 78.233) * 43758.5453) % 1
}

// Broken CRT overlay on hover: scanlines, rolling bars, static, glitch slices, blackout flashes.
// `amount` (0..1) fades it in; `scan` is elapsed seconds.
export function drawCRT(ctx, W, H, amount, scan) {
  if (amount < 0.02) return
  ctx.save()

  const r0 = frameRand(scan, 0)
  const r1 = frameRand(scan, 1)
  const r2 = frameRand(scan, 2)
  const r3 = frameRand(scan, 3)

  // thin dark scanlines, scrolling slightly
  ctx.globalAlpha = 0.22 * amount
  ctx.fillStyle = '#000'
  const gap = 3
  const off = (scan * 80) % gap
  for (let y = -off; y < H; y += gap) ctx.fillRect(0, y, W, 1)

  // rolling horizontal interference bar
  const rollH = H * (0.04 + r1 * 0.06)
  const rollY = ((scan * (0.35 + r2 * 0.4)) % 1) * (H + rollH) - rollH
  ctx.globalAlpha = 0.35 * amount
  ctx.fillStyle = r0 > 0.5 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)'
  ctx.fillRect(0, rollY, W, rollH)

  // sparse static speckles
  ctx.globalAlpha = 0.18 * amount
  ctx.fillStyle = '#fff'
  const specks = 120 + Math.floor(r2 * 80)
  for (let i = 0; i < specks; i++) {
    const x = frameRand(scan, i + 10) * W
    const y = frameRand(scan, i + 110) * H
    const s = 1 + frameRand(scan, i + 210) * 2
    ctx.fillRect(x, y, s, s)
  }

  // horizontal glitch slices — shifted bright/dark bands
  const slices = 2 + Math.floor(r3 * 4)
  for (let i = 0; i < slices; i++) {
    const sy = frameRand(scan, i + 30) * H
    const sh = 4 + frameRand(scan, i + 40) * 28
    const dx = (frameRand(scan, i + 50) - 0.5) * W * 0.08
    ctx.globalAlpha = (0.25 + frameRand(scan, i + 60) * 0.35) * amount
    ctx.fillStyle = frameRand(scan, i + 70) > 0.55 ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.9)'
    ctx.fillRect(dx, sy, W, sh)
  }

  // RGB split ghost bands (chromatic tear)
  if (r1 > 0.55) {
    const gy = frameRand(scan, 90) * H * 0.7
    const gh = 10 + r2 * 40
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = 0.14 * amount
    ctx.fillStyle = 'rgba(255,60,60,0.9)'
    ctx.fillRect(-W * 0.012, gy, W, gh)
    ctx.fillStyle = 'rgba(60,180,255,0.9)'
    ctx.fillRect(W * 0.012, gy + 3, W, gh)
  }

  // sudden blackout / whiteout flash
  if (r0 > 0.82 || r2 > 0.88) {
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = (r0 > 0.82 ? 0.55 : 0.35) * amount
    ctx.fillStyle = r0 > 0.9 ? '#fff' : '#000'
    ctx.fillRect(0, 0, W, H)
  }

  // soft bright band sweeping downward
  const bandH = H * 0.22
  const by = ((scan * 0.55 + r3 * 0.2) % 1) * (H + bandH) - bandH
  const grad = ctx.createLinearGradient(0, by, 0, by + bandH)
  grad.addColorStop(0, 'rgba(255,255,255,0)')
  grad.addColorStop(0.5, 'rgba(255,255,255,1)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.globalCompositeOperation = 'lighter'
  ctx.globalAlpha = 0.1 * amount
  ctx.fillStyle = grad
  ctx.fillRect(0, by, W, bandH)

  ctx.restore()
}
