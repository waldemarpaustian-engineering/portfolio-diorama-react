// Central blog index. Every article lives in src/content/blog/<slug>/index.mdx
// with YAML frontmatter at the top. Vite globs them at build time, so adding a
// new post is just dropping in a new folder — no registry to update by hand.

// Compiled MDX modules: each exposes `default` (the component) and `frontmatter`.
// `frontmatter.readingTime` is injected at build time by the remarkReadingTime
// plugin in vite.config.js.
const modules = import.meta.glob('../content/blog/*/index.mdx', { eager: true })

function slugFromPath(path) {
  // ../content/blog/hello-mdx/index.mdx -> hello-mdx
  return path.split('/').slice(-2)[0]
}

export const posts = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = slugFromPath(path)
    const fm = mod.frontmatter || {}
    return {
      slug,
      Component: mod.default,
      title: fm.title || slug,
      date: fm.date || '',
      excerpt: fm.excerpt || '',
      tags: fm.tags || [],
      cover: fm.cover || '',
      readingTime: fm.readingTime || 1,
      draft: Boolean(fm.draft),
    }
  })
  .filter((p) => !p.draft || import.meta.env.DEV) // drafts only show in dev
  .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first

export function getPost(slug) {
  return posts.find((p) => p.slug === slug)
}

// All unique tags, most frequent first — used for the filter chips.
export const allTags = [...new Set(posts.flatMap((p) => p.tags))]

export function formatDate(date, locale = 'en') {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return String(date)
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
}
