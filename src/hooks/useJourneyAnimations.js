import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WALKER_BOY_FRAMES } from '../components/journey/JourneyArt.jsx'

const WALKER_FRAME_COUNT = WALKER_BOY_FRAMES.length

gsap.registerPlugin(ScrollTrigger)

function getLoopMetrics(track) {
  const originals = [...track.querySelectorAll('.journey-chapter[data-loop="original"]')]
  if (!originals.length) return null

  const firstOriginal = originals[0]
  const lastOriginal = originals[originals.length - 1]
  const pad = 32
  const loopStart = Math.max(0, firstOriginal.offsetLeft - pad)
  const walkerX = Math.min(Math.max(72, track.clientWidth * 0.18), 168)
  const journeyEndScroll = lastOriginal.offsetLeft + lastOriginal.offsetWidth - walkerX + 24
  const journeySpan = Math.max(1, journeyEndScroll - loopStart)

  const firstClone = track.querySelector('.journey-chapter[data-loop="clone"]')
  const seamDistance = firstClone
    ? firstClone.offsetLeft - firstOriginal.offsetLeft
    : 0

  if (!firstClone || seamDistance <= 0) {
    return {
      loopStart,
      loopDistance: journeySpan,
      loopEnd: loopStart + journeySpan,
      journeySpan,
    }
  }

  const loopEnd = loopStart + seamDistance
  const loopDistance = seamDistance

  return { loopStart, loopDistance, loopEnd, journeySpan }
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
  el.querySelectorAll('.journey-note__body > *').forEach((node) => {
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
      const targets = chapter.querySelectorAll('.journey-note__body > *')
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
          horizontal: true,
          start: 'left 72%',
          end: 'right 35%',
          once: true,
          onEnter: () => tl.play(),
          onEnterBack: () => tl.play(),
        }),
      )
    })

    return () => {
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

    function setFrame(index) {
      if (!frameImg) return
      const normalized = ((Math.floor(index) % WALKER_FRAME_COUNT) + WALKER_FRAME_COUNT) % WALKER_FRAME_COUNT
      frameImg.src = WALKER_BOY_FRAMES[normalized]
      frameImg.dataset.frame = String(normalized)
    }

    function syncWalkerFrame() {
      const metrics = getLoopMetrics(track)
      if (!metrics) {
        setFrame(0)
        return
      }
      const offset = Math.max(0, track.scrollLeft - metrics.loopStart)
      const progress = Math.min(1, offset / metrics.journeySpan)
      setFrame(progress * WALKER_FRAME_COUNT)
    }

    syncWalkerFrame()

    function onScroll() {
      if (reduced || !frameImg) return
      syncWalkerFrame()
      walker.classList.add('journey-walker--run')

      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => {
        walker.classList.remove('journey-walker--run')
        syncWalkerFrame()
      }, 220)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      clearTimeout(idleTimerRef.current)
    }
  }, [trackRef, walkerRef])
}

export function useJourneyRockDepth(trackRef, walkerRef) {
  useEffect(() => {
    const track = trackRef.current
    const walker = walkerRef.current
    if (!track || !walker) return undefined

    function update() {
      const rock = document.querySelector('[data-decor-id="rock-mid"]')
      if (!rock) return

      const walkerBox = walker.getBoundingClientRect()
      const rockBox = rock.getBoundingClientRect()
      const walkerFeet = walkerBox.left + walkerBox.width * 0.42
      const rockCenter = rockBox.left + rockBox.width * 0.5

      if (rockCenter > walkerFeet + 18) {
        rock.style.zIndex = '3'
      } else if (rockCenter > walkerFeet - 12) {
        rock.style.zIndex = '5'
      } else {
        rock.style.zIndex = '3'
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

// Near/front shift at p=1: tree-3 (118%) lands ~54% — third tree as journey destination
const PARALLAX_PAPER = 12
const PARALLAX_FAR = 23
const PARALLAX_NEAR = 64
const PARALLAX_FRONT = 64
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

    const onMqChange = () => {
      if (wheelTweenRef.current) {
        wheelTweenRef.current.kill()
        wheelTweenRef.current = null
      }
      ScrollTrigger.refresh()
    }

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
    mq.addEventListener('change', onMqChange)

    return () => {
      container.removeEventListener('wheel', onWheel)
      track.removeEventListener('scroll', onTrackScroll)
      mq.removeEventListener('change', onMqChange)
      if (wheelTweenRef.current) {
        wheelTweenRef.current.kill()
        wheelTweenRef.current = null
      }
    }
  }, [containerRef, trackRef])
}

function getParallaxProgress(track) {
  const metrics = getLoopMetrics(track)
  if (!metrics) {
    const max = Math.max(0, track.scrollWidth - track.clientWidth)
    return max > 0 ? track.scrollLeft / max : 0
  }

  const offset = track.scrollLeft - metrics.loopStart
  if (offset <= 0) return 0
  return Math.min(1, offset / metrics.journeySpan)
}

function applyParallax(
  track,
  layer,
  farLayer,
  nearLayer,
  meadowLayer,
  frontLayer,
  animators,
  immediate = false,
) {
  const p = getParallaxProgress(track)
  const values = {
    paper: -p * PARALLAX_PAPER,
    far: -p * PARALLAX_FAR,
    near: -p * PARALLAX_NEAR,
    front: -p * PARALLAX_FRONT,
  }

  if (immediate) {
    gsap.set(layer, { xPercent: values.paper })
    if (farLayer) gsap.set(farLayer, { xPercent: values.far })
    if (nearLayer) gsap.set(nearLayer, { xPercent: values.near })
    if (meadowLayer) gsap.set(meadowLayer, { xPercent: values.front })
    if (frontLayer) gsap.set(frontLayer, { xPercent: values.front })
    return
  }

  animators.xTo(values.paper)
  if (animators.farTo) animators.farTo(values.far)
  if (animators.nearTo) animators.nearTo(values.near)
  if (animators.meadowTo) animators.meadowTo(values.front)
  if (animators.frontTo) animators.frontTo(values.front)
}

export function useJourneyParallax(
  trackRef,
  layerRef,
  farLayerRef,
  nearLayerRef,
  meadowLayerRef,
  frontLayerRef,
  stageRef,
) {
  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef?.current
    const layer = layerRef.current
    const farLayer = farLayerRef?.current
    const nearLayer = nearLayerRef?.current
    const meadowLayer = meadowLayerRef?.current
    const frontLayer = frontLayerRef?.current
    if (!track || !layer) return undefined

    const animators = {
      xTo: gsap.quickTo(layer, 'xPercent', {
        duration: 0.35,
        ease: 'power2.out',
      }),
      farTo: farLayer ? gsap.quickTo(farLayer, 'xPercent', {
        duration: 0.45,
        ease: 'power2.out',
      }) : null,
      nearTo: nearLayer ? gsap.quickTo(nearLayer, 'xPercent', {
        duration: 0.25,
        ease: 'power2.out',
      }) : null,
      meadowTo: meadowLayer ? gsap.quickTo(meadowLayer, 'xPercent', {
        duration: 0.25,
        ease: 'power2.out',
      }) : null,
      frontTo: frontLayer ? gsap.quickTo(frontLayer, 'xPercent', {
        duration: 0.25,
        ease: 'power2.out',
      }) : null,
    }

    const sync = (immediate = false) => {
      applyParallax(track, layer, farLayer, nearLayer, meadowLayer, frontLayer, animators, immediate)
    }

    sync(true)
    const rafId = requestAnimationFrame(() => sync(true))

    const onScroll = () => sync(false)
    track.addEventListener('scroll', onScroll, { passive: true })

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => sync(true))
      : null
    resizeObserver?.observe(track)
    if (stage) resizeObserver?.observe(stage)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver?.disconnect()
      track.removeEventListener('scroll', onScroll)
      gsap.set(layer, { clearProps: 'transform' })
      if (farLayer) gsap.set(farLayer, { clearProps: 'transform' })
      if (nearLayer) gsap.set(nearLayer, { clearProps: 'transform' })
      if (meadowLayer) gsap.set(meadowLayer, { clearProps: 'transform' })
      if (frontLayer) gsap.set(frontLayer, { clearProps: 'transform' })
    }
  }, [trackRef, layerRef, farLayerRef, nearLayerRef, meadowLayerRef, frontLayerRef, stageRef])
}

function getMobileScrollSpan(track) {
  const metrics = getLoopMetrics(track)
  return metrics?.journeySpan ?? Math.max(1, track.scrollWidth - track.clientWidth)
}

function setJourneyScrollProgress(track, progress) {
  const metrics = getLoopMetrics(track)
  const clamped = Math.max(0, Math.min(1, progress))
  if (!metrics) {
    const max = Math.max(0, track.scrollWidth - track.clientWidth)
    track.scrollLeft = clamped * max
    return
  }
  track.scrollLeft = metrics.loopStart + clamped * metrics.journeySpan
}

export function useJourneySkyGlow(stageRef, theme) {
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const tweens = []

    stage.querySelectorAll('.journey-celestial--sun .journey-celestial__halo-glow').forEach((glow, index) => {
      gsap.set(glow, { scale: 0.9, opacity: 0.5, transformOrigin: '50% 50%' })
      tweens.push(gsap.to(glow, {
        scale: 1.22,
        opacity: 0.92,
        duration: 2.4 + index * 0.25,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: index * 0.35,
      }))
    })

    stage.querySelectorAll('.journey-celestial--sun img').forEach((img, index) => {
      tweens.push(gsap.fromTo(
        img,
        { filter: 'drop-shadow(0 0 10px rgba(255, 196, 90, 0.35))' },
        {
          filter: 'drop-shadow(0 0 22px rgba(255, 210, 110, 0.72))',
          duration: 2.1 + index * 0.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: index * 0.25,
        },
      ))
    })

    stage.querySelectorAll('.journey-celestial--moon .journey-celestial__halo-glow').forEach((glow) => {
      gsap.set(glow, { scale: 0.86, opacity: 0.42, transformOrigin: '50% 50%' })
      tweens.push(gsap.to(glow, {
        scale: 1.14,
        opacity: 0.78,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      }))
    })

    stage.querySelectorAll('.journey-celestial--moon img').forEach((img) => {
      tweens.push(gsap.fromTo(
        img,
        { filter: 'drop-shadow(0 0 8px rgba(210, 220, 255, 0.28))' },
        {
          filter: 'drop-shadow(0 0 20px rgba(230, 238, 255, 0.58))',
          duration: 3.6,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        },
      ))
    })

    return () => {
      tweens.forEach((tween) => tween.kill())
      gsap.set(stage.querySelectorAll('.journey-celestial__halo-glow, .journey-celestial img'), { clearProps: 'all' })
    }
  }, [stageRef, theme])
}

export function useJourneyMobileScroll(stageRef, trackRef, pageRef) {
  useEffect(() => {
    const stage = stageRef.current
    const track = trackRef.current
    const page = pageRef?.current
    if (!stage || !track) return undefined

    const mobileMq = window.matchMedia('(max-width: 899px)')
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let pinTrigger = null

    const teardown = () => {
      pinTrigger?.kill()
      pinTrigger = null
      track.classList.remove('journey-track--mobile-scroll')
      track.style.overflowX = ''
      track.scrollLeft = 0
    }

    const setup = () => {
      teardown()
      if (!mobileMq.matches) return

      track.classList.add('journey-track--mobile-scroll')

      if (reducedMq.matches) {
        track.style.overflowX = 'auto'
        chaptersShowAll(track)
        return
      }

      pinTrigger = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 1.15, getMobileScrollSpan(track) * 1.4)}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.55,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate(self) {
          setJourneyScrollProgress(track, self.progress)
        },
      })
    }

    function chaptersShowAll(trackEl) {
      trackEl.querySelectorAll('.journey-chapter').forEach((chapter) => {
        showChapter(chapter)
      })
    }

    function onWheel(e) {
      if (!mobileMq.matches) return

      const deltaX = e.deltaX
      const deltaY = wheelToPixels(e)
      const delta = Math.abs(deltaX) > Math.abs(deltaY) * 0.6 ? deltaX : deltaY
      if (Math.abs(delta) < 0.5) return

      if (reducedMq.matches) {
        const max = Math.max(0, track.scrollWidth - track.clientWidth)
        if (max <= 0) return
        e.preventDefault()
        track.scrollLeft = Math.max(0, Math.min(max, track.scrollLeft + delta))
        return
      }

      if (!pinTrigger) return

      const stageTop = stage.getBoundingClientRect().top
      const journeyActive = stageTop <= 1 && pinTrigger.progress < 0.999
      const approaching = stageTop > 0 && stageTop < window.innerHeight
      if (!journeyActive && !approaching) return

      e.preventDefault()
      window.scrollBy({ top: delta, left: 0, behavior: 'instant' })
    }

    setup()

    const onChange = () => {
      setup()
      ScrollTrigger.refresh()
    }

    mobileMq.addEventListener('change', onChange)
    reducedMq.addEventListener('change', onChange)
    window.addEventListener('resize', onChange)
    const wheelTarget = page || stage
    wheelTarget.addEventListener('wheel', onWheel, { passive: false })

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => ScrollTrigger.refresh())
      : null
    resizeObserver?.observe(track)
    resizeObserver?.observe(stage)

    return () => {
      mobileMq.removeEventListener('change', onChange)
      reducedMq.removeEventListener('change', onChange)
      window.removeEventListener('resize', onChange)
      wheelTarget.removeEventListener('wheel', onWheel)
      resizeObserver?.disconnect()
      teardown()
    }
  }, [stageRef, trackRef, pageRef])
}
