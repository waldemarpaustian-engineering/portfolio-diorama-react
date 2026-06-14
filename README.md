# Portfolio Diorama — React (Vite + react-three-fiber)

Interactive 3D portfolio: a floating treehouse diorama with four clickable
navigation signs (About / Works / Blog / Contact).

## Run locally

You need Node.js (LTS). Then, in this folder:

```bash
npm install
npm run dev
```

Open the printed address (e.g. http://localhost:5173).

## Build for production

```bash
npm run build      # output goes to /dist
npm run preview    # preview the production build
```

## Deploy

Push this folder to GitHub, then import the repo on Vercel.
Vercel auto-detects Vite and builds it. `vercel.json` makes client-side
routes (e.g. /about) work on direct load / refresh.

## Where things live

- `public/treehouse-optimized.glb` — the 3D model (Draco-compressed, ~6 MB).
- `src/data/signs.js` — sign positions, labels, links and the default camera view.
- `src/components/Scene.jsx` — the canvas, lights, camera and controls.
- `src/components/Sign.jsx` — one navigation plaque (orientation, hover, click).
- `src/components/Model.jsx` — loads the GLB.
- `src/pages/*` — the four content pages (edit text here).

## Ideas to extend

- Add glow with `@react-three/postprocessing` ( `npm i @react-three/postprocessing` ).
- Animate the camera when a sign is clicked before navigating.
- Replace placeholder page content with your real projects and writing.
