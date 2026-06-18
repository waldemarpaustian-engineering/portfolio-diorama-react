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
        intro: 'I’m a frontend developer with more than 25 years of experience building interfaces that feel clear, fast, and thoughtful. Freelance since 2012.',
        blocks: [
          {
            title: 'Frontend Development',
            text: 'I build scalable frontends — from reusable components and libraries to architectures designed for long-term maintainability and reliable everyday use.',
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
        lead: 'Six stations — from first frontends to AI-assisted development and design systems at scale. Freelance since 2012.',
        hint: 'Scroll down to explore each station — on desktop, scroll sideways →',
        ariaTrack: 'Career chapters',
        chapters: [
          {
            title: '1. Early Frontend & Web Craft (2000–2007)',
            projects: '4+ Projects',
            tagline: 'Learning by building',
            text: 'During my computer science studies I gained hands-on experience at web agencies and as a working student at an AI company. That’s where my first frontends and interactive web applications took shape.',
          },
          {
            title: '2. Frontend Framework Engineering (2007–2015)',
            projects: '15+ Projects',
            tagline: 'Building systems that generate interfaces',
            text: 'Model-driven frontend systems, generators and reusable UI frameworks for complex enterprise applications. Freelance since 2012. Focus on automation, scaling and structured UI architecture.',
            note: '(Focus: enterprise banking.)',
          },
          {
            title: '3. Modern Frontend Architecture (2015–2019)',
            projects: '6+ Projects',
            tagline: 'From legacy to component-driven systems',
            text: 'Shift to modern frontend architectures and reactive UI concepts. Migration of existing systems and building scalable component landscapes.',
          },
          {
            title: '4. Product & Platform Engineering (2019–2022)',
            projects: '4 Projects',
            tagline: 'Building products from zero',
            text: 'Development of new platforms and digital products in startup and enterprise environments. Focus on product architecture, modular systems and integration.',
          },
          {
            title: '5. Design Systems & Platform Scale (2021–Today)',
            projects: '6+ Large-scale frontend systems',
            tagline: 'Frontend ecosystems at scale',
            text: 'Building and scaling company-wide design systems, component libraries and platform architectures. Focus on consistency, accessibility and scalable frontend strategies.',
          },
          {
            title: '6. AI-Augmented Development (2022–Today)',
            projects: '10+ AI-driven initiatives',
            tagline: 'Human + AI workflows',
            text: 'Early adoption of AI-assisted development and automated engineering processes. Using modern tools for code generation, analysis, refactoring and workflow optimization.',
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
        intro: 'Ich bin Frontend-Entwickler — seit über 25 Jahren baue ich Weboberflächen, die klar, schnell und angenehm zu nutzen sind. Freiberufler seit 2012.',
        blocks: [
          {
            title: 'Frontend Entwicklung',
            text: 'Ich realisiere skalierbare Frontends — von wiederverwendbaren Komponenten und Libraries bis zu Architekturen, die langfristig wartbar und im Alltag zuverlässig funktionieren.',
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
        lead: 'Sechs Stationen — von den ersten Frontends bis zu KI-gestützter Entwicklung und Design Systems im großen Maßstab. Freiberufler seit 2012.',
        hint: 'Nach unten scrollen, um die Stationen zu entdecken — am Desktop seitlich →',
        ariaTrack: 'Werdegang-Kapitel',
        chapters: [
          {
            title: '1. Early Frontend & Web Craft (2000–2007)',
            projects: '4+ Projects',
            tagline: 'Learning by building',
            text: 'Während meines Informatikstudiums sammelte ich praktische Erfahrung in Web-Agenturen und als Werkstudent in einer KI-Firma. Dort entstanden meine ersten Frontends und interaktiven Web-Anwendungen.',
          },
          {
            title: '2. Frontend Framework Engineering (2007–2015)',
            projects: '15+ Projects',
            tagline: 'Building systems that generate interfaces',
            text: 'Modellgetriebene Frontend-Systeme, Generatoren und UI-Frameworks für komplexe Enterprise-Anwendungen. Freiberufler seit 2012. Fokus auf Automatisierung, Skalierung und strukturierten UI-Aufbau.',
            note: '(Schwerpunkt: Enterprise-Banking.)',
          },
          {
            title: '3. Modern Frontend Architecture (2015–2019)',
            projects: '6+ Projects',
            tagline: 'From legacy to component-driven systems',
            text: 'Wechsel in moderne Frontend-Architekturen mit reaktiven UI-Konzepten. Migration bestehender Systeme und Aufbau skalierbarer Komponentenlandschaften.',
          },
          {
            title: '4. Product & Platform Engineering (2019–2022)',
            projects: '4 Projects',
            tagline: 'Building products from zero',
            text: 'Entwicklung neuer Plattformen und digitaler Produkte im Startup- und Enterprise-Umfeld. Fokus auf Produktarchitektur, modulare Systeme und Integration.',
          },
          {
            title: '5. Design Systems & Platform Scale (2021–Today)',
            projects: '6+ Large-scale frontend systems',
            tagline: 'Frontend ecosystems at scale',
            text: 'Aufbau und Skalierung unternehmensweiter Design Systeme, Komponentenbibliotheken und Plattformarchitekturen. Fokus auf Konsistenz, Accessibility und skalierbare Frontend-Strategien.',
          },
          {
            title: '6. AI-Augmented Development (2022–Today)',
            projects: '10+ AI-driven initiatives',
            tagline: 'Human + AI workflows',
            text: 'Früher Einstieg in KI-gestützte Entwicklung und automatisierte Entwicklungsprozesse. Einsatz moderner Werkzeuge zur Codegenerierung, Analyse, Refactoring und Workflow-Optimierung.',
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
        intro: 'Soy desarrollador frontend con más de 25 años de experiencia creando interfaces claras, rápidas y agradables de usar. Freelance desde 2012.',
        blocks: [
          {
            title: 'Desarrollo Frontend',
            text: 'Desarrollo frontends escalables — desde componentes y librerías reutilizables hasta arquitecturas pensadas para un mantenimiento sostenible y un uso fiable en el día a día.',
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
        lead: 'Seis estaciones — desde los primeros frontends hasta desarrollo con IA y design systems a escala. Freelance desde 2012.',
        hint: 'Desplázate hacia abajo para descubrir cada estación — en escritorio, lateral →',
        ariaTrack: 'Capítulos de trayectoria',
        chapters: [
          {
            title: '1. Early Frontend & Web Craft (2000–2007)',
            projects: '4+ Projects',
            tagline: 'Learning by building',
            text: 'Durante mis estudios de informática adquirí experiencia práctica en agencias web y como estudiante en una empresa de IA. Allí surgieron mis primeros frontends y aplicaciones web interactivas.',
          },
          {
            title: '2. Frontend Framework Engineering (2007–2015)',
            projects: '15+ Projects',
            tagline: 'Building systems that generate interfaces',
            text: 'Sistemas frontend dirigidos por modelos, generadores y frameworks UI para aplicaciones enterprise complejas. Freelance desde 2012. Enfoque en automatización, escalado y arquitectura UI estructurada.',
            note: '(Foco: enterprise bancario.)',
          },
          {
            title: '3. Modern Frontend Architecture (2015–2019)',
            projects: '6+ Projects',
            tagline: 'From legacy to component-driven systems',
            text: 'Transición a arquitecturas frontend modernas y conceptos UI reactivos. Migración de sistemas existentes y construcción de paisajes de componentes escalables.',
          },
          {
            title: '4. Product & Platform Engineering (2019–2022)',
            projects: '4 Projects',
            tagline: 'Building products from zero',
            text: 'Desarrollo de nuevas plataformas y productos digitales en entornos startup y enterprise. Enfoque en arquitectura de producto, sistemas modulares e integración.',
          },
          {
            title: '5. Design Systems & Platform Scale (2021–Today)',
            projects: '6+ Large-scale frontend systems',
            tagline: 'Frontend ecosystems at scale',
            text: 'Construcción y escalado de design systems corporativos, bibliotecas de componentes y arquitecturas de plataforma. Enfoque en consistencia, accesibilidad y estrategias frontend escalables.',
          },
          {
            title: '6. AI-Augmented Development (2022–Today)',
            projects: '10+ AI-driven initiatives',
            tagline: 'Human + AI workflows',
            text: 'Adopción temprana del desarrollo asistido por IA y procesos de ingeniería automatizados. Uso de herramientas modernas para generación de código, análisis, refactoring y optimización de flujos.',
          },
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
        intro: 'Je suis développeur frontend avec plus de 25 ans d’expérience à créer des interfaces claires, rapides et agréables à utiliser. Freelance depuis 2012.',
        blocks: [
          {
            title: 'Développement frontend',
            text: 'Je conçois des frontends évolutifs — des composants et bibliothèques réutilisables aux architectures pensées pour une maintenance durable et une utilisation fiable au quotidien.',
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
        lead: 'Six stations — des premiers frontends au développement assisté par IA et aux design systems à grande échelle. Freelance depuis 2012.',
        hint: 'Fais défiler vers le bas pour découvrir chaque station — sur desktop, latéralement →',
        ariaTrack: 'Chapitres du parcours',
        chapters: [
          {
            title: '1. Early Frontend & Web Craft (2000–2007)',
            projects: '4+ Projects',
            tagline: 'Learning by building',
            text: 'Pendant mes études d’informatique, j’ai acquis de l’expérience pratique en agences web et en tant qu’étudiant salarié dans une entreprise d’IA. C’est là que mes premiers frontends et applications web interactives ont vu le jour.',
          },
          {
            title: '2. Frontend Framework Engineering (2007–2015)',
            projects: '15+ Projects',
            tagline: 'Building systems that generate interfaces',
            text: 'Systèmes frontend pilotés par modèles, générateurs et frameworks UI pour des applications enterprise complexes. Freelance depuis 2012. Accent sur l’automatisation, la montée en charge et l’architecture UI structurée.',
            note: '(Focus : enterprise bancaire.)',
          },
          {
            title: '3. Modern Frontend Architecture (2015–2019)',
            projects: '6+ Projects',
            tagline: 'From legacy to component-driven systems',
            text: 'Passage à des architectures frontend modernes et des concepts UI réactifs. Migration de systèmes existants et construction de paysages de composants évolutifs.',
          },
          {
            title: '4. Product & Platform Engineering (2019–2022)',
            projects: '4 Projects',
            tagline: 'Building products from zero',
            text: 'Développement de nouvelles plateformes et produits numériques en startup et en enterprise. Accent sur l’architecture produit, les systèmes modulaires et l’intégration.',
          },
          {
            title: '5. Design Systems & Platform Scale (2021–Today)',
            projects: '6+ Large-scale frontend systems',
            tagline: 'Frontend ecosystems at scale',
            text: 'Construction et montée en charge de design systems d’entreprise, de bibliothèques de composants et d’architectures de plateforme. Accent sur la cohérence, l’accessibilité et les stratégies frontend évolutives.',
          },
          {
            title: '6. AI-Augmented Development (2022–Today)',
            projects: '10+ AI-driven initiatives',
            tagline: 'Human + AI workflows',
            text: 'Adoption précoce du développement assisté par IA et de processus d’ingénierie automatisés. Utilisation d’outils modernes pour la génération de code, l’analyse, le refactoring et l’optimisation des workflows.',
          },
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
