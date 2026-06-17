import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WALKER_BOY_FRAMES } from '../components/journey/JourneyArt.jsx'

const WALKER_FRAME_COUNT = WALKER_BOY_FRAMES.length

gsap.registerPlugin(ScrollTrigger)

function getLoopMetrics(track) {
  const firstOriginal = track.querySelector('.journey-chapter[data-loop="original"]')
  const firstClone = track.querySelector('.journey-chapter[data-loop="clone"]')
  if (!firstOriginal || !firstClone) return null

  const loopStart = Math.max(0, firstOriginal.offsetLeft - 32)
  const loopDistance = firstClone.offsetLeft - firstOriginal.offsetLeft
  if (loopDistance <= 0) return null

  return { loopStart, loopDistance, loopEnd: loopStart + loopDistance }
}

function normalizeLoopPosition(value, metrics) {
  if (!metrics) return value
  const { loopStart, loopDistance, loopEnd } = metrics
  let out = value
  while (out < loopStart) out += loopDistance
  while (out >= loopEnd) out -= loopDistance
  return out
}

function showChapter(el) {
  el.querySelectorAll('.journey-chapter__inner > *').forEach((node) => {
    node.style.opacity = '1'
    node.style.transform = 'none'
  })
  const art = el.querySelector('.journey-art')
  if (art) {
    art.style.opacity = '1'
    art.style.transform = 'none'
  }
}

export function useJourneyAnimations(trackRef, chaptersRef) {
  useEffect(() => {
    const track = trackRef.current
    const chapters = chaptersRef.current
    if (!track || !chapters?.length) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      chapters.forEach(showChapter)
      return undefined
    }

    const revealItems = []
    const chapterTriggers = []

    chapters.forEach((chapter) => {
      if (!chapter) return
      const targets = chapter.querySelectorAll('.journey-chapter__inner > *')
      const art = chapter.querySelector('.journey-art')
      if (!targets.length) return

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
      })

      tl.fromTo(
        targets,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.08 },
      )

      if (art) {
        tl.fromTo(
          art,
          { autoAlpha: 0, y: 20, scale: 0.94, rotate: -2 },
          { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.72 },
          0,
        )
      }

      revealItems.push({ chapter, tl })
      chapterTriggers.push(
        ScrollTrigger.create({
          trigger: chapter,
          scroller: track,
          start: 'left 72%',
          end: 'right 35%',
          once: true,
          onEnter: () => tl.play(),
          onEnterBack: () => tl.play(),
        }),
      )
    })

    const mobileTriggers = []
    const mobileMedia = window.matchMedia('(max-width: 899px)')
    if (mobileMedia.matches) {
      chapterTriggers.forEach((trigger) => trigger.kill())
      revealItems.forEach(({ chapter, tl }) => {
        mobileTriggers.push(
          ScrollTrigger.create({
            trigger: chapter,
            scroller: track,
            start: 'top 85%',
            once: true,
            onEnter: () => tl.play(),
          }),
        )
      })
    }

    return () => {
      mobileTriggers.forEach((trigger) => trigger.kill())
      chapterTriggers.forEach((trigger) => trigger.kill())
      revealItems.forEach(({ tl }) => tl.kill())
    }
  }, [trackRef, chaptersRef])
}

export function useJourneyWalker(trackRef, walkerRef) {
  const idleTimerRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    const walker = walkerRef.current
    if (!track || !walker) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const frameImg = walker.querySelector('.journey-walker__frame')

    WALKER_BOY_FRAMES.forEach((src) => {
      const img = new Image()
      img.src = src
    })

    let frameProgress = 0
    let lastScroll = track.scrollLeft

    function setFrame(index) {
      if (!frameImg) return
      const normalized = ((Math.floor(index) % WALKER_FRAME_COUNT) + WALKER_FRAME_COUNT) % WALKER_FRAME_COUNT
      frameImg.src = WALKER_BOY_FRAMES[normalized]
      frameImg.dataset.frame = String(normalized)
    }

    setFrame(0)

    function onScroll() {
      if (reduced || !frameImg) return
      const delta = Math.abs(track.scrollLeft - lastScroll)
      lastScroll = track.scrollLeft
      if (delta < 0.2) return

      frameProgress = (frameProgress + delta / 12) % WALKER_FRAME_COUNT
      setFrame(frameProgress)
      walker.classList.add('journey-walker--run')

      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => {
        walker.classList.remove('journey-walker--run')
        frameProgress = 0
        setFrame(0)
      }, 220)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      clearTimeout(idleTimerRef.current)
    }
  }, [trackRef, walkerRef])
}

const LINE_TO_PX = 64
const MOUSE_PIXEL_BOOST = 12
const TRACKPAD_BOOST = 1.15
function wheelToPixels(e) {
  const { deltaY, deltaMode } = e
  if (deltaMode === 1) return deltaY * LINE_TO_PX
  if (deltaMode === 2) return deltaY * window.innerHeight * 0.9
  if (Math.abs(deltaY) <= 48) return deltaY * MOUSE_PIXEL_BOOST
  return deltaY * TRACKPAD_BOOST
}

export function useJourneyWheel(containerRef, trackRef) {
  const wheelTweenRef = useRef(null)
  const wheelStateRef = useRef({ value: 0 })

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return undefined

    const mq = window.matchMedia('(min-width: 900px)')

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth)
    }

    function clamp(v) {
      return Math.max(0, Math.min(maxScroll(), v))
    }

    let isNormalizing = false

    function onWheel(e) {
      if (!mq.matches) return

      const max = maxScroll()
      if (max <= 0) return

      const deltaX = e.deltaX
      const deltaY = wheelToPixels(e)
      const useX = Math.abs(deltaX) > Math.abs(deltaY) * 0.6
      const delta = useX ? deltaX : deltaY
      if (Math.abs(delta) < 0.5) return

      const metrics = getLoopMetrics(track)
      const startValue = metrics ? normalizeLoopPosition(track.scrollLeft, metrics) : track.scrollLeft
      const rawTarget = startValue + delta
      const next = metrics ? normalizeLoopPosition(rawTarget, metrics) : clamp(rawTarget)
      if (Math.abs(next - startValue) < 0.5) return

      e.preventDefault()

      if (wheelTweenRef.current) wheelTweenRef.current.kill()
      wheelStateRef.current.value = startValue
      wheelTweenRef.current = gsap.to(wheelStateRef.current, {
        value: rawTarget,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: () => {
          const m = getLoopMetrics(track)
          const wrapped = m
            ? normalizeLoopPosition(wheelStateRef.current.value, m)
            : clamp(wheelStateRef.current.value)
          isNormalizing = true
          track.scrollLeft = wrapped
          isNormalizing = false
        },
      })
    }

    function onTrackScroll() {
      if (!mq.matches || isNormalizing) return
      const metrics = getLoopMetrics(track)
      if (!metrics) return
      const normalized = normalizeLoopPosition(track.scrollLeft, metrics)
      if (Math.abs(normalized - track.scrollLeft) > 0.5) {
        isNormalizing = true
        track.scrollLeft = normalized
        isNormalizing = false
      }
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    track.addEventListener('scroll', onTrackScroll, { passive: true })

    return () => {
      container.removeEventListener('wheel', onWheel)
      track.removeEventListener('scroll', onTrackScroll)
      if (wheelTweenRef.current) {
        wheelTweenRef.current.kill()
        wheelTweenRef.current = null
      }
    }
  }, [containerRef, trackRef])
}

export function useJourneyParallax(trackRef, layerRef, farLayerRef, nearLayerRef) {
  useEffect(() => {
    const track = trackRef.current
    const layer = layerRef.current
    const farLayer = farLayerRef?.current
    const nearLayer = nearLayerRef?.current
    if (!track || !layer) return undefined

    const xTo = gsap.quickTo(layer, 'xPercent', {
      duration: 0.35,
      ease: 'power2.out',
    })
    const farTo = farLayer ? gsap.quickTo(farLayer, 'xPercent', {
      duration: 0.45,
      ease: 'power2.out',
    }) : null
    const nearTo = nearLayer ? gsap.quickTo(nearLayer, 'xPercent', {
      duration: 0.25,
      ease: 'power2.out',
    }) : null

    function update() {
      const metrics = getLoopMetrics(track)
      const current = metrics
        ? normalizeLoopPosition(track.scrollLeft, metrics)
        : track.scrollLeft
      const max = metrics ? metrics.loopDistance : (track.scrollWidth - track.clientWidth)
      const offset = metrics ? (current - metrics.loopStart) : current
      const p = max > 0 ? offset / max : 0
      xTo(-p * 12)
      if (farTo) farTo(-p * 6.5)
      if (nearTo) nearTo(-p * 18)
    }

    update()
    track.addEventListener('scroll', update, { passive: true })
    return () => {
      track.removeEventListener('scroll', update)
      gsap.set(layer, { clearProps: 'transform' })
      if (farLayer) gsap.set(farLayer, { clearProps: 'transform' })
      if (nearLayer) gsap.set(nearLayer, { clearProps: 'transform' })
    }
  }, [trackRef, layerRef, farLayerRef, nearLayerRef])
}
