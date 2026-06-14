import PageNav from './PageNav.jsx'

export default function Contact() {
  return (
    <div className="page">
      <PageNav />
      <main className="wrap">
        <div className="eyebrow">Contact</div>
        <h1 className="title">Let’s build<br />something.</h1>
        <p className="lead">Got a project or just want to say hi? I’d love to hear from you.</p>
        <a className="mail" href="mailto:waldemar.paustian@googlemail.com">✉ waldemar.paustian@googlemail.com</a>
      </main>
    </div>
  )
}
