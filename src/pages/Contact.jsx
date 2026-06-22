import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'
import Footer from '../components/Footer.jsx'
import ContactLetterArt from '../components/ContactLetterArt.jsx'
import SocialLink from '../components/SocialLink.jsx'
import { CONTACT } from '../data/contact.js'
import { linkedinIcon, xingIcon } from '../data/socialIcons.js'
import { useContactAnimations } from '../hooks/useContactAnimations.js'
import { useSeo } from '../lib/seo.js'
import { absoluteUrl } from '../lib/site.js'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const { mainRef, emailRef } = useContactAnimations()

  useSeo({
    path: '/contact',
    title: t('contact.title').replace(/\n/g, ' '),
    description: t('contact.lead'),
    locale: (i18n.language || 'en').split('-')[0],
    image: absoluteUrl('/og-default.png'),
  })

  return (
    <div className="page">
      <PageNav />
      <main ref={mainRef} className="wrap contact-page">
        <ContactLetterArt />

        <div className="contact-intro">
          <div className="contact-anim eyebrow">{t('contact.eyebrow')}</div>
          <h1 className="contact-anim title">{t('contact.title')}</h1>
          <p className="contact-anim lead contact-page__lead">{t('contact.lead')}</p>
          <p className="contact-anim contact-page__note">{t('contact.note')}</p>
        </div>

        <a
          ref={emailRef}
          className="contact-anim contact-card contact-card--primary contact-card--email"
          href={`mailto:${CONTACT.email}`}
        >
          <span className="contact-card__label">{t('contact.emailLabel')}</span>
          <span className="contact-card__value">{CONTACT.email}</span>
        </a>

        <div className="contact-grid">
          <a className="contact-anim contact-card" href={`tel:${CONTACT.phone}`}>
            <span className="contact-card__label">{t('contact.phoneLabel')}</span>
            <span className="contact-card__value">{CONTACT.phoneDisplay}</span>
          </a>

          <div className="contact-anim contact-card contact-card--static">
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

          <div className="contact-anim contact-card contact-card--static contact-card--wide">
            <span className="contact-card__label">{t('contact.socialLabel')}</span>
            <div className="contact-social">
              <SocialLink
                className="contact-anim-social"
                href={CONTACT.linkedin}
                icon={linkedinIcon}
                label="LinkedIn"
              />
              <SocialLink
                className="contact-anim-social"
                href={CONTACT.xing}
                icon={xingIcon}
                label="Xing"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
