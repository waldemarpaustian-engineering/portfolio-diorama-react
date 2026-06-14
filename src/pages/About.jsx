import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'

export default function About() {
  const { t } = useTranslation()
  const chips = t('about.chips', { returnObjects: true })
  return (
    <div className="page">
      <PageNav />
      <main className="wrap">
        <div className="eyebrow">{t('about.eyebrow')}</div>
        <h1 className="title">{t('about.title')}</h1>
        <p className="lead">{t('about.lead')}</p>
        <div className="chips" style={{ marginTop: 36 }}>
          {chips.map((c) => <span key={c}>{c}</span>)}
        </div>
      </main>
    </div>
  )
}
