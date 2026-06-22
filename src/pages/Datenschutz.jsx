import PageNav from './PageNav.jsx'
import Footer from '../components/Footer.jsx'
import { useSeo } from '../lib/seo.js'
import { CONTACT } from '../data/contact.js'

// Privacy policy (Datenschutzerklärung). This is a STRUCTURED SKELETON — the
// legally binding wording must be generated (e.g. e-Recht24) and inserted.
export default function Datenschutz() {
  useSeo({
    path: '/datenschutz',
    title: 'Datenschutzerklärung',
    description: 'Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.',
    locale: 'de',
  })

  return (
    <div className="page">
      <PageNav />
      <main className="wrap legal">
        <h1 className="title">Datenschutzerklärung</h1>

        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlich im Sinne der DSGVO:
          <br />
          Waldemar Paustian, {CONTACT.street}, {CONTACT.city}, Deutschland
          <br />
          E-Mail: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </p>

        <h2>2. Hosting &amp; Server-Logfiles</h2>
        <p>
          Diese Website wird bei <strong>Vercel Inc.</strong> (USA) gehostet; die
          Domain wird über die <strong>STRATO AG</strong> (Berlin, Deutschland)
          verwaltet. Beim Aufruf der Website werden automatisch Daten in
          Server-Logfiles verarbeitet (u.&nbsp;a. IP-Adresse, Datum und Uhrzeit,
          abgerufene Seite, übertragene Datenmenge, Browser-Typ). Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren,
          stabilen Betrieb). Mit den Anbietern besteht jeweils ein
          Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.
        </p>
        <p>
          Da Vercel ein US-Anbieter ist, kann es zu einer Übermittlung
          personenbezogener Daten in die USA kommen. Diese wird auf die
          EU-Standardvertragsklauseln bzw. das EU-US Data Privacy Framework
          gestützt (Art. 44&nbsp;ff. DSGVO).
        </p>

        <h2>3. Schriftarten (Fonts)</h2>
        <p>
          Die verwendeten Schriftarten werden <strong>lokal vom eigenen Server</strong>
          ausgeliefert (selbst gehostet). Es besteht keine Verbindung zu Servern
          Dritter (z.&nbsp;B. Google Fonts), es werden hierfür keine Daten an Dritte
          übermittelt.
        </p>

        <h2>4. Kontaktaufnahme</h2>
        <p>
          Bei Kontaktaufnahme per E-Mail oder Telefon werden die übermittelten Daten
          zur Bearbeitung der Anfrage gespeichert. Rechtsgrundlage: Art. 6 Abs. 1
          lit. b bzw. f DSGVO.
        </p>

        <h2>5. Externe Links</h2>
        <p>
          Die Website verlinkt auf externe Dienste (z.&nbsp;B. LinkedIn, Xing,
          Google Maps). Beim Anklicken gelten die Datenschutzbestimmungen der
          jeweiligen Anbieter.
        </p>

        <h2>6. Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
          der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie ein
          Beschwerderecht bei einer Aufsichtsbehörde (Art. 15–21 DSGVO).
        </p>

        <p className="legal__note">Stand: Juni 2026</p>
      </main>
      <Footer />
    </div>
  )
}
