import { Link, useLocation } from 'react-router-dom'
import { SITE_NAME } from '../lib/site.js'

// Legal links must be reachable from every page (Impressum + Datenschutz).
// Keeps the German URL prefix when the visitor is on a /de page.
export default function Footer() {
  const { pathname } = useLocation()
  const prefix = /^\/de(\/|$)/.test(pathname) ? '/de' : ''
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <span className="site-footer__copy">© {year} {SITE_NAME}</span>
      <nav className="site-footer__nav" aria-label="Rechtliches">
        <Link to={`${prefix}/impressum`}>Impressum</Link>
        <Link to={`${prefix}/datenschutz`}>Datenschutz</Link>
      </nav>
    </footer>
  )
}
