import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'public/journey/walker-boy-sheet.png'
const OUT_DIR = 'public/journey/walker-boy'
const COLS = 10
const ROWS = 3
const FRAME_COUNT = 30
const OUTPUT_SCALE = 2
const PAPER_THRESHOLD = 235
const COL_OVERLAP = 0.3
const LAST_COL_LEFT_OVERLAP = 0.45
const NUMBER_ZONE_RATIO = 0.2
const CANVAS_PAD_X = 18
const CANVAS_PAD_TOP = 28
const CANVAS_PAD_BOTTOM = 18
const BOUNDS_PAD = { top: 8, bottom: 6, left: 6, right: 6 }

fs.mkdirSync(OUT_DIR, { recursive: true })

const { width, height } = await sharp(SRC).metadata()
const cellW = width / COLS
const cellH = height / ROWS

function isPaper(r, g, b) {
  return r >= PAPER_THRESHOLD && g >= PAPER_THRESHOLD && b >= PAPER_THRESHOLD
}

function floodRemoveExteriorPaper(data, w, h) {
  const out = Buffer.from(data)
  const outside = new Uint8Array(w * h)
  const stack = []

  function tryPush(x, y) {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const idx = y * w + x
    if (outside[idx]) return
    const i = idx * 4
    if (!isPaper(out[i], out[i + 1], out[i + 2])) return
    outside[idx] = 1
    stack.push(idx)
  }

  for (let x = 0; x < w; x += 1) {
    tryPush(x, 0)
    tryPush(x, h - 1)
  }
  for (let y = 0; y < h; y += 1) {
    tryPush(0, y)
    tryPush(w - 1, y)
  }

  while (stack.length) {
    const cur = stack.pop()
    const y = Math.floor(cur / w)
    const x = cur % w
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      tryPush(nx, ny)
    }
  }

  for (let idx = 0; idx < w * h; idx += 1) {
    if (outside[idx]) {
      out[idx * 4 + 3] = 0
    }
  }

  return out
}

function removeNumberInk(data, w, h, keepMask) {
  const out = Buffer.from(data)
  const limit = Math.floor(h * NUMBER_ZONE_RATIO)

  for (let y = 0; y < limit; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const idx = y * w + x
      if (keepMask && keepMask[idx]) continue
      const i = idx * 4
      out[i + 3] = 0
    }
  }

  return out
}

function columnBounds() {
  const bounds = []
  for (let col = 0; col < COLS; col += 1) {
    const coreLeft = col * cellW
    const coreRight = (col + 1) * cellW
    const leftOverlap = col === COLS - 1 ? LAST_COL_LEFT_OVERLAP : COL_OVERLAP
    const left = Math.max(2, Math.floor(coreLeft - cellW * leftOverlap))
    const right = Math.min(width - 2, Math.ceil(coreRight + (col === COLS - 1 ? cellW * 0.06 : cellW * COL_OVERLAP)))
    bounds.push({ left, right })
  }
  return bounds
}

function findComponents(data, w, h) {
  const visited = new Uint8Array(w * h)
  const components = []

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const start = y * w + x
      if (visited[start]) continue
      const i = start * 4
      if (data[i + 3] < 16) continue

      const stack = [start]
      const pixels = []
      visited[start] = 1
      let minX = x
      let maxX = x
      let minY = y
      let maxY = y
      let sumX = 0
      let sumY = 0

      while (stack.length) {
        const cur = stack.pop()
        pixels.push(cur)
        const cy = Math.floor(cur / w)
        const cx = cur % w
        minX = Math.min(minX, cx)
        maxX = Math.max(maxX, cx)
        minY = Math.min(minY, cy)
        maxY = Math.max(maxY, cy)
        sumX += cx
        sumY += cy

        for (const [nx, ny] of [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]]) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
          const next = ny * w + nx
          if (visited[next]) continue
          const j = next * 4
          if (data[j + 3] < 16) continue
          visited[next] = 1
          stack.push(next)
        }
      }

      components.push({
        pixels,
        area: pixels.length,
        minX,
        maxX,
        minY,
        maxY,
        centroidX: sumX / pixels.length,
        centroidY: sumY / pixels.length,
      })
    }
  }

  return components
}

function isNumberComponent(c, w, h) {
  if (c.centroidY > h * NUMBER_ZONE_RATIO) return false
  if (c.area > 900) return false
  const heightSpan = c.maxY - c.minY + 1
  const widthSpan = c.maxX - c.minX + 1
  return heightSpan < h * 0.14 && widthSpan < w * 0.45
}

function pickMainComponent(components, w, h) {
  const centerX = w / 2
  const candidates = components.filter((c) => {
    if (isNumberComponent(c, w, h)) return false
    if (c.area < 80) return false
    if (c.centroidX < w * 0.05 || c.centroidX > w * 0.95) return false
    return true
  })

  if (!candidates.length) return null

  candidates.sort((a, b) => {
    const da = Math.abs(a.centroidX - centerX)
    const db = Math.abs(b.centroidX - centerX)
    const scoreA = a.area - da * 2.5
    const scoreB = b.area - db * 2.5
    return scoreB - scoreA
  })

  return candidates[0]
}

function componentBodyMinY(component, w) {
  const ys = component.pixels.map((p) => Math.floor(p / w)).sort((a, b) => a - b)
  return ys[Math.floor(ys.length * 0.12)]
}

function maskComponent(data, w, h, component) {
  const masked = Buffer.alloc(data.length)
  const keepMask = new Uint8Array(w * h)
  const bodyMinY = componentBodyMinY(component, w)
  let minX = w
  let minY = h
  let maxX = 0
  let maxY = 0

  for (const cur of component.pixels) {
    const cy = Math.floor(cur / w)
    const cx = cur % w
    if (cy < bodyMinY && cy < h * NUMBER_ZONE_RATIO) continue

    keepMask[cur] = 1
    minX = Math.min(minX, cx)
    maxX = Math.max(maxX, cx)
    minY = Math.min(minY, cy)
    maxY = Math.max(maxY, cy)
    const i = cur * 4
    masked[i] = data[i]
    masked[i + 1] = data[i + 1]
    masked[i + 2] = data[i + 2]
    masked[i + 3] = data[i + 3]
  }

  const cleaned = removeNumberInk(masked, w, h, keepMask)

  return {
    data: cleaned,
    bounds: {
      left: Math.max(0, minX - BOUNDS_PAD.left),
      top: Math.max(0, minY - BOUNDS_PAD.top),
      width: Math.min(w, maxX + BOUNDS_PAD.right + 1) - Math.max(0, minX - BOUNDS_PAD.left),
      height: Math.min(h, maxY + BOUNDS_PAD.bottom + 1) - Math.max(0, minY - BOUNDS_PAD.top),
    },
  }
}

const colBounds = columnBounds()
const trimmed = []

for (let row = 0; row < ROWS; row += 1) {
  const rowTop = Math.floor(row * cellH)
  const rowHeight = Math.floor((row + 1) * cellH) - rowTop

  const rowRgba = await sharp(SRC)
    .extract({ left: 0, top: rowTop, width, height: rowHeight })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rowW = rowRgba.info.width
  const rowH = rowRgba.info.height

  for (let col = 0; col < COLS; col += 1) {
    const index = row * COLS + col
    const { left, right } = colBounds[col]
    const cropW = right - left
    if (cropW < 20) continue

    const sliceRgba = await sharp(rowRgba.data, {
      raw: { width: rowW, height: rowH, channels: 4 },
    })
      .extract({ left, top: 0, width: cropW, height: rowH })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const sw = sliceRgba.info.width
    const sh = sliceRgba.info.height
    const processed = floodRemoveExteriorPaper(sliceRgba.data, sw, sh)

    const components = findComponents(processed, sw, sh)
    const main = pickMainComponent(components, sw, sh)
    if (!main) continue

    const masked = maskComponent(processed, sw, sh, main)
    const frame = await sharp(masked.data, {
      raw: { width: sw, height: sh, channels: 4 },
    })
      .extract(masked.bounds)
      .png()
      .toBuffer()

    const meta = await sharp(frame).metadata()
    trimmed.push({ index, buffer: frame, width: meta.width, height: meta.height })
  }
}

trimmed.sort((a, b) => a.index - b.index)

if (trimmed.length !== FRAME_COUNT) {
  console.warn(`Expected ${FRAME_COUNT} frames, got ${trimmed.length}`)
}

const contentW = Math.max(...trimmed.map((f) => f.width))
const contentH = Math.max(...trimmed.map((f) => f.height))
const canvasW = contentW + CANVAS_PAD_X * 2
const canvasH = contentH + CANVAS_PAD_TOP + CANVAS_PAD_BOTTOM

for (const frame of trimmed) {
  const outPath = path.join(OUT_DIR, `${String(frame.index + 1).padStart(2, '0')}.png`)
  const left = Math.round((canvasW - frame.width) / 2)
  const top = CANVAS_PAD_TOP + Math.round((contentH - frame.height) / 2)

  const base = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: frame.buffer, left, top }])
    .png()
    .toBuffer()

  await sharp(base)
    .resize(canvasW * OUTPUT_SCALE, canvasH * OUTPUT_SCALE, {
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 6 })
    .toFile(outPath)
}

console.log(`Extracted ${trimmed.length} frames to ${OUT_DIR} (${canvasW * OUTPUT_SCALE}x${canvasH * OUTPUT_SCALE})`)
