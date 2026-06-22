import { useEffect } from 'react'
import { SITE_NAME, SITE_URL, DEFAULT_LOCALE, OG_LOCALES } from './site.js'

// Imperatively manage <head> tags — no dependency needed. On the client this
// keeps title/description/canonical/hreflang/OG/JSON-LD in sync with the current
// route + language. (Static defaults live in index.html; full crawlability comes
// from the post-build prerender — see scripts/prerender.js.)
//
// English lives at the canonical path (/blog/x); German at the /de prefix
// (/de/blog/x). Only these two get dedicated, indexable URLs (+ hreflang).

function upsertMeta(attr, key, content) {
  if (content == null || content === '') return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href, hreflang) {
  if (!href) return
  const sel = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector(sel)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSeo({
  path = '/', // logical path WITHOUT locale prefix or domain, e.g. /blog/slug
  title,
  description,
  image,
  type = 'website',
  locale = DEFAULT_LOCALE,
  jsonLd,
}) {
  useEffect(() => {
    // Is the current URL the German (/de) variant?
    const onDe =
      typeof window !== 'undefined' && /^\/de(\/|$)/.test(window.location.pathname)
    const enUrl = `${SITE_URL}${path === '/' ? '' : path}` || SITE_URL
    const deUrl = `${SITE_URL}/de${path === '/' ? '' : path}`
    const canonical = onDe ? deUrl : enUrl || SITE_URL

    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME
    if (locale) document.documentElement.lang = locale

    upsertMeta('name', 'description', description)
    upsertLink('canonical', canonical)

    // hreflang alternates (English + German + x-default → English)
    upsertLink('alternate', enUrl || SITE_URL, 'en')
    upsertLink('alternate', deUrl, 'de')
    upsertLink('alternate', enUrl || SITE_URL, 'x-default')

    // Open Graph
    upsertMeta('property', 'og:title', title || SITE_NAME)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', image)
    if (image) {
      upsertMeta('property', 'og:image:width', '1200')
      upsertMeta('property', 'og:image:height', '630')
    }
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:locale', OG_LOCALES[locale] || 'en_US')

    // Twitter
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    upsertMeta('name', 'twitter:title', title || SITE_NAME)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)

    // JSON-LD structured data (removed/replaced on change)
    let script
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo-jsonld', '')
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
    return () => script?.remove()
  }, [path, title, description, image, type, locale, JSON.stringify(jsonLd)])
}
