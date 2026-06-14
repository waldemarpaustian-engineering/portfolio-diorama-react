import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

export default function PageNav() {
  const { t } = useTranslation()
  return (
    <nav className="page-nav">
      <Link className="brand" to="/"><span className="mk" /> Waldemar&nbsp;Paustian</Link>
      <div className="nav-actions">
        <LanguageSwitcher />
        <Link className="back" to="/">{t('nav.back')}</Link>
      </div>
    </nav>
  )
}
