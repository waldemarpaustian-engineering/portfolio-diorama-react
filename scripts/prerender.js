#!/usr/bin/env node
// Post-build prerender: serves dist/, drives a real headless browser over every
// route, and saves the fully-rendered HTML back into dist/<route>/index.html.
// Runs in a REAL browser, so the app's browser-only code (three.js, GSAP,
// localStorage, IntersectionObserver) works — unlike Node-based SSG.
import { createServer } from 'node:http'
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const blogDir = join(root, 'src/content/blog')
const PORT = 4317

if (!existsSync(join(dist, 'index.html'))) {
  console.error('[prerender] dist/index.html missing — run the build first.')
  process.exit(1)
}

// --- routes ---
const slugs = readdirSync(blogDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
const enRoutes = [
  { path: '/', wait: '.intro, .stage, #root > *' },
  { path: '/about', wait: '.about-page, main' },
  { path: '/work', wait: '.journey-page, main' },
  { path: '/blog', wait: '.blog-feed, .blog-card' },
  { path: '/contact', wait: '.contact-page, main' },
  { path: '/impressum', wait: '.legal' },
  { path: '/datenschutz', wait: '.legal' },
  ...slugs.map((s) => ({ path: `/blog/${s}`, wait: '.blog-article .blog-prose' })),
].map((r) => ({ ...r, lang: 'en' }))
// Mirror every route under /de, forcing German.
const deRoutes = enRoutes.map((r) => ({
  ...r,
  lang: 'de',
  path: r.path === '/' ? '/de' : `/de${r.path}`,
}))
const routes = [...enRoutes, ...deRoutes]

// --- tiny static server with SPA fallback ---
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.xml': 'text/xml', '.txt': 'text/plain',
}
const server = createServer((req, res) => {
  let file = join(dist, decodeURIComponent(req.url.split('?')[0]))
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(dist, 'index.html') // SPA fallback
  const body = readFileSync(file)
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
  res.end(body)
})

await new Promise((r) => server.listen(PORT, r))
const base = `http://localhost:${PORT}`

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
let ok = 0
try {
  for (const route of routes) {
    const page = await browser.newPage()
    // route language + a stable theme, set before any app script runs
    await page.evaluateOnNewDocument((lng) => {
      try {
        localStorage.setItem('i18nextLng', lng)
        localStorage.setItem('portfolio-theme', 'light')
      } catch (e) {}
    }, route.lang)

    await page.goto(base + route.path, { waitUntil: 'networkidle0', timeout: 30000 })
    try {
      await page.waitForSelector(route.wait, { timeout: 8000 })
    } catch (e) {
      console.warn(`[prerender] ${route.path}: wait selector not found, capturing anyway`)
    }
    // reveal anything still hidden by scroll-reveal so the static HTML is complete
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
    })

    const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML))
    const outDir = route.path === '/' ? dist : join(dist, route.path)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, 'index.html'), html)
    await page.close()
    ok++
    console.log(`[prerender] ✓ ${route.path}`)
  }
} finally {
  await browser.close()
  server.close()
}
console.log(`[prerender] done — ${ok}/${routes.length} routes prerendered`)
