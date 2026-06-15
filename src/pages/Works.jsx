import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'

export default function Works() {
  const { t } = useTranslation()
  return (
    <div className="page">
      <PageNav />
      <main className="wrap">
        <div className="eyebrow">{t('work.eyebrow')}</div>
        <h1 className="title">{t('work.title')}</h1>
        <p className="lead">{t('work.lead')}</p>
      </main>
    </div>
  )
}
