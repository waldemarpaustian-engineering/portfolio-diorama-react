import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'

export default function Blog() {
  const { t } = useTranslation()
  return (
    <div className="page">
      <PageNav />
      <main className="wrap">
        <div className="eyebrow">{t('blog.eyebrow')}</div>
        <h1 className="title">{t('blog.title')}</h1>
        <p className="lead">{t('blog.lead')}</p>
      </main>
    </div>
  )
}
