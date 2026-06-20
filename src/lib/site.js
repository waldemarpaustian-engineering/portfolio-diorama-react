// Central site configuration used for SEO / meta tags and the sitemap.
// ⚠️ CHANGE SITE_URL to your real production domain (no trailing slash).
export const SITE_URL = 'https://waldemarpaustian.dev'

export const SITE_NAME = 'Waldemar Paustian'
export const AUTHOR = 'Waldemar Paustian'
export const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/waldemar-paustian-5aa768118/'

// Canonical / default language — matches i18n `fallbackLng`.
export const DEFAULT_LOCALE = 'en'

export const DEFAULT_TITLE = 'Waldemar Paustian — Frontend Developer'
export const DEFAULT_DESCRIPTION =
  'Frontend developer with 25+ years of experience. A blog on React, Angular, Vue, reactivity, animation (GSAP) and 3D for the web (Three.js).'

// Open Graph wants locale as e.g. en_US; map our short codes.
export const OG_LOCALES = { en: 'en_US', de: 'de_DE', es: 'es_ES', fr: 'fr_FR' }

export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
