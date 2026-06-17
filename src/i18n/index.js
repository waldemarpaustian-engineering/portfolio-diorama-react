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
        workLink: 'My path →',
      },
      work: {
        eyebrow: 'Work',
        title: 'A paper trail.',
        lead: 'Eight chapters — from first websites to microfrontends and accessibility. Case studies will follow here later.',
        hint: 'Scroll to explore each station →',
        ariaTrack: 'Career chapters',
        chapters: [
          {
            title: 'First steps — web & studies',
            text: 'Computer science in Mannheim, internships, CMS and databases. PHP, Java, first interfaces — where the craft began.',
          },
          {
            title: 'Banking & enterprise Java',
            text: 'Payment platforms, rating systems, model-driven architecture. Complex regulated environments, teams, long release cycles.',
          },
          {
            title: 'Switching frameworks — JSF to Angular',
            text: 'Migrating legacy apps to modern frontends — Angular 2, GWT editors, rebuilding sales platforms from the ground up.',
          },
          {
            title: 'Chatbot & cloud',
            text: 'Solo frontend for a conversational app with charts and live handoff. Then a greenfield ETL tool in AWS with Angular and D3.',
          },
          {
            title: 'Startup — from zero to product',
            text: 'First developer and architect in a startup — no-code form platform, React, GraphQL, design system with Storybook, scaling the team.',
          },
          {
            title: 'Rail & Vue',
            text: 'Passenger sales system — Vue.js 3, AWS, performant components in an agile environment.',
          },
          {
            title: 'Design systems & public sector',
            text: 'Robo-advisory and public administration — Angular across versions, company-wide design system, Flutter apps, mentoring.',
          },
          {
            title: 'A11y, microfrontends & AI from 2023',
            text: 'Hub app and microfrontend platform, Figma tokens, accessibility as a dedicated role — and AI-assisted development in everyday work since 2023.',
          },
        ],
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
        workLink: 'Mein Werdegang →',
      },
      work: {
        eyebrow: 'Arbeit',
        title: 'Eine Papier-Reise.',
        lead: 'Acht Kapitel — von den ersten Webseiten bis zu Microfrontends und Barrierefreiheit. Case Studies folgen hier später.',
        hint: 'Scrollen, um die Stationen zu entdecken →',
        ariaTrack: 'Werdegang-Kapitel',
        chapters: [
          {
            title: 'Erste Schritte — Web & Studium',
            text: 'Informatikstudium in Mannheim mit Abschluss als Diplom-Informatiker, dazu Praktika sowie Arbeit mit CMS und Datenbanken. PHP, Java, erste Oberflächen — hier hat das Handwerk begonnen.',
          },
          {
            title: 'Banken & Enterprise Java',
            text: 'Zahlungsverkehr, Rating-Plattformen, modellgetriebene Architektur. Komplexe regulierte Systeme, Teams, lange Release-Zyklen.',
          },
          {
            title: 'Frameworks wechseln — JSF zu Angular',
            text: 'Migration alter Anwendungen auf moderne Frontends — Angular 2, GWT-Editoren, Vertriebsplattformen neu gedacht.',
          },
          {
            title: 'Chatbot & Cloud',
            text: 'Alleine Frontend für eine Conversational App mit Charts und Live-Übergabe. Danach ein ETL-Tool in der AWS-Cloud — Greenfield mit Angular und D3.',
          },
          {
            title: 'Startup — von null auf Produkt',
            text: 'Erstentwickler und Architekt in einem Startup — No-Code-Formularplattform, React, GraphQL, Design System mit Storybook, Team skalieren.',
          },
          {
            title: 'Bahn & Vue',
            text: 'Vertriebssystem Personenverkehr — Vue.js 3, AWS, performante Komponenten im agilen Umfeld.',
          },
          {
            title: 'Design Systems & öffentlicher Sektor',
            text: 'Robo-Advisory und öffentliche Verwaltung — Angular über viele Versionen, unternehmensweites Design System, Flutter-Apps, Mentoring.',
          },
          {
            title: 'A11y, Microfrontends & KI ab 2023',
            text: 'Hub-App und Microfrontend-Plattform, Figma Tokens, Barrierefreiheit als feste Rolle — und KI-gestützte Entwicklung im Alltag seit 2023.',
          },
        ],
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
        workLink: 'Mi trayectoria →',
      },
      work: {
        eyebrow: 'Trabajo',
        title: 'Un camino de papel.',
        lead: 'Ocho capítulos — desde las primeras webs hasta microfrontends y accesibilidad. Los casos de estudio llegarán después.',
        hint: 'Desplázate para descubrir cada estación →',
        ariaTrack: 'Capítulos de trayectoria',
        chapters: [
          { title: 'Primeros pasos — web y estudios', text: 'Informática en Mannheim, prácticas, CMS y bases de datos. PHP, Java, primeras interfaces — aquí empezó el oficio.' },
          { title: 'Banca y Java enterprise', text: 'Plataformas de pagos, rating, arquitectura dirigida por modelos. Entornos regulados, equipos, ciclos largos.' },
          { title: 'Cambio de frameworks — JSF a Angular', text: 'Migración legacy a frontends modernos — Angular 2, editores GWT, plataformas de ventas rehechas.' },
          { title: 'Chatbot y nube', text: 'Frontend en solitario para app conversacional con gráficos. Después, ETL en AWS con Angular y D3.' },
          { title: 'Startup — de cero a producto', text: 'Primer desarrollador y arquitecto — plataforma de formularios, React, GraphQL, design system con Storybook.' },
          { title: 'Ferrocarril y Vue', text: 'Ventas de transporte de pasajeros — Vue.js 3, AWS, componentes performantes.' },
          { title: 'Design systems y sector público', text: 'Robo-advisory y administración pública — Angular, design system corporativo, Flutter, mentoring.' },
          { title: 'A11y, microfrontends e IA desde 2023', text: 'Hub app, microfrontends, tokens Figma, accesibilidad dedicada — IA en el desarrollo desde 2023.' },
        ],
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
        workLink: 'Mon parcours →',
      },
      work: {
        eyebrow: 'Travail',
        title: 'Un voyage en papier.',
        lead: 'Huit chapitres — des premiers sites aux microfrontends et à l’accessibilité. Les études de cas suivront ici.',
        hint: 'Fais défiler pour découvrir chaque station →',
        ariaTrack: 'Chapitres du parcours',
        chapters: [
          { title: 'Premiers pas — web et études', text: 'Informatique à Mannheim, stages, CMS et bases de données. PHP, Java, premières interfaces — le métier commence ici.' },
          { title: 'Banque et Java enterprise', text: 'Paiements, notation, architecture pilotée par modèles. Environnements régulés, équipes, cycles longs.' },
          { title: 'Changement de frameworks — JSF vers Angular', text: 'Migration legacy vers frontends modernes — Angular 2, éditeurs GWT, plateformes commerciales repensées.' },
          { title: 'Chatbot et cloud', text: 'Frontend solo pour app conversationnelle avec graphiques. Puis ETL sur AWS avec Angular et D3.' },
          { title: 'Startup — de zéro au produit', text: 'Premier développeur et architecte — plateforme de formulaires, React, GraphQL, design system avec Storybook.' },
          { title: 'Rail et Vue', text: 'Vente transport voyageurs — Vue.js 3, AWS, composants performants.' },
          { title: 'Design systems et secteur public', text: 'Robo-advisory et administration publique — Angular, design system d’entreprise, Flutter, mentoring.' },
          { title: 'A11y, microfrontends et IA depuis 2023', text: 'Hub app, microfrontends, tokens Figma, accessibilité dédiée — IA au quotidien depuis 2023.' },
        ],
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
