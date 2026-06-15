import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// All user-facing copy, per language. Proper nouns (tech names, product names, email) stay as-is.
const resources = {
  en: {
    translation: {
      lang: { en: 'English', de: 'Deutsch', es: 'Español', fr: 'Français' },
      nav: {
        title: 'A little world\nof things I’ve made.',
        subtitle: 'Drag to look around. Click a sign to open a page.',
        back: '← Back to island',
      },
      theme: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
      signs: { about: 'About Me', works: 'Works', blog: 'Blog', contact: 'Contact' },
      boards: {
        bicycle: { lines: ['Dream', 'Plan', 'Do'] },
        desk: { lines: ['Ideas', 'become', 'magic.'] },
      },
      about: {
        eyebrow: 'About me',
        title: 'Hi, I’m Waldemar.',
        intro: 'I’m a frontend developer with more than 25 years of experience building interfaces that feel clear, fast, and thoughtful.',
        stats: ['25+ years', 'Accessibility CoP', 'Fintech', 'Design Systems'],
        blocks: [
          {
            title: 'Design & UX',
            text: 'UI/UX design and design systems are core to how I work — from first concept to consistent, scalable components.',
          },
          {
            title: 'Engineering',
            text: 'React, Angular, Vue.js and solid architecture: I build frontends that teams can maintain and users enjoy using.',
          },
          {
            title: 'Accessibility',
            text: 'Three times in the accessibility CoP — I know the common tools and how to build accessible websites from the ground up: WCAG, semantics, keyboard use, screen readers and meaningful testing.',
          },
          {
            title: 'Industries & AI',
            text: 'Startups, fintech, banking, logistics, automotive and the public sector — plus AI and generative AI when it genuinely improves the product.',
          },
        ],
      },
      works: {
        eyebrow: 'Works',
        title: 'Selected work.',
        lead: 'Replace these placeholder cards with your real projects.',
        projects: [
          { title: 'Aurora Dashboard', desc: 'Real-time analytics with calm, glanceable data.' },
          { title: 'Helix Studio', desc: 'Identity & interactive site for a motion studio.' },
          { title: 'Tidepool', desc: 'A habit-tracker that grows into a small ecosystem.' },
          { title: 'Floating Studio', desc: 'This very portfolio — a 3D diorama you can explore.' },
        ],
      },
      blog: {
        eyebrow: 'Blog',
        title: 'Notes & writing.',
        lead: 'Placeholder posts — swap in your own.',
        posts: [
          { date: 'June 2026', title: 'Building a 3D portfolio with react-three-fiber' },
          { date: 'May 2026', title: 'Optimizing huge GLB models for the web' },
          { date: 'April 2026', title: 'Smooth camera motion in the browser' },
        ],
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Let’s build\nsomething.',
        lead: 'Got a project or just want to say hi? I’d love to hear from you.',
      },
    },
  },
  de: {
    translation: {
      lang: { en: 'English', de: 'Deutsch', es: 'Español', fr: 'Français' },
      nav: {
        title: 'Eine kleine Welt\naus Dingen, die ich gemacht habe.',
        subtitle: 'Ziehen, um dich umzusehen. Klick auf ein Schild, um eine Seite zu öffnen.',
        back: '← Zurück zur Insel',
      },
      theme: { toLight: 'Hellmodus', toDark: 'Dunkelmodus' },
      signs: { about: 'Über mich', works: 'Arbeiten', blog: 'Blog', contact: 'Kontakt' },
      boards: {
        bicycle: { lines: ['Träumen', 'Planen', 'Machen'] },
        desk: { lines: ['Ideen', 'werden', 'Magie.'] },
      },
      about: {
        eyebrow: 'Über mich',
        title: 'Hallo, ich bin Waldemar.',
        intro: 'Ich bin Frontend-Entwickler — seit über 25 Jahren baue ich Weboberflächen, die klar, schnell und angenehm zu nutzen sind.',
        stats: ['25+ Jahre', 'Barrierefreiheit CoP', 'Fintech', 'Design Systems'],
        blocks: [
          {
            title: 'Design & UX',
            text: 'UI/UX-Design und Design Systeme sind für mich keine Randnotiz — von der Idee bis zu konsistenten, skalierbaren Komponenten.',
          },
          {
            title: 'Entwicklung',
            text: 'React, Angular, Vue.js und saubere Architektur: ich entwickle Frontends, die Teams pflegen und Nutzer gern bedienen.',
          },
          {
            title: 'Barrierefreiheit',
            text: 'Dreimal im Barrierefreiheit-CoP — ich kenne die gängigen Tools und weiß, wie man Websites von Anfang an zugänglich baut: WCAG, Semantik, Tastaturbedienung, Screenreader und sinnvolle Tests.',
          },
          {
            title: 'Branchen & KI',
            text: 'Start-up, Fintech, Bank, Logistik, Automotive oder Behörde — und KI, wenn sie Produkte spürbar besser macht.',
          },
        ],
      },
      works: {
        eyebrow: 'Arbeiten',
        title: 'Ausgewählte Arbeiten.',
        lead: 'Ersetze diese Platzhalter-Karten durch deine echten Projekte.',
        projects: [
          { title: 'Aurora Dashboard', desc: 'Echtzeit-Analysen mit ruhigen, schnell erfassbaren Daten.' },
          { title: 'Helix Studio', desc: 'Identität & interaktive Website für ein Motion-Studio.' },
          { title: 'Tidepool', desc: 'Ein Gewohnheits-Tracker, der zu einem kleinen Ökosystem wächst.' },
          { title: 'Floating Studio', desc: 'Genau dieses Portfolio — ein 3D-Diorama zum Erkunden.' },
        ],
      },
      blog: {
        eyebrow: 'Blog',
        title: 'Notizen & Geschriebenes.',
        lead: 'Platzhalter-Beiträge — tausch sie gegen deine eigenen aus.',
        posts: [
          { date: 'Juni 2026', title: 'Ein 3D-Portfolio mit react-three-fiber bauen' },
          { date: 'Mai 2026', title: 'Riesige GLB-Modelle fürs Web optimieren' },
          { date: 'April 2026', title: 'Sanfte Kamerafahrten im Browser' },
        ],
      },
      contact: {
        eyebrow: 'Kontakt',
        title: 'Lass uns etwas\nbauen.',
        lead: 'Hast du ein Projekt oder willst einfach Hallo sagen? Ich freue mich, von dir zu hören.',
      },
    },
  },
  es: {
    translation: {
      lang: { en: 'English', de: 'Deutsch', es: 'Español', fr: 'Français' },
      nav: {
        title: 'Un pequeño mundo\nde cosas que he creado.',
        subtitle: 'Arrastra para mirar alrededor. Haz clic en un cartel para abrir una página.',
        back: '← Volver a la isla',
      },
      theme: { toLight: 'Modo claro', toDark: 'Modo oscuro' },
      signs: { about: 'Sobre mí', works: 'Trabajos', blog: 'Blog', contact: 'Contacto' },
      boards: {
        bicycle: { lines: ['Soñar', 'Planear', 'Hacer'] },
        desk: { lines: ['Las ideas', 'se vuelven', 'magia.'] },
      },
      about: {
        eyebrow: 'Sobre mí',
        title: 'Hola, soy Waldemar.',
        intro: 'Soy desarrollador frontend con más de 25 años de experiencia creando interfaces claras, rápidas y agradables de usar.',
        stats: ['25+ años', 'CoP Accesibilidad', 'Fintech', 'Design Systems'],
        blocks: [
          {
            title: 'Diseño & UX',
            text: 'El diseño UI/UX y los design systems son el centro de mi trabajo — desde la idea hasta componentes consistentes y escalables.',
          },
          {
            title: 'Desarrollo',
            text: 'React, Angular, Vue.js y arquitectura sólida: construyo frontends que los equipos pueden mantener y los usuarios disfrutan.',
          },
          {
            title: 'Accesibilidad',
            text: 'Tres veces en el CoP de accesibilidad — conozco las herramientas habituales y sé cómo crear sitios accesibles desde el principio: WCAG, semántica, teclado, lectores de pantalla y pruebas con sentido.',
          },
          {
            title: 'Sectores & IA',
            text: 'Startups, fintech, banca, logística, automoción y sector público — y IA generativa cuando mejora de verdad el producto.',
          },
        ],
      },
      works: {
        eyebrow: 'Trabajos',
        title: 'Trabajos seleccionados.',
        lead: 'Reemplaza estas tarjetas de ejemplo por tus proyectos reales.',
        projects: [
          { title: 'Aurora Dashboard', desc: 'Analíticas en tiempo real con datos claros y fáciles de ver.' },
          { title: 'Helix Studio', desc: 'Identidad y sitio interactivo para un estudio de animación.' },
          { title: 'Tidepool', desc: 'Un rastreador de hábitos que crece hasta ser un pequeño ecosistema.' },
          { title: 'Floating Studio', desc: 'Este mismo portafolio — un diorama 3D que puedes explorar.' },
        ],
      },
      blog: {
        eyebrow: 'Blog',
        title: 'Notas y escritos.',
        lead: 'Entradas de ejemplo — cámbialas por las tuyas.',
        posts: [
          { date: 'Junio 2026', title: 'Crear un portafolio 3D con react-three-fiber' },
          { date: 'Mayo 2026', title: 'Optimizar modelos GLB enormes para la web' },
          { date: 'Abril 2026', title: 'Movimiento de cámara suave en el navegador' },
        ],
      },
      contact: {
        eyebrow: 'Contacto',
        title: 'Construyamos\nalgo.',
        lead: '¿Tienes un proyecto o solo quieres saludar? Me encantaría saber de ti.',
      },
    },
  },
  fr: {
    translation: {
      lang: { en: 'English', de: 'Deutsch', es: 'Español', fr: 'Français' },
      nav: {
        title: 'Un petit monde\nde choses que j’ai créées.',
        subtitle: 'Fais glisser pour regarder autour. Clique sur un panneau pour ouvrir une page.',
        back: '← Retour à l’île',
      },
      theme: { toLight: 'Mode clair', toDark: 'Mode sombre' },
      signs: { about: 'À propos', works: 'Travaux', blog: 'Blog', contact: 'Contact' },
      boards: {
        bicycle: { lines: ['Rêver', 'Planifier', 'Faire'] },
        desk: { lines: ['Les idées', 'deviennent', 'magie.'] },
      },
      about: {
        eyebrow: 'À propos',
        title: 'Bonjour, je suis Waldemar.',
        intro: 'Je suis développeur frontend avec plus de 25 ans d’expérience à créer des interfaces claires, rapides et agréables à utiliser.',
        stats: ['25+ ans', 'CoP Accessibilité', 'Fintech', 'Design Systems'],
        blocks: [
          {
            title: 'Design & UX',
            text: 'Le design UI/UX et les design systems sont au cœur de mon travail — de l’idée aux composants cohérents et évolutifs.',
          },
          {
            title: 'Développement',
            text: 'React, Angular, Vue.js et une architecture solide : je construis des frontends que les équipes peuvent maintenir et que les utilisateurs aiment.',
          },
          {
            title: 'Accessibilité',
            text: 'Trois fois dans le CoP accessibilité — je connais les outils courants et sais comment concevoir des sites accessibles dès le départ : WCAG, sémantique, clavier, lecteurs d’écran et tests pertinents.',
          },
          {
            title: 'Secteurs & IA',
            text: 'Start-up, fintech, banque, logistique, automobile ou secteur public — et l’IA générative quand elle améliore vraiment le produit.',
          },
        ],
      },
      works: {
        eyebrow: 'Travaux',
        title: 'Travaux sélectionnés.',
        lead: 'Remplace ces cartes d’exemple par tes vrais projets.',
        projects: [
          { title: 'Aurora Dashboard', desc: 'Analytique en temps réel avec des données claires et lisibles.' },
          { title: 'Helix Studio', desc: 'Identité et site interactif pour un studio d’animation.' },
          { title: 'Tidepool', desc: 'Un suivi d’habitudes qui devient un petit écosystème.' },
          { title: 'Floating Studio', desc: 'Ce portfolio même — un diorama 3D à explorer.' },
        ],
      },
      blog: {
        eyebrow: 'Blog',
        title: 'Notes & écrits.',
        lead: 'Articles d’exemple — remplace-les par les tiens.',
        posts: [
          { date: 'Juin 2026', title: 'Créer un portfolio 3D avec react-three-fiber' },
          { date: 'Mai 2026', title: 'Optimiser d’énormes modèles GLB pour le web' },
          { date: 'Avril 2026', title: 'Mouvement de caméra fluide dans le navigateur' },
        ],
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Créons\nquelque chose.',
        lead: 'Un projet ou juste envie de dire bonjour ? J’aimerais beaucoup avoir de tes nouvelles.',
      },
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'de', 'es', 'fr'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export const LANGUAGES = ['de', 'en', 'es', 'fr']

export default i18n
