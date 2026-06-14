import PageNav from './PageNav.jsx'

export default function About() {
  return (
    <div className="page">
      <PageNav />
      <main className="wrap">
        <div className="eyebrow">About me</div>
        <h1 className="title">Hi, I’m Waldemar.</h1>
        <p className="lead">
          I design and build interactive things for the web — somewhere between code, 3D and a good story.
          Replace this placeholder with your own.
        </p>
        <div className="chips" style={{ marginTop: 36 }}>
          <span>Three.js</span><span>WebGL</span><span>React</span><span>Design</span><span>Animation</span>
        </div>
      </main>
    </div>
  )
}
