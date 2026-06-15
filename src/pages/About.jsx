import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'
import RetroComputer from '../components/RetroComputer.jsx'

export default function About() {
  const { t } = useTranslation()
  return (
    <div className="page">
      <PageNav />
      <main className="wrap about-page">
        <div className="eyebrow">{t('about.eyebrow')}</div>
        <h1 className="title">{t('about.title')}</h1>
        <p className="lead">{t('about.lead')}</p>
        <RetroComputer />
      </main>
    </div>
  )
}
