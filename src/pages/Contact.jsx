import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'
import SocialLink from '../components/SocialLink.jsx'
import { CONTACT } from '../data/contact.js'
import { linkedinIcon, xingIcon } from '../data/socialIcons.js'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <div className="page">
      <PageNav />
      <main className="wrap contact-page">
        <div className="eyebrow">{t('contact.eyebrow')}</div>
        <h1 className="title">{t('contact.title')}</h1>
        <p className="lead contact-page__lead">{t('contact.lead')}</p>
        <p className="contact-page__note">{t('contact.note')}</p>

        <a className="contact-card contact-card--primary" href={`mailto:${CONTACT.email}`}>
          <span className="contact-card__label">{t('contact.emailLabel')}</span>
          <span className="contact-card__value">{CONTACT.email}</span>
        </a>

        <div className="contact-grid">
          <a className="contact-card" href={`tel:${CONTACT.phone}`}>
            <span className="contact-card__label">{t('contact.phoneLabel')}</span>
            <span className="contact-card__value">{CONTACT.phoneDisplay}</span>
          </a>

          <div className="contact-card contact-card--static">
            <span className="contact-card__label">{t('contact.locationLabel')}</span>
            <address className="contact-card__address">
              <span>{CONTACT.company}</span>
              <span>{CONTACT.street}</span>
              <span>{CONTACT.city}</span>
            </address>
            <a
              className="contact-card__link"
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('contact.openMaps')}
            </a>
          </div>

          <div className="contact-card contact-card--static contact-card--wide">
            <span className="contact-card__label">{t('contact.socialLabel')}</span>
            <div className="contact-social">
              <SocialLink href={CONTACT.linkedin} icon={linkedinIcon} label="LinkedIn" />
              <SocialLink href={CONTACT.xing} icon={xingIcon} label="Xing" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
