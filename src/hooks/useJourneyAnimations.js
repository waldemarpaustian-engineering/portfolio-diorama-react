import { useEffect, useRef } from 'react'
import { createTimeline, stagger } from 'animejs'

function showChapter(el) {
  el.querySelectorAll('.journey-chapter__inner > *').forEach((node) => {
    node.style.opacity = '1'
    node.style.transform = 'none'
  })
}

export function useJourneyAnimations(trackRef, chaptersRef) {
  const playedRef = useRef(new Set())

  useEffect(() => {
    const track = trackRef.current
    const chapters = chaptersRef.current
    if (!track || !chapters?.length) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      chapters.forEach(showChapter)
      return undefined
    }

    const mobileMq = window.matchMedia('(max-width: 899px)')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return
          const el = entry.target
          const id = el.dataset.chapterId
          if (!id || playedRef.current.has(id)) return
          playedRef.current.add(id)

          const targets = el.querySelectorAll('.journey-chapter__inner > *')
          if (!targets.length) return

          const tl = createTimeline()
          tl.add(targets, {
            opacity: [0, 1],
            translateY: [28, 0],
            duration: 680,
            ease: 'out(3)',
            delay: stagger(90),
          }, 0)

          const art = el.querySelector('.journey-art')
          if (art) {
            tl.add(art, {
              opacity: [0, 1],
              scale: [0.92, 1],
              rotate: [-2, 0],
              duration: 820,
              ease: 'out(4)',
            }, 0)
          }
        })
      },
      {
        root: mobileMq.matches ? null : track,
        threshold: mobileMq.matches ? [0.2, 0.35] : [0.45, 0.6],
      },
    )

    chapters.forEach((el) => { if (el) observer.observe(el) })

    return () => observer.disconnect()
  }, [trackRef, chaptersRef])
}

export function useJourneyWalker(trackRef, walkerRef) {
  useEffect(() => {
    const track = trackRef.current
    const walker = walkerRef.current
    if (!track || !walker) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function update() {
      const max = track.scrollWidth - track.clientWidth
      if (max <= 0) return
      const p = track.scrollLeft / max
      const x = 48 + p * (track.scrollWidth - 96)
      walker.style.left = `${x}px`
      if (!reduced) {
        walker.style.transform = `translateX(-50%) translateY(${Math.sin(p * Math.PI * 3) * 3}px)`
      }
    }

    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [trackRef, walkerRef])
}

const LINE_TO_PX = 64
const MOUSE_PIXEL_BOOST = 12
const TRACKPAD_BOOST = 1.15
const SCROLL_EASE = 0.18

function wheelToPixels(e) {
  const { deltaY, deltaMode } = e
  if (deltaMode === 1) return deltaY * LINE_TO_PX
  if (deltaMode === 2) return deltaY * window.innerHeight * 0.9
  if (Math.abs(deltaY) <= 48) return deltaY * MOUSE_PIXEL_BOOST
  return deltaY * TRACKPAD_BOOST
}

export function useJourneyWheel(containerRef, trackRef) {
  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return undefined

    const mq = window.matchMedia('(min-width: 900px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let targetScroll = track.scrollLeft
    let rafId = 0
    let wheeling = false

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth)
    }

    function clamp(v) {
      return Math.max(0, Math.min(maxScroll(), v))
    }

    function tick() {
      const max = maxScroll()
      const current = track.scrollLeft
      const diff = targetScroll - current

      if (Math.abs(diff) < 0.6) {
        track.scrollLeft = clamp(targetScroll)
        rafId = 0
        wheeling = false
        return
      }

      track.scrollLeft = current + diff * SCROLL_EASE
      rafId = requestAnimationFrame(tick)
    }

    function scrollTo(target, instant = false) {
      targetScroll = clamp(target)
      if (instant || reduced) {
        track.scrollLeft = targetScroll
        if (rafId) cancelAnimationFrame(rafId)
        rafId = 0
        wheeling = false
        return
      }
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    function onTrackScroll() {
      if (!wheeling) targetScroll = track.scrollLeft
    }

    function onWheel(e) {
      if (!mq.matches) return

      const max = maxScroll()
      if (max <= 0) return

      const deltaX = e.deltaX
      const deltaY = wheelToPixels(e)
      const useX = Math.abs(deltaX) > Math.abs(deltaY) * 0.6
      const delta = useX ? deltaX : deltaY
      if (Math.abs(delta) < 0.5) return

      const next = clamp(targetScroll + delta)
      if (next === targetScroll) return

      e.preventDefault()
      wheeling = true
      scrollTo(next)
    }

    targetScroll = track.scrollLeft
    track.addEventListener('scroll', onTrackScroll, { passive: true })
    container.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', onWheel)
      track.removeEventListener('scroll', onTrackScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [containerRef, trackRef])
}

export function useJourneyParallax(trackRef, layerRef) {
  useEffect(() => {
    const track = trackRef.current
    const layer = layerRef.current
    if (!track || !layer) return undefined

    function update() {
      const max = track.scrollWidth - track.clientWidth
      const p = max > 0 ? track.scrollLeft / max : 0
      layer.style.transform = `translateX(${-p * 12}%)`
    }

    update()
    track.addEventListener('scroll', update, { passive: true })
    return () => track.removeEventListener('scroll', update)
  }, [trackRef, layerRef])
}
