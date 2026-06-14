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

// Renders a crisp wooden nameplate to a canvas and returns a THREE texture.
export function makeSignTexture(label, hw, hh) {
  const W = 512
  const H = Math.max(80, Math.round(W * (hh / hw)))
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const x = cv.getContext('2d')

  const g = x.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#ead0a8')
  g.addColorStop(1, '#caa97c')
  x.fillStyle = g
  roundRect(x, 0, 0, W, H, Math.min(30, H * 0.2))
  x.fill()

  x.lineWidth = Math.max(3, H * 0.05)
  x.strokeStyle = 'rgba(120,86,50,.5)'
  roundRect(x, x.lineWidth, x.lineWidth, W - 2 * x.lineWidth, H - 2 * x.lineWidth, Math.min(24, H * 0.16))
  x.stroke()

  x.fillStyle = '#3a2410'
  x.textAlign = 'center'
  x.textBaseline = 'middle'
  let fs = H * 0.52
  const font = (n) => `800 ${n}px -apple-system, Segoe UI, Helvetica, Arial, sans-serif`
  x.font = font(fs)
  while (x.measureText(label).width > W * 0.84 && fs > 12) {
    fs -= 2
    x.font = font(fs)
  }
  x.fillText(label, W / 2, H / 2 + fs * 0.06)

  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}
