import { Routes, Route } from 'react-router-dom'
import Scene from './components/Scene.jsx'
import About from './pages/About.jsx'
import Works from './pages/Works.jsx'
import Blog from './pages/Blog.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Scene />} />
      <Route path="/about" element={<About />} />
      <Route path="/works" element={<Works />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}
