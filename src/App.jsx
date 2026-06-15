import { Routes, Route, Navigate } from 'react-router-dom'
import Starfield from './components/Starfield.jsx'
import ThemeTransition from './components/ThemeTransition.jsx'
import Scene from './components/Scene.jsx'
import About from './pages/About.jsx'
import Works from './pages/Works.jsx'
import Blog from './pages/Blog.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <>
      <ThemeTransition />
      <Starfield />
      <Routes>
      <Route path="/" element={<Scene />} />
      <Route path="/about" element={<About />} />
      <Route path="/work" element={<Works />} />
      <Route path="/journey" element={<Navigate to="/work" replace />} />
      <Route path="/works" element={<Navigate to="/work" replace />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  )
}
