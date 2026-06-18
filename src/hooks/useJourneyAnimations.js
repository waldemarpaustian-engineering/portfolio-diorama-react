import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WALKER_BOY_FRAMES } from '../components/journey/JourneyArt.jsx'
import { JOURNEY_RAIN_CLOUD_ID } from '../data/journeyDecor.js'

const WALKER_FRAME_COUNT = WALKER_BOY_FRAMES.length

gsap.registerPlugin(ScrollTrigger)

const journeyMetricsCache = new WeakMap()

function computeLoopMetrics(track) {
  const originals = [...track.querySelectorAll('.journey-chapter[data-loop="original"]')]
  if (!originals.length) return null

  const firstOriginal = originals[0]
  const lastOriginal = originals[originals.length - 1]
  const pad = 32
  const loopStart = Math.max(0, firstOriginal.offsetLeft - pad)
  const walkerViewportX = getWalkerViewportX()
  const noteEl = lastOriginal.querySelector('.journey-note')
  let journeyEndScroll = lastOriginal.offsetLeft + lastOriginal.offsetWidth - walkerViewportX + 24
  if (noteEl) {
    journeyEndScroll = getNoteRightContentX(track, noteEl) - walkerViewportX
  }
  const journeySpan = Math.max(1, journeyEndScroll - loopStart)

  const firstClone = track.querySelector('.journey-chapter[data-loop="clone"]')
  const seamDistance = firstClone && firstClone.offsetWidth > 0
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

function refreshJourneyMetrics(track) {
  const metrics = computeLoopMetrics(track)
  if (metrics) journeyMetricsCache.set(track, metrics)
  else journeyMetricsCache.delete(track)
  return metrics
}

function getJourneyMetrics(track) {
  return journeyMetricsCache.get(track) ?? refreshJourneyMetrics(track)
}

function getJourneyScrollEnd(track, metrics) {
  const physicalMax = Math.max(0, track.scrollWidth - track.clientWidth)
  const idealEnd = metrics.loopStart + metrics.journeySpan
  return Math.min(physicalMax, idealEnd)
}

function getJourneyProgress(track, metrics) {
  const scrollEnd = getJourneyScrollEnd(track, metrics)
  const offset = track.scrollLeft - metrics.loopStart
  const span = Math.max(1, scrollEnd - metrics.loopStart)
  if (offset <= 0) return 0
  return Math.min(1, offset / span)
}

function clampJourneyScroll(track, value, metrics) {
  if (!metrics) return value
  const journeyEnd = getJourneyScrollEnd(track, metrics)
  return Math.max(metrics.loopStart, Math.min(journeyEnd, value))
}

function getWalkerEndFeetStageX(track, metrics, noteEl) {
  const stage = track.closest('.journey-stage')
  if (!stage || !noteEl) return 0
  const scrollEnd = getJourneyScrollEnd(track, metrics)
  const noteRightContent = getNoteRightContentX(track, noteEl)
  const trackRect = track.getBoundingClientRect()
  const stageRect = stage.getBoundingClientRect()
  return (trackRect.left - stageRect.left) + noteRightContent - scrollEnd
}

function initJourneyTrackScroll(track) {
  const metrics = refreshJourneyMetrics(track)
  if (!metrics) return
  if (track.scrollLeft < metrics.loopStart - 0.5) {
    track.scrollLeft = metrics.loopStart
  }
}

function getWalkerViewportX() {
  const desktop = window.matchMedia('(min-width: 900px)').matches
  const vw = window.innerWidth
  return desktop
    ? Math.min(Math.max(72, vw * 0.18), 168)
    : Math.min(Math.max(56, vw * 0.16), 120)
}

function getWalkerFeetStageX(walker) {
  const stage = walker.closest('.journey-stage')
  if (!stage) return 0
  const stageRect = stage.getBoundingClientRect()
  const walkerRect = walker.getBoundingClientRect()
  return walkerRect.left + walkerRect.width * 0.42 - stageRect.left
}

function getLastOriginalChapter(track) {
  const originals = [...track.querySelectorAll('.journey-chapter[data-loop="original"]')]
  return originals[originals.length - 1] ?? null
}

function getNoteRightContentX(track, noteEl) {
  const trackRect = track.getBoundingClientRect()
  const noteRect = noteEl.getBoundingClientRect()
  return noteRect.right - trackRect.left + track.scrollLeft
}

function shouldHijackHorizontalWheel(stage, track, delta) {
  if (!stage) return true

  const stageRect = stage.getBoundingClientRect()
  const viewportH = window.innerHeight

  // Erst vertikal scrollen, bis der untere Rand der Szene sichtbar ist
  if (stageRect.bottom > viewportH + 8) return false

  const metrics = getJourneyMetrics(track)
  if (delta < 0 && metrics) {
    const atStart = track.scrollLeft <= metrics.loopStart + 2
    if (atStart && window.scrollY > 0) return false
  }

  return true
}

function showChapter(el) {
  const note = el.querySelector('.journey-note')
  if (note) {
    note.style.opacity = '1'
    note.style.transform = 'none'
  }
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
      const note = chapter.querySelector('.journey-note')
      const art = chapter.querySelector('.journey-art')
      if (!note) return

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
      })

      tl.fromTo(
        note,
        {
          autoAlpha: 0,
          y: -22,
          rotate: -1.8,
          transformOrigin: '50% 12%',
        },
        {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          duration: 0.72,
          ease: 'back.out(1.15)',
        },
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
  const baseFeetRef = useRef(0)
  const endFeetRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    const walker = walkerRef.current
    if (!track || !walker) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktopMq = window.matchMedia('(min-width: 900px)')
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

    function measureWalkerFeet() {
      const metrics = refreshJourneyMetrics(track)
      const lastNote = getLastOriginalChapter(track)?.querySelector('.journey-note')
      if (!metrics || !lastNote || !desktopMq.matches) {
        baseFeetRef.current = 0
        endFeetRef.current = 0
        return
      }

      gsap.set(walker, { xPercent: -50, x: 0 })
      baseFeetRef.current = getWalkerFeetStageX(walker)
      endFeetRef.current = getWalkerEndFeetStageX(track, metrics, lastNote)
    }

    function syncWalker() {
      const metrics = getJourneyMetrics(track)
      if (!metrics) {
        setFrame(0)
        gsap.set(walker, { xPercent: -50, x: 0 })
        return
      }
      const progress = getJourneyProgress(track, metrics)
      setFrame(progress * WALKER_FRAME_COUNT)
      if (!desktopMq.matches) return

      const targetFeet = baseFeetRef.current + progress * (endFeetRef.current - baseFeetRef.current)
      gsap.set(walker, { xPercent: -50, x: targetFeet - baseFeetRef.current })
    }

    gsap.set(walker, { xPercent: -50, transformOrigin: '50% 100%' })

    measureWalkerFeet()
    syncWalker()
    initJourneyTrackScroll(track)
    requestAnimationFrame(() => {
      measureWalkerFeet()
      initJourneyTrackScroll(track)
      syncWalker()
    })

    function onScroll() {
      syncWalker()
      if (reduced || !frameImg) return
      walker.classList.add('journey-walker--run')

      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => {
        walker.classList.remove('journey-walker--run')
        syncWalker()
      }, 220)
    }

    let layoutTimer = 0
    function onLayoutChange() {
      clearTimeout(layoutTimer)
      layoutTimer = window.setTimeout(() => {
        measureWalkerFeet()
        syncWalker()
      }, 120)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onLayoutChange)
    desktopMq.addEventListener('change', onLayoutChange)

    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onLayoutChange)
      desktopMq.removeEventListener('change', onLayoutChange)
      clearTimeout(layoutTimer)
      clearTimeout(idleTimerRef.current)
      gsap.set(walker, { clearProps: 'transform' })
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
        rock.style.zIndex = '1'
      } else if (rockCenter > walkerFeet - 12) {
        rock.style.zIndex = '3'
      } else {
        rock.style.zIndex = '1'
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
const MOUSE_PIXEL_BOOST = 6
const TRACKPAD_BOOST = 0.72
const WHEEL_SCROLL_DURATION = 0.72

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

export function useJourneyWheel(containerRef, trackRef, stageRef) {
  const wheelTweenRef = useRef(null)
  const wheelStateRef = useRef({ value: 0 })

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    const stage = stageRef?.current
    if (!container || !track) return undefined

    const mq = window.matchMedia('(min-width: 900px)')

    const onMqChange = () => {
      if (wheelTweenRef.current) {
        wheelTweenRef.current.kill()
        wheelTweenRef.current = null
      }
      refreshJourneyMetrics(track)
      initJourneyTrackScroll(track)
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

      if (!shouldHijackHorizontalWheel(stage, track, delta)) return

      const metrics = getJourneyMetrics(track)
      const startValue = metrics ? clampJourneyScroll(track, track.scrollLeft, metrics) : track.scrollLeft
      const rawTarget = startValue + delta
      const next = metrics ? clampJourneyScroll(track, rawTarget, metrics) : clamp(rawTarget)
      if (Math.abs(next - startValue) < 0.5) return

      e.preventDefault()

      if (wheelTweenRef.current) wheelTweenRef.current.kill()
      wheelStateRef.current.value = startValue
      wheelTweenRef.current = gsap.to(wheelStateRef.current, {
        value: rawTarget,
        duration: WHEEL_SCROLL_DURATION,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: () => {
          const m = getJourneyMetrics(track)
          const wrapped = m
            ? clampJourneyScroll(track, wheelStateRef.current.value, m)
            : clamp(wheelStateRef.current.value)
          isNormalizing = true
          track.scrollLeft = wrapped
          isNormalizing = false
        },
      })
    }

    function onTrackScroll() {
      if (!mq.matches || isNormalizing) return
      const metrics = getJourneyMetrics(track)
      if (!metrics) return
      const normalized = clampJourneyScroll(track, track.scrollLeft, metrics)
      if (Math.abs(normalized - track.scrollLeft) > 0.5) {
        isNormalizing = true
        track.scrollLeft = normalized
        isNormalizing = false
      }
    }

    const initScroll = () => {
      refreshJourneyMetrics(track)
      initJourneyTrackScroll(track)
    }
    initScroll()
    const bootRaf = requestAnimationFrame(() => {
      requestAnimationFrame(initScroll)
    })

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(initScroll)
      : null
    resizeObserver?.observe(track)

    container.addEventListener('wheel', onWheel, { passive: false })
    track.addEventListener('scroll', onTrackScroll, { passive: true })
    mq.addEventListener('change', onMqChange)
    window.addEventListener('resize', initScroll)

    return () => {
      cancelAnimationFrame(bootRaf)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', initScroll)
      container.removeEventListener('wheel', onWheel)
      track.removeEventListener('scroll', onTrackScroll)
      mq.removeEventListener('change', onMqChange)
      if (wheelTweenRef.current) {
        wheelTweenRef.current.kill()
        wheelTweenRef.current = null
      }
    }
  }, [containerRef, trackRef, stageRef])
}

function getParallaxProgress(track) {
  const metrics = getJourneyMetrics(track)
  if (!metrics) {
    const max = Math.max(0, track.scrollWidth - track.clientWidth)
    return max > 0 ? track.scrollLeft / max : 0
  }

  return getJourneyProgress(track, metrics)
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
  const metrics = getJourneyMetrics(track)
  return metrics?.journeySpan ?? Math.max(1, track.scrollWidth - track.clientWidth)
}

function setJourneyScrollProgress(track, progress) {
  const metrics = getJourneyMetrics(track)
  const clamped = Math.max(0, Math.min(1, progress))
  if (!metrics) {
    const max = Math.max(0, track.scrollWidth - track.clientWidth)
    track.scrollLeft = clamped * max
    return
  }
  const scrollEnd = getJourneyScrollEnd(track, metrics)
  track.scrollLeft = metrics.loopStart + clamped * (scrollEnd - metrics.loopStart)
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

const RAIN_DROP_COUNT = 48
const RAIN_DURATION_MIN_S = 5
const RAIN_DURATION_MAX_S = 8
const RAIN_INTERVAL_S = 10

function getRainZoneLayout(cloud, layer, stage) {
  const layerRect = layer.getBoundingClientRect()
  const cloudRect = cloud.getBoundingClientRect()
  const width = cloudRect.width * 0.82
  const inset = (cloudRect.width - width) / 2
  const left = cloudRect.left - layerRect.left + inset
  const top = cloudRect.bottom - layerRect.top - 4

  const meadow = stage.querySelector('.journey-meadow-strip')
  const grassTop = meadow
    ? meadow.getBoundingClientRect().top - layerRect.top
    : layerRect.height
  const height = Math.max(48, grassTop - top)

  return { left, top, width, height }
}

function applyRainZoneLayout(zone, layout) {
  zone.style.left = `${layout.left}px`
  zone.style.top = `${layout.top}px`
  zone.style.width = `${layout.width}px`
  zone.style.height = `${layout.height}px`
}

export function useJourneyRain(stageRef, rainRef, theme) {
  useEffect(() => {
    if (theme === 'dark') return undefined

    const stage = stageRef.current
    const layer = rainRef.current
    if (!stage || !layer) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    let idleTimer = null
    let stopTimer = null
    let dropTweens = []
    let fadeTween = null
    let zoneEl = null
    let disposed = false
    let tickerActive = false

    const getRainCloud = () => stage.querySelector(`[data-decor-id="${JOURNEY_RAIN_CLOUD_ID}"]`)

    const syncZone = () => {
      if (!zoneEl) return
      const cloud = getRainCloud()
      if (!cloud) return
      applyRainZoneLayout(zoneEl, getRainZoneLayout(cloud, layer, stage))
    }

    const onTick = () => syncZone()

    const startZoneSync = () => {
      if (tickerActive) return
      tickerActive = true
      gsap.ticker.add(onTick)
    }

    const stopZoneSync = () => {
      if (!tickerActive) return
      tickerActive = false
      gsap.ticker.remove(onTick)
    }

    const clearRain = () => {
      clearTimeout(stopTimer)
      stopTimer = null
      dropTweens.forEach((tween) => tween.kill())
      dropTweens = []
      fadeTween?.kill()
      fadeTween = null
      stopZoneSync()
      gsap.killTweensOf(layer)
      layer.replaceChildren()
      zoneEl = null
      gsap.set(layer, { opacity: 0 })
    }

    const scheduleIdle = () => {
      if (disposed) return
      const wait = RAIN_INTERVAL_S * 1000
      idleTimer = window.setTimeout(startRain, wait)
    }

    const startRain = () => {
      if (disposed) return

      const cloud = getRainCloud()
      if (!cloud) {
        scheduleIdle()
        return
      }

      clearRain()

      const layout = getRainZoneLayout(cloud, layer, stage)
      zoneEl = document.createElement('div')
      zoneEl.className = 'journey-rain__zone'
      applyRainZoneLayout(zoneEl, layout)
      layer.appendChild(zoneEl)
      startZoneSync()

      for (let i = 0; i < RAIN_DROP_COUNT; i += 1) {
        const drop = document.createElement('span')
        const tilt = 5 + Math.random() * 4
        drop.className = 'journey-rain__drop'
        drop.style.left = `${Math.random() * 100}%`
        drop.style.top = `${-4 - Math.random() * 20}%`
        drop.style.height = `${7 + Math.random() * 4}px`
        drop.style.width = `${1 + Math.random() * 0.55}px`
        drop.style.opacity = String(0.46 + Math.random() * 0.24)
        zoneEl.appendChild(drop)

        gsap.set(drop, { rotation: tilt, transformOrigin: '50% 0%' })
        dropTweens.push(gsap.fromTo(
          drop,
          { y: 0 },
          {
            y: () => zoneEl.offsetHeight + 6,
            rotation: tilt,
            duration: 1 + Math.random() * 0.55,
            repeat: -1,
            ease: 'none',
            delay: Math.random() * 2.8,
          },
        ))
      }

      fadeTween = gsap.to(layer, {
        opacity: 1,
        duration: 1.2,
        ease: 'sine.out',
      })

      const rainDuration = (RAIN_DURATION_MIN_S + Math.random() * (RAIN_DURATION_MAX_S - RAIN_DURATION_MIN_S)) * 1000
      stopTimer = window.setTimeout(() => {
        fadeTween = gsap.to(layer, {
          opacity: 0,
          duration: 2,
          ease: 'sine.in',
          onComplete: () => {
            clearRain()
            scheduleIdle()
          },
        })
      }, rainDuration)
    }

    const onResize = () => syncZone()

    window.addEventListener('resize', onResize, { passive: true })

    let bootRaf = requestAnimationFrame(() => {
      bootRaf = requestAnimationFrame(() => {
        if (!disposed) startRain()
      })
    })

    return () => {
      disposed = true
      cancelAnimationFrame(bootRaf)
      clearTimeout(idleTimer)
      window.removeEventListener('resize', onResize)
      clearRain()
    }
  }, [stageRef, rainRef, theme])
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

      initJourneyTrackScroll(track)
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
