import * as THREE from 'three'

const FONT = (n) => `700 ${n}px Georgia, 'Times New Roman', serif`

// Composites the framed-board content onto a canvas.
// mode 'paper': warm paper background + line-art sketch (multiply) + dark text below.
// mode 'cover': the artwork fills the whole board + "Dream / Plan / Do" overlaid on top.
export function makeBoardTexture(img, { lines = ['Dream', 'Plan', 'Do'], bg = '#dcd0b5', mode = 'paper' } = {}) {
  const W = 768
  const H = 1024
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const x = cv.getContext('2d')

  if (mode === 'top') {
    // paper background (shows in the text area below the image)
    x.fillStyle = bg
    x.fillRect(0, 0, W, H)

    // artwork fills the top ~66% of the board, full width (cover-cropped, color preserved)
    const imgH = H * 0.66
    x.save()
    x.beginPath()
    x.rect(0, 0, W, imgH)
    x.clip()
    const scale = Math.max(W / img.width, imgH / img.height)
    const dw = img.width * scale
    const dh = img.height * scale
    x.drawImage(img, (W - dw) / 2, (imgH - dh) / 2, dw, dh)
    x.restore()

    // text below the image
    x.fillStyle = '#2b2520'
    x.textAlign = 'center'
    x.textBaseline = 'top'
    const fs = W * 0.115
    const lh = fs * 1.08
    const ty = imgH + H * 0.035
    x.font = FONT(fs)
    lines.forEach((t, i) => x.fillText(t, W / 2, ty + i * lh))
    x.font = FONT(fs * 0.8)
    x.fillText('\u2665', W / 2, ty + lines.length * lh + lh * 0.08)
  } else if (mode === 'cover') {
    // scale the image to cover the whole board (cropping overflow)
    const scale = Math.max(W / img.width, H / img.height)
    const dw = img.width * scale
    const dh = img.height * scale
    x.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)

    // dark gradient at the bottom so the text stays readable over the artwork
    const grad = x.createLinearGradient(0, H * 0.5, 0, H)
    grad.addColorStop(0, 'rgba(15,13,11,0)')
    grad.addColorStop(1, 'rgba(15,13,11,0.66)')
    x.fillStyle = grad
    x.fillRect(0, H * 0.5, W, H * 0.5)

    x.textAlign = 'center'
    x.textBaseline = 'top'
    x.fillStyle = '#ffffff'
    x.shadowColor = 'rgba(0,0,0,0.55)'
    x.shadowBlur = 10
    const fs = W * 0.14
    const lh = fs * 1.06
    const startY = H - (lines.length * lh + lh) - H * 0.03
    x.font = FONT(fs)
    lines.forEach((t, i) => x.fillText(t, W / 2, startY + i * lh))
    x.font = FONT(fs * 0.8)
    x.fillText('\u2665', W / 2, startY + lines.length * lh + lh * 0.05)
    x.shadowBlur = 0
  } else {
    // flat paper background matched to the board (no seam)
    x.fillStyle = bg
    x.fillRect(0, 0, W, H)

    // line-art sketch via "multiply" so the white image background melts into the paper
    const pad = W * 0.06
    const iw = W - pad * 2
    const ih = img.height * (iw / img.width)
    const iy = H * 0.05
    x.save()
    x.globalCompositeOperation = 'multiply'
    x.drawImage(img, pad, iy, iw, ih)
    x.restore()

    x.fillStyle = '#2b2520'
    x.textAlign = 'center'
    x.textBaseline = 'top'
    const fs = W * 0.135
    const lh = fs * 1.12
    const ty = iy + ih + H * 0.04
    x.font = FONT(fs)
    lines.forEach((t, i) => x.fillText(t, W / 2, ty + i * lh))
    x.font = FONT(fs * 0.8)
    x.fillText('\u2665', W / 2, ty + lines.length * lh + lh * 0.1)
  }

  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}
