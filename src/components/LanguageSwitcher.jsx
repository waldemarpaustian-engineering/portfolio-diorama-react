import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { LANGUAGES } from '../i18n/index.js'

// Compact language switcher. English and German have dedicated, indexable URLs
// (/… and /de/…), so picking them navigates. Spanish/French have no dedicated
// URL — they switch client-side only (and leave the /de subtree if on it).
export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const current = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2)

  function pick(lng) {
    i18n.changeLanguage(lng)
    const logical = location.pathname.replace(/^\/de(?=\/|$)/, '') || '/'
    const tail = location.search + location.hash
    if (lng === 'de') {
      navigate(`/de${logical === '/' ? '' : logical}${tail}`)
    } else if (lng === 'en' || location.pathname.startsWith('/de')) {
      // English, or ES/FR while on a /de URL → go to the un-prefixed (canonical) path
      navigate(`${logical}${tail}`)
    }
  }

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          className={current === lng ? 'active' : ''}
          aria-pressed={current === lng}
          onClick={() => pick(lng)}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
