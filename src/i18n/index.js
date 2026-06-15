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
      signs: { about: 'About Me', work: 'Work', blog: 'Blog', contact: 'Contact' },
      boards: {
        bicycle: { lines: ['Dream', 'Plan', 'Do'] },
        desk: { lines: ['Ideas', 'become', 'magic.'] },
      },
      about: {
        eyebrow: 'About me',
        title: 'Hi, I’m Waldemar.',
        intro: 'I’m a frontend developer with more than 25 years of experience building interfaces that feel clear, fast, and thoughtful.',
        stats: ['25+ years', 'Accessibility', 'Fintech', 'Design Systems'],
        blocks: [
          {
            title: 'Frontend Development',
            text: 'With React, Angular and Vue.js I build scalable frontends — from reusable components and libraries to microfrontend architectures designed for long-term maintainability and reliable everyday use.',
          },
          {
            title: 'Industries & AI',
            text: 'Startups, fintech, banking, logistics, automotive and the public sector — plus AI and generative AI when it genuinely improves the product.',
          },
          {
            title: 'Design & UX',
            text: 'UI/UX design and design systems are core to how I work — from first concept to consistent, scalable components.',
          },
          {
            title: 'Accessibility',
            text: 'Accessibility is part of how I build — including components that are accessible from the start: semantic markup, keyboard navigation and screen readers, with WCAG in mind and practical testing using established tools.',
          },
        ],
      },
      work: {
        eyebrow: 'Work',
        title: 'Selected work.',
        lead: 'Case studies and projects will appear here soon.',
      },
      blog: {
        eyebrow: 'Blog',
        title: 'Notes & writing.',
        lead: 'Articles will appear here soon.',
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Let’s build\nsomething.',
        lead: 'Got a project, a freelance enquiry or just want to say hi? I’d love to hear from you.',
        note: 'Usually reply within 1–2 business days.',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        locationLabel: 'Location',
        socialLabel: 'Find me on',
        openMaps: 'Open in Maps',
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
      signs: { about: 'Über mich', work: 'Arbeit', blog: 'Blog', contact: 'Kontakt' },
      boards: {
        bicycle: { lines: ['Träumen', 'Planen', 'Machen'] },
        desk: { lines: ['Ideen', 'werden', 'Magie.'] },
      },
      about: {
        eyebrow: 'Über mich',
        title: 'Hallo, ich bin Waldemar.',
        intro: 'Ich bin Frontend-Entwickler — seit über 25 Jahren baue ich Weboberflächen, die klar, schnell und angenehm zu nutzen sind.',
        stats: ['25+ Jahre', 'Barrierefreiheit', 'Fintech', 'Design Systems'],
        blocks: [
          {
            title: 'Frontend Entwicklung',
            text: 'Mit React, Angular und Vue.js realisiere ich skalierbare Frontends — von wiederverwendbaren Komponenten und Libraries bis zu Microfrontend-Architekturen, die langfristig wartbar und im Alltag zuverlässig funktionieren.',
          },
          {
            title: 'Branchen & KI',
            text: 'Start-up, Fintech, Bank, Logistik, Automotive oder Behörde — und KI, wenn sie Produkte spürbar besser macht.',
          },
          {
            title: 'Design & UX',
            text: 'UI/UX-Design und Design Systeme sind für mich keine Randnotiz — von der Idee bis zu konsistenten, skalierbaren Komponenten.',
          },
          {
            title: 'Barrierefreiheit',
            text: 'Barrierefreiheit gehört für mich zum guten Handwerk — auch beim Aufbau von Komponenten: saubere Semantik, Tastaturbedienung und Screenreader von Anfang an, WCAG im Blick und praxisnahe Tests mit etablierten Tools.',
          },
        ],
      },
      work: {
        eyebrow: 'Arbeit',
        title: 'Ausgewählte Arbeit.',
        lead: 'Case Studies und Projekte folgen hier in Kürze.',
      },
      blog: {
        eyebrow: 'Blog',
        title: 'Notizen & Geschriebenes.',
        lead: 'Beiträge folgen hier in Kürze.',
      },
      contact: {
        eyebrow: 'Kontakt',
        title: 'Lass uns etwas\nbauen.',
        lead: 'Du hast ein Projekt, eine Freelance-Anfrage oder willst einfach Hallo sagen? Ich freue mich, von dir zu hören.',
        note: 'Antwort in der Regel innerhalb von 1–2 Werktagen.',
        emailLabel: 'E-Mail',
        phoneLabel: 'Telefon',
        locationLabel: 'Standort',
        socialLabel: 'Netzwerk',
        openMaps: 'In Maps öffnen',
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
      signs: { about: 'Sobre mí', work: 'Trabajo', blog: 'Blog', contact: 'Contacto' },
      boards: {
        bicycle: { lines: ['Soñar', 'Planear', 'Hacer'] },
        desk: { lines: ['Las ideas', 'se vuelven', 'magia.'] },
      },
      about: {
        eyebrow: 'Sobre mí',
        title: 'Hola, soy Waldemar.',
        intro: 'Soy desarrollador frontend con más de 25 años de experiencia creando interfaces claras, rápidas y agradables de usar.',
        stats: ['25+ años', 'Accesibilidad', 'Fintech', 'Design Systems'],
        blocks: [
          {
            title: 'Desarrollo Frontend',
            text: 'Con React, Angular y Vue.js desarrollo frontends escalables — desde componentes y librerías reutilizables hasta arquitecturas microfrontend, pensadas para un mantenimiento sostenible y un uso fiable en el día a día.',
          },
          {
            title: 'Sectores & IA',
            text: 'Startups, fintech, banca, logística, automoción y sector público — y IA generativa cuando mejora de verdad el producto.',
          },
          {
            title: 'Diseño & UX',
            text: 'El diseño UI/UX y los design systems son el centro de mi trabajo — desde la idea hasta componentes consistentes y escalables.',
          },
          {
            title: 'Accesibilidad',
            text: 'La accesibilidad forma parte de cómo desarrollo — también al construir componentes: marcado semántico, teclado y lectores de pantalla desde el inicio, WCAG como referencia y pruebas prácticas con herramientas consolidadas.',
          },
        ],
      },
      work: {
        eyebrow: 'Trabajo',
        title: 'Trabajo seleccionado.',
        lead: 'Los casos de estudio y proyectos aparecerán aquí pronto.',
      },
      blog: {
        eyebrow: 'Blog',
        title: 'Notas y escritos.',
        lead: 'Los artículos aparecerán aquí pronto.',
      },
      contact: {
        eyebrow: 'Contacto',
        title: 'Construyamos\nalgo.',
        lead: '¿Tienes un proyecto, una consulta freelance o solo quieres saludar? Me encantaría saber de ti.',
        note: 'Suelo responder en 1–2 días laborables.',
        emailLabel: 'Correo',
        phoneLabel: 'Teléfono',
        locationLabel: 'Ubicación',
        socialLabel: 'Encuéntrame en',
        openMaps: 'Abrir en Maps',
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
      signs: { about: 'À propos', work: 'Travail', blog: 'Blog', contact: 'Contact' },
      boards: {
        bicycle: { lines: ['Rêver', 'Planifier', 'Faire'] },
        desk: { lines: ['Les idées', 'deviennent', 'magie.'] },
      },
      about: {
        eyebrow: 'À propos',
        title: 'Bonjour, je suis Waldemar.',
        intro: 'Je suis développeur frontend avec plus de 25 ans d’expérience à créer des interfaces claires, rapides et agréables à utiliser.',
        stats: ['25+ ans', 'Accessibilité', 'Fintech', 'Design Systems'],
        blocks: [
          {
            title: 'Développement frontend',
            text: 'Avec React, Angular et Vue.js, je conçois des frontends évolutifs — des composants et bibliothèques réutilisables aux architectures microfrontend, pensés pour une maintenance durable et une utilisation fiable au quotidien.',
          },
          {
            title: 'Secteurs & IA',
            text: 'Start-up, fintech, banque, logistique, automobile ou secteur public — et l’IA générative quand elle améliore vraiment le produit.',
          },
          {
            title: 'Design & UX',
            text: 'Le design UI/UX et les design systems sont au cœur de mon travail — de l’idée aux composants cohérents et évolutifs.',
          },
          {
            title: 'Accessibilité',
            text: 'L’accessibilité fait partie de ma façon de développer — y compris pour les composants : balisage sémantique, clavier et lecteurs d’écran dès la conception, WCAG comme repère et tests concrets avec des outils éprouvés.',
          },
        ],
      },
      work: {
        eyebrow: 'Travail',
        title: 'Travail sélectionné.',
        lead: 'Études de cas et projets à venir bientôt ici.',
      },
      blog: {
        eyebrow: 'Blog',
        title: 'Notes & écrits.',
        lead: 'Les articles arriveront bientôt ici.',
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Créons\nquelque chose.',
        lead: 'Un projet, une mission freelance ou juste envie de dire bonjour ? J’aimerais avoir de tes nouvelles.',
        note: 'Réponse en général sous 1–2 jours ouvrés.',
        emailLabel: 'E-mail',
        phoneLabel: 'Téléphone',
        locationLabel: 'Adresse',
        socialLabel: 'Me trouver sur',
        openMaps: 'Ouvrir dans Maps',
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
