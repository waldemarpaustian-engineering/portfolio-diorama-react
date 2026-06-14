import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'

export default function Blog() {
  const { t } = useTranslation()
  const posts = t('blog.posts', { returnObjects: true })
  return (
    <div className="page">
      <PageNav />
      <main className="wrap">
        <div className="eyebrow">{t('blog.eyebrow')}</div>
        <h1 className="title">{t('blog.title')}</h1>
        <p className="lead">{t('blog.lead')}</p>
        <div style={{ marginTop: 34 }}>
          {posts.map((p) => (
            <div key={p.title} style={{ padding: '22px 0', borderTop: '1px solid #e9e1d6' }}>
              <div style={{ fontSize: 12.5, color: '#7a7782' }}>{p.date}</div>
              <h3 style={{ marginTop: 6, fontSize: 22, letterSpacing: '-.02em' }}>{p.title}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
