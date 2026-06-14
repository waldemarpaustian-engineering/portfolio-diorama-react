import PageNav from './PageNav.jsx'

const posts = [
  { date: 'June 2026', title: 'Building a 3D portfolio with react-three-fiber' },
  { date: 'May 2026', title: 'Optimizing huge GLB models for the web' },
  { date: 'April 2026', title: 'Smooth camera motion in the browser' },
]

export default function Blog() {
  return (
    <div className="page">
      <PageNav />
      <main className="wrap">
        <div className="eyebrow">Blog</div>
        <h1 className="title">Notes &amp; writing.</h1>
        <p className="lead">Placeholder posts — swap in your own.</p>
        <div style={{ marginTop: 34 }}>
          {posts.map((p) => (
            <div key={p.title} style={{ padding: '22px 0', borderTop: '1px solid #e9e1d6' }}>
              <div style={{ fontSize: 12.5, color: '#7a7782' }}>{p.date}</div>
              <h3 style={{ marginTop: 6, fontSize: 22, letterSpacing: '-.02em' }}>{p.title}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
