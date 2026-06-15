import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'
import RetroComputer from '../components/RetroComputer.jsx'
import { useTheme } from '../hooks/useTheme.js'

export default function About() {
  const { t } = useTranslation()
  const theme = useTheme()
  const blocks = t('about.blocks', { returnObjects: true })
  const portrait = theme === 'dark' ? '/monitor-portrait.png' : '/monitor-portrait-light.png'

  return (
    <div className="page">
      <PageNav />
      <main className="wrap about-page">
        <section className="about-hero">
          <div className="about-hero__copy">
            <div className="eyebrow">{t('about.eyebrow')}</div>
            <h1 className="title">{t('about.title')}</h1>
            <p className="lead about-hero__intro">{t('about.intro')}</p>
            <Link className="about-journey-link" to="/work">{t('about.workLink')}</Link>
          </div>
          <img
            className="about-hero__portrait"
            src={portrait}
            alt=""
            loading="eager"
            decoding="async"
          />
        </section>

        <div className="about-blocks">
          {blocks.map((b) => (
            <article className="about-block" key={b.title}>
              <h2>{b.title}</h2>
              <p>{b.text}</p>
            </article>
          ))}
        </div>

        <RetroComputer />
      </main>
    </div>
  )
}
