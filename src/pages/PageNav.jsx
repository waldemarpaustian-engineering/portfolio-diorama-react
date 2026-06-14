import { Link } from 'react-router-dom'

export default function PageNav() {
  return (
    <nav className="page-nav">
      <Link className="brand" to="/"><span className="mk" /> Waldemar&nbsp;Paustian</Link>
      <Link className="back" to="/">← Back to island</Link>
    </nav>
  )
}
