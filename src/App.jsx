import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Starfield from './components/Starfield.jsx'
import ThemeTransition from './components/ThemeTransition.jsx'
import About from './pages/About.jsx'
import Works from './pages/Works.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Contact from './pages/Contact.jsx'

// Lazy-load the 3D home scene so three.js is a separate chunk — it then stays
// out of the (text-only) blog routes, which keeps them light for SEO/perf.
const Scene = lazy(() => import('./components/Scene.jsx'))

export default function App() {
  return (
    <>
      <ThemeTransition />
      <Starfield />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Scene />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Works />} />
          <Route path="/journey" element={<Navigate to="/work" replace />} />
          <Route path="/works" element={<Navigate to="/work" replace />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </>
  )
}
