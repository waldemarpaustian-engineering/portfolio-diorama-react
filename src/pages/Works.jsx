import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'

export default function Works() {
  const { t } = useTranslation()
  const projects = t('work.projects', { returnObjects: true })
  return (
    <div className="page">
      <PageNav />
      <main className="wrap">
        <div className="eyebrow">{t('work.eyebrow')}</div>
        <h1 className="title">{t('work.title')}</h1>
        <p className="lead">{t('work.lead')}</p>
        <div className="grid">
          {projects.map((p) => (
            <div className="card" key={p.title}>
              <div className="thumb" />
              <div className="body">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
