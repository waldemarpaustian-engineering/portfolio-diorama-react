import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'

export default function Contact() {
  const { t } = useTranslation()
  return (
    <div className="page">
      <PageNav />
      <main className="wrap">
        <div className="eyebrow">{t('contact.eyebrow')}</div>
        <h1 className="title">{t('contact.title')}</h1>
        <p className="lead">{t('contact.lead')}</p>
        <a className="mail" href="mailto:waldemar.paustian@googlemail.com">✉ waldemar.paustian@googlemail.com</a>
      </main>
    </div>
  )
}
