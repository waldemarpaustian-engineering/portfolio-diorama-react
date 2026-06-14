import * as THREE from 'three'

function roundRect(x, a, b, w, h, r) {
  x.beginPath()
  x.moveTo(a + r, b)
  x.arcTo(a + w, b, a + w, b + h, r)
  x.arcTo(a + w, b + h, a, b + h, r)
  x.arcTo(a, b + h, a, b, r)
  x.arcTo(a, b, a + w, b, r)
  x.closePath()
}

// Short, bold chevron (>) for hover — compact and thick, not a long text arrow.
function drawFatChevron(ctx, x, cy, size, color) {
  const len = size * 0.36
  const half = size * 0.36
  const thick = Math.max(3.5, size * 0.24)
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = thick
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(x, cy - half)
  ctx.lineTo(x + len, cy)
  ctx.lineTo(x, cy + half)
  ctx.stroke()
  ctx.restore()
  return len + thick * 0.35
}

// Draws the nameplate onto a 2D canvas. With `hover`, a small arrow appears beside the label.
export function drawSignTexture(ctx, W, H, label, hover = false) {
  ctx.clearRect(0, 0, W, H)

  const r = Math.min(30, H * 0.2)
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#C8A06E')
  g.addColorStop(1, '#AE8650')
  ctx.fillStyle = g
  roundRect(ctx, 0, 0, W, H, r)
  ctx.fill()

  const inset = Math.max(3, H * 0.05)
  ctx.lineWidth = inset
  ctx.strokeStyle = 'rgba(80,55,30,.45)'
  roundRect(ctx, inset, inset, W - 2 * inset, H - 2 * inset, Math.min(24, H * 0.16))
  ctx.stroke()

  ctx.fillStyle = '#15110c'
  ctx.textBaseline = 'middle'
  let fs = H * 0.52
  const font = (n, weight = 800) => `${weight} ${n}px -apple-system, Segoe UI, Helvetica, Arial, sans-serif`
  ctx.font = font(fs)
  while (ctx.measureText(label).width > W * 0.78 && fs > 12) {
    fs -= 2
    ctx.font = font(fs)
  }
  const ty = H / 2 + fs * 0.06

  if (!hover) {
    ctx.textAlign = 'center'
    ctx.fillText(label, W / 2, ty)
  } else {
    const gap = fs * 0.34
    const arrowSize = fs * 0.95
    const aw = arrowSize * 0.44
    ctx.font = font(fs)
    const tw = ctx.measureText(label).width
    const total = aw + gap + tw
    let x = (W - total) / 2 - W * 0.035
    drawFatChevron(ctx, x, ty, arrowSize, '#7a4f22')
    x += aw + gap
    ctx.textAlign = 'left'
    ctx.fillStyle = '#15110c'
    ctx.font = font(fs)
    ctx.fillText(label, x, ty)
  }
}

export function makeSignTexture(label, hw, hh) {
  const W = 512
  const H = Math.max(80, Math.round(W * (hh / hw)))
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  drawSignTexture(cv.getContext('2d'), W, H, label)

  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return { canvas: cv, texture: tex, W, H }
}
