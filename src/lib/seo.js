import { useEffect } from 'react'
import { SITE_NAME, DEFAULT_LOCALE, OG_LOCALES } from './site.js'

// Imperatively manage <head> tags — no dependency needed. On the client this
// keeps title/description/OG/JSON-LD in sync with the current route + language.
// (For non-JS crawlers, static defaults live in index.html; full crawlability
// comes with prerendering — see the SEO notes.)

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

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSeo({
  title,
  description,
  url,
  image,
  type = 'website',
  locale = DEFAULT_LOCALE,
  jsonLd,
}) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME
    if (locale) document.documentElement.lang = locale

    upsertMeta('name', 'description', description)
    upsertLink('canonical', url)

    // Open Graph
    upsertMeta('property', 'og:title', title || SITE_NAME)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', image)
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
  }, [title, description, url, image, type, locale, JSON.stringify(jsonLd)])
}
