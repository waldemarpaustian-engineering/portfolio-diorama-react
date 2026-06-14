import PageNav from './PageNav.jsx'

const projects = [
  { title: 'Aurora Dashboard', desc: 'Real-time analytics with calm, glanceable data.' },
  { title: 'Helix Studio', desc: 'Identity & interactive site for a motion studio.' },
  { title: 'Tidepool', desc: 'A habit-tracker that grows into a small ecosystem.' },
  { title: 'Floating Studio', desc: 'This very portfolio — a 3D diorama you can explore.' },
]

export default function Works() {
  return (
    <div className="page">
      <PageNav />
      <main className="wrap">
        <div className="eyebrow">Works</div>
        <h1 className="title">Selected work.</h1>
        <p className="lead">Replace these placeholder cards with your real projects.</p>
        <div className="grid">
          {projects.map((p) => (
            <div className="card" key={p.title}>
              <div className="thumb" />
              <div className="body">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
