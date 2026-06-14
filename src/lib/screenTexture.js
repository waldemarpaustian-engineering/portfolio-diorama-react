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
  const target = Math.min(W, H) * 0.46
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
