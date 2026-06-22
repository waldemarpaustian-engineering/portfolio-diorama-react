#!/usr/bin/env node
// Generates public/sitemap.xml, public/robots.txt and public/llms.txt from the
// blog content folders. Run before `vite build` (wired into the build script).
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_LOCALE } from '../src/lib/site.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = join(root, 'src/content/blog')
const publicDir = join(root, 'public')
const today = new Date().toISOString().slice(0, 10)

// --- minimal frontmatter reader (title / date / excerpt) ---
function readFrontmatter(file) {
  const src = readFileSync(file, 'utf8')
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const fm = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (!kv) continue
    let val = kv[2].trim().replace(/^["']|["']$/g, '')
    fm[kv[1]] = val
  }
  return fm
}

// Collect posts using the canonical-language file (fallback to German).
const posts = readdirSync(blogDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => {
    const folder = join(blogDir, d.name)
    const file = existsSync(join(folder, `index.${DEFAULT_LOCALE}.mdx`))
      ? join(folder, `index.${DEFAULT_LOCALE}.mdx`)
      : join(folder, 'index.de.mdx')
    if (!existsSync(file)) return null
    const fm = readFrontmatter(file)
    return { slug: d.name, title: fm.title || d.name, date: fm.date || today, excerpt: fm.excerpt || '' }
  })
  .filter(Boolean)
  .sort((a, b) => new Date(b.date) - new Date(a.date))

const staticRoutes = [
  { path: '/', priority: '1.0' },
  { path: '/about', priority: '0.7' },
  { path: '/work', priority: '0.7' },
  { path: '/blog', priority: '0.9' },
  { path: '/contact', priority: '0.6' },
]

// --- sitemap.xml ---
// English is canonical (un-prefixed); German lives under /de. Each logical page
// emits an <url> for both, each declaring the hreflang alternates.
const pages = [
  ...staticRoutes.map((r) => ({ path: r.path, lastmod: today, priority: r.priority })),
  ...posts.map((p) => ({ path: `/blog/${p.slug}`, lastmod: p.date, priority: '0.8' })),
]
function urlEntry(loc, en, de, lastmod, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="de" href="${de}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .flatMap((p) => {
    const tail = p.path === '/' ? '' : p.path
    const en = `${SITE_URL}${tail}` || SITE_URL
    const de = `${SITE_URL}/de${tail}`
    return [urlEntry(en, en, de, p.lastmod, p.priority), urlEntry(de, en, de, p.lastmod, p.priority)]
  })
  .join('\n')}
</urlset>
`
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)

// --- robots.txt (allow everyone incl. AI crawlers; point to sitemap) ---
const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']
const robots = `# https://www.robotstxt.org/
User-agent: *
Allow: /

# AI crawlers — explicitly allowed so the blog can be cited in AI answers.
${aiBots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${SITE_URL}/sitemap.xml
`
writeFileSync(join(publicDir, 'robots.txt'), robots)

// --- llms.txt (curated index for LLMs) ---
const llms = `# ${SITE_NAME}

> ${DEFAULT_DESCRIPTION}

## Blog

${posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`).join('\n')}

## Pages

- [Home](${SITE_URL}/): Portfolio of Waldemar Paustian, frontend developer.
- [About](${SITE_URL}/about): Background and experience.
- [Work](${SITE_URL}/work): Selected projects and journey.
- [Contact](${SITE_URL}/contact): Get in touch.
`
writeFileSync(join(publicDir, 'llms.txt'), llms)

console.log(`[build-seo] ${posts.length} posts → sitemap.xml, robots.txt, llms.txt`)
