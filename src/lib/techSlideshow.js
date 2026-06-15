import { drawTech, drawTechCard } from './screenTexture.js'

export const TECH_PERIOD = 2.4
export const TECH_FADE = 0.7

export function paintTechSlideshow(ctx, W, H, tech, { t, idx }, variant = 'full') {
  const draw = variant === 'card' ? drawTechCard : drawTech
  ctx.clearRect(0, 0, W, H)
  draw(ctx, W, H, tech[idx], 1)
  if (t > TECH_PERIOD - TECH_FADE) {
    const next = tech[(idx + 1) % tech.length]
    draw(ctx, W, H, next, (t - (TECH_PERIOD - TECH_FADE)) / TECH_FADE)
  }
}
