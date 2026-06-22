import PageNav from './PageNav.jsx'
import Footer from '../components/Footer.jsx'
import { useSeo } from '../lib/seo.js'
import { CONTACT } from '../data/contact.js'

// Legal notice (Impressum) per § 5 DDG. Factual fields are filled from the
// contact data; the USt-IdNr placeholder must be completed or removed.
export default function Impressum() {
  useSeo({
    path: '/impressum',
    title: 'Impressum',
    description: 'Impressum und Anbieterkennzeichnung gemäß § 5 DDG.',
    locale: 'de',
  })

  return (
    <div className="page">
      <PageNav />
      <main className="wrap legal">
        <h1 className="title">Impressum</h1>
        <p className="legal__intro">Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz).</p>

        <h2>Anbieter</h2>
        <p>
          Waldemar Paustian<br />
          Paustian Software Engineering (Einzelunternehmen)<br />
          {CONTACT.street}
          <br />
          {CONTACT.city}
          <br />
          Deutschland
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <br />
          Telefon: <a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneDisplay}</a>
        </p>

        <h2>Umsatzsteuer-Identifikationsnummer</h2>
        <p>
          gemäß § 27a Umsatzsteuergesetz:
          <br />
          <span className="legal__todo">
            DE&nbsp;… — bitte eintragen. Falls Kleinunternehmer nach § 19 UStG
            (keine USt-IdNr): diesen Abschnitt ersatzlos entfernen. Die private
            Steuernummer gehört NICHT ins Impressum.
          </span>
        </p>

        <h2>Verantwortlich für den Inhalt</h2>
        <p>
          nach § 18 Abs. 2 MStV (Medienstaatsvertrag):
          <br />
          Waldemar Paustian, Anschrift wie oben.
        </p>

        <h2>Verbraucherstreitbeilegung</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <p className="legal__note">
          Hinweis: Dieses Impressum enthält die gesetzlichen Pflichtangaben. Bitte
          vor Veröffentlichung prüfen (z.&nbsp;B. mit dem Generator von e-Recht24)
          und die USt-IdNr ergänzen oder entfernen.
        </p>
      </main>
      <Footer />
    </div>
  )
}
