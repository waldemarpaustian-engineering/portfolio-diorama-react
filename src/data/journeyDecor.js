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

export const JOURNEY_FRONT_DECOR = [
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

export const JOURNEY_FAR_DECOR = [
  { id: 'cloud-1', type: 'css', variant: 'cloud', style: { left: '12%', top: '14%' } },
  { id: 'cloud-2', type: 'css', variant: 'cloud', style: { left: '48%', top: '10%' } },
  { id: 'sun-1', type: 'css', variant: 'sun', style: { left: '64%', top: '8%' } },
  { id: 'cloud-3', type: 'css', variant: 'cloud', style: { left: '92%', top: '16%' } },
  { id: 'sun-2', type: 'css', variant: 'sun', style: { left: '132%', top: '6%' } },
  { id: 'cloud-4', type: 'css', variant: 'cloud', style: { left: '168%', top: '12%' } },
]

export const JOURNEY_NEAR_DECOR = [
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
