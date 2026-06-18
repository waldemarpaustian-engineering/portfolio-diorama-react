// Decorative parallax props on the journey stage.
// type "image": transparent PNG/SVG in /public/journey/cutouts/
// type "css": built-in CSS shapes (cloud, sun, tree, rock)
// Ground height: CSS vars on .journey-stage (--journey-ground, --journey-meadow-bottom)

const TREE_SIZE = 236
const TREE_2_SIZE = Math.round(TREE_SIZE * 1.09)
const TREE_START_SIZE = Math.round(TREE_SIZE * 0.5)
const ROCKS_CLUSTER_SIZE = 58
const ROCK_HEIGHT = 47
const ROCK_WIDTH = Math.round(ROCK_HEIGHT * (1024 / 929))
const ROCK_LARGE_HEIGHT = 54
const ROCK_LARGE_WIDTH = Math.round(ROCK_LARGE_HEIGHT * (1024 / 929))
const SKY_CLOUD_HEIGHT = 80
const SUN_SIZE = 118
const MOON_SIZE = 112
const SIGN_HEIGHT = 64

// Wolke, aus der gelegentlich Nieselregen fällt (Light Mode)
export const JOURNEY_RAIN_CLOUD_ID = 'cloud-2'

function cloudItem(id, src, left, top, nativeW, nativeH, options = {}) {
  const width = Math.round((nativeW / nativeH) * SKY_CLOUD_HEIGHT)
  return {
    id,
    type: 'image',
    src,
    fallback: 'cloud',
    className: `journey-cutout--sky journey-cutout--sky-front${options.rainSource ? ' journey-cutout--rain-source' : ''}`,
    width,
    height: SKY_CLOUD_HEIGHT,
    style: { left, top, zIndex: 1 },
    ...(options.rainSource ? { rainSource: true } : {}),
  }
}

function sunItem(id, left, top) {
  return {
    id,
    type: 'image',
    celestial: 'sun',
    src: '/journey/cutouts/sun.png',
    fallback: 'sun',
    className: 'journey-cutout--sky journey-cutout--sky-back',
    width: SUN_SIZE,
    height: SUN_SIZE,
    style: { left, top, zIndex: 0 },
  }
}

function moonItem(id, left, top) {
  return {
    id,
    type: 'image',
    celestial: 'moon',
    src: '/journey/cutouts/moon.png',
    fallback: 'sun',
    className: 'journey-cutout--sky journey-cutout--moon journey-cutout--sky-front',
    width: MOON_SIZE,
    height: MOON_SIZE,
    style: { left, top, zIndex: 1 },
  }
}

function starItem(id, src, left, top, size, opacity) {
  return {
    id,
    type: 'image',
    src,
    className: 'journey-cutout--sky journey-cutout--star journey-cutout--sky-back',
    width: size,
    height: size,
    style: {
      left,
      top,
      zIndex: 0,
      ...(opacity != null ? { opacity } : {}),
    },
  }
}

// [left%, top%, sizePx, asset 1–10, opacity?]
const NIGHT_SKY_STARS = [
  ['2%', '8%', 5, 6, 0.55],
  ['5%', '13%', 6, 3, 0.65],
  ['9%', '6%', 5, 8, 0.5],
  ['13%', '16%', 7, 1, 0.75],
  ['17%', '9%', 5, 10, 0.6],
  ['21%', '5%', 6, 4, 0.7],
  ['26%', '12%', 5, 2, 0.55],
  ['30%', '7%', 8, 7, 0.8],
  ['34%', '17%', 5, 5, 0.5],
  ['38%', '10%', 6, 9, 0.65],
  ['43%', '6%', 5, 3, 0.55],
  ['47%', '14%', 7, 6, 0.7],
  ['51%', '8%', 5, 1, 0.6],
  ['54%', '18%', 6, 4, 0.5],
  ['72%', '9%', 5, 8, 0.55],
  ['76%', '15%', 6, 2, 0.65],
  ['80%', '6%', 7, 10, 0.75],
  ['84%', '12%', 5, 5, 0.5],
  ['88%', '8%', 6, 3, 0.6],
  ['93%', '17%', 5, 7, 0.55],
  ['97%', '5%', 8, 9, 0.8],
  ['102%', '11%', 5, 6, 0.5],
  ['106%', '7%', 6, 1, 0.65],
  ['111%', '16%', 5, 4, 0.55],
  ['115%', '9%', 7, 2, 0.7],
  ['119%', '5%', 5, 8, 0.5],
  ['124%', '13%', 6, 10, 0.6],
  ['129%', '8%', 5, 3, 0.55],
  ['134%', '6%', 6, 5, 0.65],
  ['139%', '15%', 5, 7, 0.5],
  ['144%', '10%', 7, 9, 0.75],
  ['149%', '7%', 5, 6, 0.55],
  ['154%', '17%', 6, 1, 0.6],
  ['159%', '5%', 5, 4, 0.5],
  ['164%', '12%', 8, 2, 0.8],
  ['169%', '9%', 5, 8, 0.55],
  ['174%', '14%', 6, 3, 0.65],
  ['179%', '6%', 5, 10, 0.5],
  ['184%', '11%', 6, 5, 0.6],
  ['189%', '8%', 5, 7, 0.55],
  ['194%', '16%', 7, 1, 0.7],
  ['199%', '5%', 5, 9, 0.5],
  ['204%', '13%', 6, 6, 0.65],
  ['209%', '9%', 5, 2, 0.55],
  ['214%', '7%', 6, 4, 0.6],
]

function buildNightSkyDecor() {
  const stars = NIGHT_SKY_STARS.map(([left, top, size, asset, opacity], index) =>
    starItem(
      `night-star-${index + 1}`,
      `/journey/cutouts/star-${asset}.png`,
      left,
      top,
      size,
      opacity,
    ),
  )
  return [
    ...stars,
    moonItem('moon-1', '62%', '7%'),
  ]
}

// Small path signposts — one per chapter, meadow layer (behind grass strip)
function signItem(id, src, left, nativeW, nativeH) {
  const width = Math.round((nativeW / nativeH) * SIGN_HEIGHT)
  return {
    id,
    type: 'image',
    src,
    fallback: 'rock',
    className: 'journey-cutout--ground journey-cutout--sign',
    width,
    height: SIGN_HEIGHT,
    style: { left, zIndex: 1 },
  }
}

export const JOURNEY_SIGNPOST_DECOR = [
  signItem('sign-1', '/journey/cutouts/signs/sign-1-early-web.png', '9%', 232, 269),
  signItem('sign-2', '/journey/cutouts/signs/sign-2-frameworks.png', '25%', 226, 266),
  signItem('sign-3', '/journey/cutouts/signs/sign-3-architecture.png', '43%', 252, 269),
  signItem('sign-4', '/journey/cutouts/signs/sign-4-platforms.png', '59%', 233, 259),
  signItem('sign-5', '/journey/cutouts/signs/sign-6-design.png', '77%', 250, 269),
  signItem('sign-6', '/journey/cutouts/signs/sign-5-ai.png', '95%', 251, 258),
]

export const JOURNEY_FRONT_DECOR = [
  {
    id: 'rocks-start',
    type: 'image',
    src: '/journey/cutouts/rocks-cluster.png',
    fallback: 'rock',
    className: 'journey-cutout--ground',
    width: ROCKS_CLUSTER_SIZE,
    height: ROCKS_CLUSTER_SIZE,
    style: { left: '12%' },
  },
]

// Grass strip + depth-sorted rock in front of the walker
export const JOURNEY_MEADOW_DECOR = [
  {
    id: 'rock-mid',
    type: 'image',
    src: '/journey/cutouts/rock.png',
    fallback: 'rock',
    className: 'journey-cutout--ground journey-cutout--rock-depth',
    width: ROCK_WIDTH,
    height: ROCK_HEIGHT,
    style: { left: '70%', transform: 'rotate(8deg)' },
  },
]

export const JOURNEY_FAR_DECOR_LIGHT = [
  sunItem('sun-1', '62%', '7%'),
  sunItem('sun-2', '128%', '5%'),
  cloudItem('cloud-1', '/journey/cutouts/cloud-1.png', '10%', '13%', 180, 107),
  cloudItem('cloud-2', '/journey/cutouts/cloud-2.png', '38%', '9%', 228, 66, { rainSource: true }),
  cloudItem('cloud-3', '/journey/cutouts/cloud-3.png', '84%', '15%', 210, 133),
  cloudItem('cloud-4', '/journey/cutouts/cloud-4.png', '152%', '11%', 228, 86),
  cloudItem('cloud-5', '/journey/cutouts/cloud-5.png', '188%', '14%', 185, 109),
]

export const JOURNEY_FAR_DECOR_DARK = buildNightSkyDecor()

export function getJourneyFarDecor(theme) {
  return theme === 'dark' ? JOURNEY_FAR_DECOR_DARK : JOURNEY_FAR_DECOR_LIGHT
}

/** @deprecated Use getJourneyFarDecor(theme) */
export const JOURNEY_FAR_DECOR = JOURNEY_FAR_DECOR_LIGHT

export const JOURNEY_NEAR_DECOR = [
  {
    id: 'tree-start',
    type: 'image',
    src: '/journey/cutouts/tree-start.png',
    fallback: 'tree',
    className: 'journey-cutout--ground',
    width: TREE_START_SIZE,
    height: TREE_START_SIZE,
    style: { left: '4%' },
  },
  {
    id: 'tree-1',
    type: 'image',
    src: '/journey/cutouts/tree.png',
    fallback: 'tree',
    className: 'journey-cutout--ground',
    width: TREE_SIZE,
    height: TREE_SIZE,
    style: { left: '30%' },
  },
  {
    id: 'tree-2',
    type: 'image',
    src: '/journey/cutouts/tree-2.png',
    fallback: 'tree',
    className: 'journey-cutout--ground',
    width: TREE_2_SIZE,
    height: TREE_2_SIZE,
    style: { left: '78%' },
  },
  {
    id: 'rock-after-tree-2',
    type: 'image',
    src: '/journey/cutouts/rock.png',
    fallback: 'rock',
    className: 'journey-cutout--ground',
    width: ROCK_LARGE_WIDTH,
    height: ROCK_LARGE_HEIGHT,
    style: { left: '86%', transform: 'rotate(-6deg)' },
  },
]
