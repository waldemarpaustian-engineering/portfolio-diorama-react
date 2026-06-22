import { Suspense, lazy, useLayoutEffect } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

// Forces German for the /de URL subtree, so crawlers and direct visitors get
// German content there regardless of any stored language preference. English
// lives at the un-prefixed canonical paths.
function LocaleLayout({ lang }) {
  const { i18n } = useTranslation()
  useLayoutEffect(() => {
    if ((i18n.language || '').slice(0, 2) !== lang) i18n.changeLanguage(lang)
  }, [lang, i18n])
  return <Outlet />
}

export default function App() {
  return (
    <>
      <ThemeTransition />
      <Starfield />
      <Suspense fallback={null}>
        <Routes>
          {/* English — canonical, un-prefixed */}
          <Route path="/" element={<Scene />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Works />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/journey" element={<Navigate to="/work" replace />} />
          <Route path="/works" element={<Navigate to="/work" replace />} />

          {/* German — /de prefix forces the German language */}
          <Route path="/de" element={<LocaleLayout lang="de" />}>
            <Route index element={<Scene />} />
            <Route path="about" element={<About />} />
            <Route path="work" element={<Works />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
