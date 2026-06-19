#!/usr/bin/env python3
"""Generate a detailed, multi-page two-column Three.js cheat sheet PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Preformatted,
    Table, TableStyle, Spacer, KeepTogether,
)

OUT = "public/downloads/threejs-cheatsheet.pdf"

INK = colors.HexColor("#2b2a33")
MUTED = colors.HexColor("#6b6976")
BLUE = colors.HexColor("#3d6fc0")
GREEN = colors.HexColor("#35a06b")
ORANGE = colors.HexColor("#c46a2b")
CODE_BG = colors.HexColor("#f1f5fa")
LINE = colors.HexColor("#d6e4f0")

PAGE_W, PAGE_H = A4
MARGIN = 13 * mm
GAP = 6 * mm
COL_W = (PAGE_W - 2 * MARGIN - GAP) / 2

h_section = ParagraphStyle("sec", fontName="Helvetica-Bold", fontSize=10,
                           textColor=colors.white, leading=12, leftIndent=4)
h_note = ParagraphStyle("note", fontName="Helvetica", fontSize=7.4,
                        textColor=MUTED, leading=9.6, spaceBefore=2)
code_style = ParagraphStyle("code", fontName="Courier", fontSize=7.0,
                            textColor=INK, leading=9.0)


def section(title, accent=BLUE):
    bar = Table([[Paragraph(title, h_section)]], colWidths=[COL_W])
    bar.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), accent),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ]))
    return bar


def code(snippet):
    box = Table([[Preformatted(snippet, code_style)]], colWidths=[COL_W])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return box


def block(title, snippet, accent=BLUE, hint=None):
    parts = [section(title, accent), code(snippet)]
    if hint:
        parts.append(Paragraph(hint, h_note))
    parts.append(Spacer(1, 6))
    return KeepTogether(parts)


story = []

story.append(block("SETUP — the trinity", """import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75, innerWidth/innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio,2))
document.body.appendChild(renderer.domElement)""", GREEN,
                   "Scene = world, Camera = view, Renderer -> canvas."))

story.append(block("RENDER LOOP & RESIZE", """const clock = new THREE.Clock()
function animate(){
  requestAnimationFrame(animate)
  const dt = clock.getDelta()       // time-based!
  mesh.rotation.y += dt
  renderer.render(scene, camera)
}
animate()

addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})""", BLUE,
                   "Multiply motion by delta. updateProjectionMatrix() after camera changes."))

story.append(block("GEOMETRIES", """new THREE.BoxGeometry(1,1,1)
new THREE.SphereGeometry(1, 32, 32)
new THREE.PlaneGeometry(10, 10)
new THREE.CylinderGeometry(1,1,2,32)
new THREE.TorusGeometry(1, 0.4, 16, 100)
new THREE.ConeGeometry(1, 2, 32)
// custom: BufferGeometry + setAttribute('position', ...)""", BLUE))

story.append(block("MATERIALS", """// no light, fastest:
new THREE.MeshBasicMaterial({color:0xff0000})
// PBR — the default:
new THREE.MeshStandardMaterial({
  color:0x4a7fd4, roughness:0.4, metalness:0.1})
// glass / clearcoat:
new THREE.MeshPhysicalMaterial({
  transmission:1, thickness:0.5})""", GREEN,
                   "StandardMaterial needs light, or it stays black."))

story.append(block("MESH & TRANSFORMS", """const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

mesh.position.set(2, 0, -3)
mesh.rotation.y = Math.PI/4      // RADIANS, not degrees
mesh.scale.set(2, 2, 2)
mesh.lookAt(0, 0, 0)

const group = new THREE.Group()  // scene graph
group.add(a, b); scene.add(group)""", BLUE))

story.append(block("LIGHTS", """scene.add(new THREE.AmbientLight(0xffffff, 0.4))
const sun = new THREE.DirectionalLight(0xffffff, 1)
sun.position.set(5, 10, 7)
scene.add(sun)
new THREE.PointLight(0xffaa00, 1, 20)
new THREE.SpotLight(0xffffff, 1)
new THREE.HemisphereLight(0x87ceeb, 0x442, 0.8)""", GREEN,
                   "Ambient + Directional covers 80%. Only Dir/Point/Spot cast shadows."))

story.append(block("CAMERA & CONTROLS", """import {OrbitControls} from
  'three/addons/controls/OrbitControls.js'

const controls = new OrbitControls(
  camera, renderer.domElement)
controls.enableDamping = true
// in loop: controls.update()

// PerspectiveCamera(fov, aspect, near, far)
// OrthographicCamera for isometric / 2D""", BLUE))

story.append(block("TEXTURES", """const t = new THREE.TextureLoader().load('/c.jpg')
t.colorSpace = THREE.SRGBColorSpace   // color maps!
t.wrapS = t.wrapT = THREE.RepeatWrapping
t.repeat.set(8, 8)

new THREE.MeshStandardMaterial({
  map:t, normalMap:n, roughnessMap:r, aoMap:ao})""", GREEN,
                   "Color maps = SRGB. Data maps (normal/rough) = no color space."))

story.append(block("LOAD MODELS — GLTF", """import {GLTFLoader} from
  'three/addons/loaders/GLTFLoader.js'

new GLTFLoader().load('/model.glb', (gltf) => {
  scene.add(gltf.scene)
})
// .glb = packed glTF; use Draco/Meshopt to compress""", BLUE,
                   "glTF is the web standard. Get assets: Poly Haven, Sketchfab, Blender."))

story.append(block("ANIMATION (mixer)", """const mixer = new THREE.AnimationMixer(gltf.scene)
mixer.clipAction(gltf.animations[0]).play()
// in loop:
mixer.update(clock.getDelta())
// blend clips with action.crossFadeTo(next, 0.4)""", BLUE))

story.append(block("SHADOWS", """renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
sun.castShadow = true
mesh.castShadow = true
floor.receiveShadow = true
sun.shadow.mapSize.set(2048, 2048)
sun.shadow.bias = -0.0001   // fix shadow acne""", ORANGE,
                   "Enable in 3 places: renderer, light, objects."))

story.append(block("ENVIRONMENT & FOG", """scene.fog = new THREE.Fog(0xcccccc, 10, 50)
scene.background = new THREE.Color(0x87ceeb)

import {RGBELoader} from
  'three/addons/loaders/RGBELoader.js'
new RGBELoader().load('/sky.hdr', (hdr) => {
  hdr.mapping =
    THREE.EquirectangularReflectionMapping
  scene.environment = hdr   // realistic lighting
})""", GREEN,
                   "An HDRI environment often replaces half your lighting setup."))

story.append(block("RAYCASTING — click", """const ray = new THREE.Raycaster()
const m = new THREE.Vector2()
addEventListener('click', (e) => {
  m.x = (e.clientX/innerWidth)*2 - 1
  m.y = -(e.clientY/innerHeight)*2 + 1
  ray.setFromCamera(m, camera)
  const hits = ray.intersectObjects(scene.children, true)
  if (hits[0]) hits[0].object.material.color.set('red')
})""", BLUE))

story.append(block("PARTICLES (Points)", """const pos = new Float32Array(count*3)
// fill pos with x,y,z values...
const g = new THREE.BufferGeometry()
g.setAttribute('position',
  new THREE.BufferAttribute(pos, 3))
const pts = new THREE.Points(g,
  new THREE.PointsMaterial({size:0.1}))
scene.add(pts)""", BLUE))

story.append(block("PERFORMANCE", """// many identical objects -> 1 draw call
const im = new THREE.InstancedMesh(geo, mat, 1000)
im.setMatrixAt(i, matrix)        // per instance

renderer.setPixelRatio(Math.min(devicePixelRatio,2))
geometry.dispose(); material.dispose()  // cleanup!
// THREE.LOD for distance-based detail
// shrink textures; KTX2/Basis for big projects""", ORANGE,
                   "Measure with stats.js first. Usual bottleneck: draw calls or texture size."))

story.append(block("COLOR & TONE MAPPING", """renderer.toneMapping =
  THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0
// modern three.js outputs sRGB by default""", GREEN,
                   "ACES tone mapping = a softer, photographic look."))

story.append(block("WEBGPU (2026)", """import * as THREE from 'three/webgpu'
const renderer = new THREE.WebGPURenderer({antialias:true})
await renderer.init()
// auto-fallback to WebGL when unsupported
// custom shaders -> port to TSL / node materials""", ORANGE,
                   "Production-ready since r171 + Safari 26. Adds compute shaders."))

story.append(block("REACT THREE FIBER", """import {Canvas, useFrame} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'

<Canvas camera={{position:[0,0,5]}}>
  <ambientLight intensity={0.6} />
  <directionalLight position={[5,5,5]} />
  <mesh>
    <boxGeometry args={[1,1,1]} />
    <meshStandardMaterial color="#4a7fd4" />
  </mesh>
  <OrbitControls enableDamping />
</Canvas>""", BLUE,
                   "Drei = helpers, Rapier = physics. The React way to do Three.js."))

story.append(block("HELPERS & DEBUG", """scene.add(new THREE.AxesHelper(5))
scene.add(new THREE.GridHelper(20, 20))
new THREE.DirectionalLightHelper(sun)
new THREE.CameraHelper(camera)

import GUI from 'lil-gui'   // live tweak panel
new GUI().add(sun, 'intensity', 0, 5)""", BLUE,
                   "lil-gui + stats.js = your two best debugging friends."))


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#0e1a2b"))
    canvas.rect(0, PAGE_H - 16 * mm, PAGE_W, 16 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 17)
    canvas.drawString(MARGIN, PAGE_H - 11 * mm, "Three.js Cheat Sheet")
    canvas.setFillColor(colors.HexColor("#9fd0f5"))
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 9 * mm, "r184 · 2026")
    canvas.setFillColor(colors.HexColor("#bcd6ee"))
    canvas.setFont("Helvetica", 7.5)
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 13 * mm,
                           "waldemarpaustian.dev/blog")
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawCentredString(PAGE_W / 2, 7 * mm,
                             "Three.js — threejs.org  ·  page %d" % doc.page)
    canvas.restoreState()


top = PAGE_H - 19 * mm
frame_h = top - 12 * mm
left = Frame(MARGIN, 11 * mm, COL_W, frame_h, leftPadding=0, rightPadding=0,
             topPadding=0, bottomPadding=0, id="left")
right = Frame(MARGIN + COL_W + GAP, 11 * mm, COL_W, frame_h, leftPadding=0,
              rightPadding=0, topPadding=0, bottomPadding=0, id="right")

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN,
                      topMargin=19 * mm, bottomMargin=11 * mm,
                      title="Three.js Cheat Sheet 2026", author="Waldemar Paustian")
doc.addPageTemplates([PageTemplate(id="two", frames=[left, right], onPage=on_page)])
doc.build(story)
print("wrote", OUT)
