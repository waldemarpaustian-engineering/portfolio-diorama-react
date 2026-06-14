# Project handoff — Portfolio Diorama (React)

Use this file as context. It summarizes what exists and what to build next.

## What this is
An interactive 3D portfolio: a floating "treehouse" diorama (a Meshy-generated
GLB) that the user can orbit. Four wooden signs on the model act as navigation:
About Me, Works, Blog, Contact. Clicking a sign opens that page.

## Stack
Vite + React + react-three-fiber (@react-three/fiber, @react-three/drei),
react-router-dom. Model is Draco-compressed (~6 MB) in /public.

## File map
- public/treehouse-optimized.glb — the model (Draco). Originally 275 MB / 5.9M tris;
  optimized to ~6 MB via simplify + 1024px textures + Draco.
- src/data/signs.js — sign positions (p), face directions (nrm), sizes, links, and
  the default camera framing (VIEW).
- src/components/Scene.jsx — Canvas, lights, camera, OrbitControls, model group.
- src/components/Model.jsx — loads the GLB (useGLTF).
- src/components/Sign.jsx — one plaque: canvas-texture label, fixed orientation
  (faces its board normal), hover glow/scale, click → navigate, and it hides when
  it faces away from the camera.
- src/lib/signTexture.js — draws the wooden nameplate to a canvas texture.
- src/pages/* — About / Works / Blog / Contact (placeholder content to replace).

## Key decisions / gotchas
- The model is centered near origin already; it's scaled by MODEL_SCALE (~3.17) so
  its largest dimension ≈ 6 units. Signs live inside that scaled group.
- Sign positions and face normals were read directly from the GLB geometry
  (plane-fit via PCA), so the plaques sit flat on the boards facing the diorama's
  FRONT. The default camera also looks at that front.
- Signs use depthTest:false + renderOrder 999 so they're never occluded by the
  model, and a per-sign facing test hides them when you orbit behind.
- The baked text in the model's own signs is blurry/garbled (AI-generated), which
  is why crisp HTML/canvas labels are drawn on top.

## Deploy
Push to GitHub, import on Vercel (auto-detects Vite). vercel.json rewrites all
routes to index.html so /about etc. work on refresh.

## Good next steps
- Replace placeholder text in src/pages/* with real content.
- Add postprocessing glow: `npm i @react-three/postprocessing` then an
  <EffectComposer><Bloom/></EffectComposer> in Scene.jsx.
- Animate the camera toward a sign before navigating (lerp on click).
- Optional: a subtle idle float/auto-rotate; a mobile-friendly fallback.
