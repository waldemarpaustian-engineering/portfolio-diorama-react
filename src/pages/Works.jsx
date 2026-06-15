import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'
import { JOURNEY_CHAPTERS } from '../data/journey.js'
import { JourneyArt, JourneyWalker } from '../components/journey/JourneyArt.jsx'
import {
  useJourneyAnimations,
  useJourneyWalker,
  useJourneyWheel,
  useJourneyParallax,
} from '../hooks/useJourneyAnimations.js'

export default function Works() {
  const { t } = useTranslation()
  const pageRef = useRef(null)
  const trackRef = useRef(null)
  const walkerRef = useRef(null)
  const layerRef = useRef(null)
  const chaptersRef = useRef([])
  const copy = t('work.chapters', { returnObjects: true })

  useJourneyAnimations(trackRef, chaptersRef)
  useJourneyWalker(trackRef, walkerRef)
  useJourneyWheel(pageRef, trackRef)
  useJourneyParallax(trackRef, layerRef)

  return (
    <div className="page journey-page" ref={pageRef}>
      <PageNav />
      <header className="journey-intro">
        <div className="eyebrow">{t('work.eyebrow')}</div>
        <h1 className="title">{t('work.title')}</h1>
        <p className="lead">{t('work.lead')}</p>
        <p className="journey-hint">{t('work.hint')}</p>
      </header>

      <div className="journey-stage">
        <div className="journey-stage__paper" ref={layerRef} aria-hidden>
          <div className="journey-stage__fold" />
          <div className="journey-stage__hills" />
        </div>

        <div className="journey-track" ref={trackRef} role="region" aria-label={t('work.ariaTrack')}>
          <div className="journey-track__rail" aria-hidden />
          <div className="journey-walker" ref={walkerRef} aria-hidden>
            <JourneyWalker />
          </div>

          <div className="journey-track__spacer" aria-hidden />

          {JOURNEY_CHAPTERS.map((chapter, i) => {
            const text = copy[i] || {}
            return (
              <article
                key={chapter.id}
                className="journey-chapter"
                data-chapter-id={chapter.id}
                ref={(el) => { chaptersRef.current[i] = el }}
              >
                <div className="journey-chapter__scene">
                  <JourneyArt variant={chapter.art} />
                </div>
                <div className="journey-chapter__inner">
                  <div className="journey-chapter__years">{chapter.years}</div>
                  <h2 className="journey-chapter__title">{text.title}</h2>
                  <p className="journey-chapter__text">{text.text}</p>
                </div>
              </article>
            )
          })}

          <div className="journey-track__spacer" aria-hidden />
        </div>

        <div className="journey-dots" aria-hidden>
          {JOURNEY_CHAPTERS.map((c) => (
            <span key={c.id} className="journey-dots__dot" />
          ))}
        </div>
      </div>
    </div>
  )
}
