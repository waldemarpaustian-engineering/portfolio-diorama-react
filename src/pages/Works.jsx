import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'
import { JOURNEY_CHAPTERS } from '../data/journey.js'
import { JOURNEY_NEAR_DECOR, JOURNEY_FRONT_DECOR, JOURNEY_MEADOW_DECOR, JOURNEY_CHAPTER_SIGNS, getJourneyFarDecor } from '../data/journeyDecor.js'
import { JourneyArt, JourneyCutout, JourneyWalker } from '../components/journey/JourneyArt.jsx'
import { useTheme } from '../hooks/useTheme.js'
import {
  useJourneyAnimations,
  useJourneyWalker,
  useJourneyRockDepth,
  useJourneyWheel,
  useJourneyParallax,
  useJourneyMobileScroll,
  useJourneySkyGlow,
  useJourneyRain,
} from '../hooks/useJourneyAnimations.js'

export default function Works() {
  const { t } = useTranslation()
  const theme = useTheme()
  const farDecor = getJourneyFarDecor(theme)
  const pageRef = useRef(null)
  const stageRef = useRef(null)
  const trackRef = useRef(null)
  const walkerRef = useRef(null)
  const layerRef = useRef(null)
  const layerFarRef = useRef(null)
  const layerRainRef = useRef(null)
  const layerNearRef = useRef(null)
  const layerMeadowRef = useRef(null)
  const layerFrontRef = useRef(null)
  const chaptersRef = useRef([])
  const copy = t('work.chapters', { returnObjects: true })
  const desktopChapters = JOURNEY_CHAPTERS
  const loopedChapters = [...desktopChapters, ...desktopChapters]

  useJourneyAnimations(trackRef, chaptersRef)
  useJourneyWalker(trackRef, walkerRef)
  useJourneyRockDepth(trackRef, walkerRef)
  useJourneyWheel(pageRef, trackRef, stageRef)
  useJourneyParallax(trackRef, layerRef, layerFarRef, layerNearRef, layerMeadowRef, layerFrontRef, stageRef)
  useJourneyMobileScroll(stageRef, trackRef, pageRef)
  useJourneySkyGlow(stageRef, theme)
  useJourneyRain(stageRef, layerRainRef, theme)

  return (
    <div className="page journey-page" ref={pageRef}>
      <PageNav />
      <header className="journey-intro">
        <h1 className="title">{t('work.title')}</h1>
        <p className="journey-hint">{t('work.hint')}</p>
      </header>

      <div className="journey-stage" ref={stageRef}>
        <div className="journey-stage__paper" ref={layerRef} aria-hidden />
        <div className="journey-layer journey-layer--far" ref={layerFarRef} aria-hidden>
          {farDecor.map((item) => (
            <JourneyCutout key={`${item.id}-${theme}`} item={item} />
          ))}
        </div>
        <div className="journey-layer journey-layer--near" ref={layerNearRef} aria-hidden>
          {JOURNEY_NEAR_DECOR.map((item) => (
            <JourneyCutout key={item.id} item={item} />
          ))}
        </div>

        <div className="journey-layer journey-layer--meadow" ref={layerMeadowRef} aria-hidden>
          <div className="journey-meadow-strip" aria-hidden />
          {JOURNEY_MEADOW_DECOR.map((item) => (
            <JourneyCutout key={item.id} item={item} />
          ))}
        </div>

        <div className="journey-layer journey-layer--front" ref={layerFrontRef} aria-hidden>
          {JOURNEY_FRONT_DECOR.map((item) => (
            <JourneyCutout key={item.id} item={item} />
          ))}
        </div>

        <div className="journey-layer journey-layer--rain" ref={layerRainRef} aria-hidden />

        <div className="journey-walker" ref={walkerRef} aria-hidden>
          <JourneyWalker />
        </div>

        <div className="journey-track" ref={trackRef} role="region" aria-label={t('work.ariaTrack')}>
          <div className="journey-track__rail" aria-hidden />

          <div className="journey-track__spacer" aria-hidden />

          {loopedChapters.map((chapter, i) => {
            const baseIndex = i % desktopChapters.length
            const text = copy[baseIndex] || {}
            const isOriginal = i < desktopChapters.length
            return (
              <article
                key={`${chapter.id}-${isOriginal ? 'original' : 'clone'}`}
                className={`journey-chapter journey-chapter--slot-${baseIndex + 1}`}
                data-chapter-id={chapter.id}
                data-loop={isOriginal ? 'original' : 'clone'}
                aria-hidden={!isOriginal}
                ref={(el) => {
                  if (isOriginal) chaptersRef.current[baseIndex] = el
                }}
              >
                <div className="journey-chapter__scene">
                  <JourneyArt variant={chapter.art} />
                </div>
                <div className="journey-chapter__inner journey-note">
                  <div className="journey-note__frame" aria-hidden />
                  <div className="journey-note__body">
                    <h2 className="journey-chapter__title">{text.title}</h2>
                    {text.projects ? (
                      <p className="journey-chapter__projects">{text.projects}</p>
                    ) : null}
                    {text.tagline ? (
                      <p className="journey-chapter__tagline">{text.tagline}</p>
                    ) : null}
                    <p className="journey-chapter__text">
                      {text.text}
                      {text.note ? (
                        <>
                          {' '}
                          <em className="journey-chapter__note-inline">{text.note}</em>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
                {isOriginal ? (
                  <div className="journey-chapter__sign" aria-hidden>
                    <JourneyCutout item={JOURNEY_CHAPTER_SIGNS[baseIndex]} />
                  </div>
                ) : null}
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
