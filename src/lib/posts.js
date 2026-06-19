// Central blog index. Every article lives in
//   src/content/blog/<slug>/index.<locale>.mdx   (locale = de | en | es | fr)
// with YAML frontmatter at the top. Vite globs them at build time, so adding a
// new post (or translation) is just dropping in a file — no registry to update.
//
// `frontmatter.readingTime` is injected at build time by the remarkReadingTime
// plugin in vite.config.js, so it is per-locale automatically.

const modules = import.meta.glob('../content/blog/*/index.*.mdx', { eager: true })

// Order in which we look for a usable variant when the requested locale is
// missing: requested → English → German → whatever exists.
const FALLBACK_LOCALES = ['en', 'de']

function parsePath(path) {
  // ../content/blog/react-19-vs-18/index.en.mdx -> { slug, locale }
  const parts = path.split('/')
  const slug = parts[parts.length - 2]
  const match = parts[parts.length - 1].match(/^index\.([a-z]{2})\.mdx$/)
  return { slug, locale: match ? match[1] : 'de' }
}

function toPost(slug, locale, mod) {
  const fm = mod.frontmatter || {}
  return {
    slug,
    locale,
    Component: mod.default,
    title: fm.title || slug,
    date: fm.date || '',
    excerpt: fm.excerpt || '',
    tags: fm.tags || [], // tags are language-neutral and identical across locales
    cover: fm.cover || '',
    readingTime: fm.readingTime || 1,
    draft: Boolean(fm.draft),
  }
}

// { slug: { de: post, en: post, ... } }
const bySlug = {}
for (const [path, mod] of Object.entries(modules)) {
  const { slug, locale } = parsePath(path)
  ;(bySlug[slug] ||= {})[locale] = toPost(slug, locale, mod)
}

function resolve(slug, locale) {
  const variants = bySlug[slug]
  if (!variants) return null
  for (const loc of [locale, ...FALLBACK_LOCALES]) {
    if (variants[loc]) return variants[loc]
  }
  return Object.values(variants)[0] || null
}

const isVisible = (p) => p && (!p.draft || import.meta.env.DEV)

// Posts for a given UI locale (each resolved to that locale or a fallback),
// newest first. Drafts only appear in dev.
export function getPosts(locale) {
  return Object.keys(bySlug)
    .map((slug) => resolve(slug, locale))
    .filter(isVisible)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPost(slug, locale) {
  const post = resolve(slug, locale)
  return isVisible(post) ? post : null
}

// Unique, language-neutral tags across all posts — used for the filter chips.
export function getAllTags(locale) {
  return [...new Set(getPosts(locale).flatMap((p) => p.tags))]
}

export function formatDate(date, locale = 'en') {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return String(date)
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
}
