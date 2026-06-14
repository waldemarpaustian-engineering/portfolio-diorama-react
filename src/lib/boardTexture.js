import * as THREE from 'three'

// Composites the framed-board content onto a canvas: a paper background, the sketch
// image at the top, and the "Dream / Plan / Do" lines with a heart underneath.
// `bg` should roughly match the model's board paper color so the overlay edge is invisible.
export function makeBoardTexture(img, lines = ['Dream', 'Plan', 'Do'], bg = '#e7e2d4') {
  const W = 768
  const H = 1024
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const x = cv.getContext('2d')

  // flat paper background matched to the board (no vignette, so there's no visible seam)
  x.fillStyle = bg
  x.fillRect(0, 0, W, H)

  // sketch, fit to width with a small margin, near the top. We draw it with the
  // "multiply" blend so the white image background melts into the paper (no visible box)
  // and only the ink lines remain — and twice, to make those lines read more strongly.
  const pad = W * 0.06
  const iw = W - pad * 2
  const ih = img.height * (iw / img.width)
  const iy = H * 0.05
  x.save()
  x.globalCompositeOperation = 'multiply'
  x.drawImage(img, pad, iy, iw, ih)
  x.drawImage(img, pad, iy, iw, ih)
  x.restore()

  // text block
  x.fillStyle = '#2b2520'
  x.textAlign = 'center'
  x.textBaseline = 'top'
  const fs = W * 0.135
  const lh = fs * 1.12
  const font = (n) => `600 ${n}px Georgia, 'Times New Roman', serif`
  let ty = iy + ih + H * 0.04
  x.font = font(fs)
  lines.forEach((t, i) => x.fillText(t, W / 2, ty + i * lh))

  // heart below the text
  x.font = font(fs * 0.8)
  x.fillText('\u2665', W / 2, ty + lines.length * lh + lh * 0.1)

  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}
