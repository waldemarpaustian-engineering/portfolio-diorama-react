const FONT = (n) => `700 ${n}px Georgia, 'Times New Roman', serif`

// Composites the framed-board content onto a canvas.
// Returns { canvas, symbol } where `symbol` holds the glyph + where/how to draw it, so the
// caller can animate (pulse) it separately. Pass `omitSymbol: true` to leave it out of the
// baked canvas (then the caller draws it each frame).
// mode 'paper': warm paper background + (optional) line-art sketch (multiply) + text.
// mode 'cover': the artwork fills the whole board + text overlaid on top.
// mode 'top':   the artwork fills the top area + text below on the paper.
export function makeBoardTexture(
  img,
  { lines = ['Dream', 'Plan', 'Do'], bg = '#dcd0b5', mode = 'paper', symbol = '\u2665', symbolColor, omitSymbol = false, textColor } = {},
) {
  const W = 768
  const H = 1024
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const x = cv.getContext('2d')

  let ink = textColor || '#2b2520'
  let fs
  let blockTop

  if (mode === 'top' && img) {
    x.fillStyle = bg
    x.fillRect(0, 0, W, H)
    const imgH = H * 0.66
    x.save()
    x.beginPath()
    x.rect(0, 0, W, imgH)
    x.clip()
    const scale = Math.max(W / img.width, imgH / img.height)
    x.drawImage(img, (W - img.width * scale) / 2, (imgH - img.height * scale) / 2, img.width * scale, img.height * scale)
    x.restore()
    fs = W * 0.115
    blockTop = imgH + H * 0.035
  } else if (mode === 'cover' && img) {
    const scale = Math.max(W / img.width, H / img.height)
    x.drawImage(img, (W - img.width * scale) / 2, (H - img.height * scale) / 2, img.width * scale, img.height * scale)
    const grad = x.createLinearGradient(0, H * 0.5, 0, H)
    grad.addColorStop(0, 'rgba(15,13,11,0)')
    grad.addColorStop(1, 'rgba(15,13,11,0.66)')
    x.fillStyle = grad
    x.fillRect(0, H * 0.5, W, H * 0.5)
    ink = textColor || '#ffffff'
    fs = W * 0.14
    blockTop = H - (lines.length * (fs * 1.06) + fs * 1.06) - H * 0.03
  } else {
    // paper mode (optional line-art sketch + text)
    x.fillStyle = bg
    x.fillRect(0, 0, W, H)
    fs = W * 0.135
    const lh = fs * 1.12
    if (img) {
      const pad = W * 0.06
      const iw = W - pad * 2
      const ih = img.height * (iw / img.width)
      const iy = H * 0.05
      x.save()
      x.globalCompositeOperation = 'multiply'
      x.drawImage(img, pad, iy, iw, ih)
      x.restore()
      blockTop = iy + ih + H * 0.04
    } else {
      blockTop = (H - (lines.length * lh + lh)) / 2
    }
  }

  const lh = fs * (mode === 'cover' && img ? 1.06 : mode === 'top' && img ? 1.08 : 1.12)

  // text lines
  x.fillStyle = ink
  x.textAlign = 'center'
  x.textBaseline = 'top'
  if (mode === 'cover' && img) {
    x.shadowColor = 'rgba(0,0,0,0.55)'
    x.shadowBlur = 10
  }
  x.font = FONT(fs)
  lines.forEach((t, i) => x.fillText(t, W / 2, blockTop + i * lh))
  x.shadowBlur = 0

  // symbol metadata (drawn centered, so it can be scaled/pulsed around its middle)
  const symFs = fs * 3.1
  const sym = {
    glyph: symbol,
    cx: W / 2,
    cy: blockTop + lines.length * lh + symFs * 0.6,
    fs: symFs,
    color: symbolColor || ink,
    shadow: mode === 'cover' && img,
  }
  if (symbol && !omitSymbol) drawSymbol(x, sym, 1)

  return { canvas: cv, symbol: sym }
}

// Draws the little symbol (heart/star) centered at sym.cx/cy, scaled by `scale`.
export function drawSymbol(ctx, sym, scale = 1) {
  ctx.save()
  ctx.fillStyle = sym.color
  if (sym.shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.55)'
    ctx.shadowBlur = 10
  }
  if (sym.glyph === '\u2665' || sym.glyph === '\u2764') {
    drawHeart(ctx, sym.cx, sym.cy, sym.fs * scale, sym.color)
  } else {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = FONT(sym.fs * scale)
    ctx.fillText(sym.glyph, sym.cx, sym.cy)
  }
  ctx.restore()
}

// A vector heart whose bottom tip is rounded (no sharp point). Centered on cx/cy.
function drawHeart(ctx, cx, cy, size, color) {
  const r = size * 0.42
  ctx.beginPath()
  ctx.moveTo(cx, cy - r * 0.35)
  ctx.bezierCurveTo(cx - r * 1.1, cy - r * 1.15, cx - r * 1.2, cy + r * 0.35, cx, cy + r * 0.95)
  ctx.bezierCurveTo(cx + r * 1.2, cy + r * 0.35, cx + r * 1.1, cy - r * 1.15, cx, cy - r * 0.35)
  ctx.closePath()
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.lineWidth = r * 0.32
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.fill()
  ctx.stroke()
}
