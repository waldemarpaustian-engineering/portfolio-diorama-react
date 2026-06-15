import { useEffect, useRef } from 'react'
import { animate, createDrawable, createTimeline, stagger } from 'animejs'

const fadeUp = {
  opacity: [0, 1],
  translateY: [22, 0],
  duration: 640,
  ease: 'out(3)',
}

function showAll(root) {
  root.querySelectorAll('.contact-anim, .contact-anim-social, .contact-letter__path').forEach((el) => {
    el.style.opacity = '1'
    el.style.transform = 'none'
  })
}

export function useContactAnimations() {
  const mainRef = useRef(null)
  const emailRef = useRef(null)

  useEffect(() => {
    const root = mainRef.current
    if (!root) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAll(root)
      return undefined
    }

    const intro = root.querySelectorAll('.contact-intro .contact-anim')
    const primary = root.querySelector('.contact-card--email')
    const cards = root.querySelectorAll('.contact-grid .contact-anim')
    const socials = root.querySelectorAll('.contact-anim-social')
    const letterPaths = root.querySelectorAll('.contact-letter__path')

    const tl = createTimeline()

    if (letterPaths.length) {
      const drawables = createDrawable(letterPaths)
      tl.add(letterPaths, { opacity: [0, 1], duration: 300, ease: 'out(2)' }, 0)
      tl.add(drawables, {
        draw: ['0 0', '0 1'],
        duration: 1500,
        ease: 'inOut(2)',
        delay: stagger(120),
      }, 0)
    }

    if (intro.length) {
      tl.add(intro, { ...fadeUp, delay: stagger(68) }, 100)
    }

    if (primary) {
      tl.add(primary, {
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.97, 1],
        duration: 760,
        ease: 'out(4)',
      }, '+=200')
    }

    if (cards.length) {
      tl.add(cards, { ...fadeUp, delay: stagger(85) }, '+=140')
    }

    if (socials.length) {
      tl.add(socials, {
        opacity: [0, 1],
        translateX: [-14, 0],
        duration: 520,
        ease: 'out(3)',
        delay: stagger(110),
      }, '+=100')
    }

    return () => tl.pause()
  }, [])

  useEffect(() => {
    const el = emailRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let pulse = null

    const onEnter = () => {
      pulse?.pause()
      pulse = animate(el, {
        scale: [1, 1.018],
        duration: 900,
        ease: 'inOut(2)',
        alternate: true,
        loop: true,
      })
      el.classList.add('contact-card--email-glow')
    }

    const onLeave = () => {
      pulse?.pause()
      pulse = null
      el.classList.remove('contact-card--email-glow')
      animate(el, { scale: 1, duration: 280, ease: 'out(2)' })
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('focus', onEnter)
    el.addEventListener('blur', onLeave)

    return () => {
      pulse?.pause()
      el.classList.remove('contact-card--email-glow')
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('focus', onEnter)
      el.removeEventListener('blur', onLeave)
    }
  }, [])

  return { mainRef, emailRef }
}
