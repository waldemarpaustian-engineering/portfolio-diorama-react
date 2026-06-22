#!/usr/bin/env node
// Renders the cover SVGs to 1200x630 PNGs (Open Graph / social cards).
// Social platforms (LinkedIn, X, Facebook, Slack…) don't support SVG og:image,
// so we rasterize via a real headless browser — which renders the SVG fonts
// correctly, unlike sharp/resvg.
import { readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const blogDir = join(publicDir, 'blog')

// Collect every cover.svg plus the default OG image.
const targets = []
if (existsSync(join(publicDir, 'og-default.svg'))) {
  targets.push({ svg: join(publicDir, 'og-default.svg'), png: join(publicDir, 'og-default.png') })
}
for (const d of readdirSync(blogDir, { withFileTypes: true })) {
  if (!d.isDirectory()) continue
  const svg = join(blogDir, d.name, 'cover.svg')
  if (existsSync(svg)) targets.push({ svg, png: join(blogDir, d.name, 'cover.png') })
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })

let ok = 0
for (const t of targets) {
  await page.goto(pathToFileURL(t.svg).href, { waitUntil: 'load', timeout: 15000 })
  await page.screenshot({ path: t.png, clip: { x: 0, y: 0, width: 1200, height: 630 } })
  ok++
}

await browser.close()
console.log(`[build-og] rendered ${ok} cover PNGs (1200x630)`)
