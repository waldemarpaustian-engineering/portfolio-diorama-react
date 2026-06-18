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
      signs: { about: 'About Me', work: 'Career', blog: 'Blog', contact: 'Contact' },
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
        eyebrow: 'Career',
        title: 'My Frontend Evolution.',
        lead: 'From early web projects through modular UI systems to design systems, platform architectures and AI-assisted development. Freelance since 2012.',
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
            text: 'Shift to modern frontend architectures and reactive UI concepts. Migration of legacy systems and building scalable component ecosystems.',
          },
          {
            title: '4. Product & Platform Engineering (2019–2022)',
            projects: '4 Projects',
            tagline: 'Building products from scratch',
            text: 'Development of new platforms and digital products in startup and enterprise settings. Focus on product architecture, modular systems and integration.',
          },
          {
            title: '5. Design Systems & Platform Scale (2021–Today)',
            projects: '6+ Large-scale frontend systems',
            tagline: 'Frontend ecosystems at scale',
            text: 'Building and scaling company-wide design systems, component libraries and platform architectures. Focus on consistency, accessibility and sustainable frontend strategies.',
          },
          {
            title: '6. AI-Augmented Development (2022–Today)',
            projects: '10+ AI-driven initiatives',
            tagline: 'Human + AI workflows',
            text: 'Early adoption of AI-assisted development and automated engineering workflows. Modern tools for code generation, analysis, refactoring and workflow optimization.',
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
      signs: { about: 'Über mich', work: 'Werdegang', blog: 'Blog', contact: 'Kontakt' },
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
        eyebrow: 'Werdegang',
        title: 'Meine Frontend-Evolution.',
        lead: 'Von den ersten Webprojekten über modulare UI-Systeme bis zu Design Systems, Plattformarchitekturen und KI-gestützter Entwicklung. Freiberufler seit 2012.',
        hint: 'Nach unten scrollen, um die Stationen zu entdecken — am Desktop seitlich scrollen →',
        ariaTrack: 'Werdegang-Kapitel',
        chapters: [
          {
            title: '1. Frühe Frontend-Entwicklung & Web-Handwerk (2000–2007)',
            projects: '4+ Projekte',
            tagline: 'Lernen durch Ausprobieren',
            text: 'Während meines Informatikstudiums sammelte ich praktische Erfahrung in Web-Agenturen und als Werkstudent in einem KI-Unternehmen. Dort entstanden meine ersten Frontends und interaktiven Webanwendungen.',
          },
          {
            title: '2. Frontend-Framework-Entwicklung (2007–2015)',
            projects: '15+ Projekte',
            tagline: 'Systeme, die Oberflächen automatisch erzeugen',
            text: 'Modellgetriebene Frontend-Systeme, Generatoren und UI-Frameworks für komplexe Unternehmensanwendungen. Selbstständig seit 2012. Schwerpunkt auf Automatisierung, Skalierung und strukturierte UI-Architektur.',
            note: '(Schwerpunkt: Banking im Enterprise-Umfeld.)',
          },
          {
            title: '3. Moderne Frontend-Architektur (2015–2019)',
            projects: '6+ Projekte',
            tagline: 'Vom Altbestand zu komponentenbasierten Architekturen',
            text: 'Umstieg auf moderne Frontend-Architekturen und reaktive UI-Konzepte. Migration bestehender Systeme und Aufbau skalierbarer Komponentenstrukturen.',
          },
          {
            title: '4. Produkt- & Plattformentwicklung (2019–2022)',
            projects: '4 Projekte',
            tagline: 'Produkte von Grund auf entwickeln',
            text: 'Entwicklung neuer Plattformen und digitaler Produkte in Startup- und Enterprise-Umfeldern. Schwerpunkt auf Produktarchitektur, modulare Systeme und Integration.',
          },
          {
            title: '5. Design Systems & Plattformen im großen Maßstab (2021–heute)',
            projects: '6+ große Frontend-Systeme',
            tagline: 'Skalierbare Frontend-Ökosysteme',
            text: 'Aufbau und Skalierung unternehmensweiter Design Systems, Komponentenbibliotheken und Plattformarchitekturen. Schwerpunkt auf Konsistenz, Barrierefreiheit und tragfähige Frontend-Strategien.',
          },
          {
            title: '6. KI-gestützte Entwicklung (2022–heute)',
            projects: '10+ KI-getriebene Initiativen',
            tagline: 'Mensch und KI im Team',
            text: 'Frühe Nutzung KI-gestützter Entwicklung und automatisierter Engineering-Prozesse. Moderne Werkzeuge für Code-Generierung, Analyse, Refactoring und Workflow-Optimierung.',
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
      signs: { about: 'Sobre mí', work: 'Trayectoria', blog: 'Blog', contact: 'Contacto' },
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
        eyebrow: 'Trayectoria',
        title: 'Mi evolución frontend.',
        lead: 'Desde los primeros proyectos web, pasando por sistemas UI modulares, hasta design systems, arquitecturas de plataforma y desarrollo asistido por IA. Freelance desde 2012.',
        hint: 'Desplázate hacia abajo para descubrir cada estación — en escritorio, desplázate lateralmente →',
        ariaTrack: 'Capítulos del trayecto profesional',
        chapters: [
          {
            title: '1. Primeras experiencias en frontend y desarrollo web (2000–2007)',
            projects: '4+ proyectos',
            tagline: 'Aprender haciendo',
            text: 'Durante la carrera de informática trabajé en agencias web y como estudiante en una empresa de IA. Allí nacieron mis primeros frontends y aplicaciones web interactivas.',
          },
          {
            title: '2. Ingeniería de frameworks frontend (2007–2015)',
            projects: '15+ proyectos',
            tagline: 'Sistemas que generan interfaces automáticamente',
            text: 'Sistemas frontend dirigidos por modelos, generadores y frameworks de UI para aplicaciones empresariales complejas. Freelance desde 2012. Enfoque en automatización, escalado y arquitectura de UI estructurada.',
            note: '(Ámbito: banca empresarial.)',
          },
          {
            title: '3. Arquitectura frontend moderna (2015–2019)',
            projects: '6+ proyectos',
            tagline: 'Del código legado a arquitecturas basadas en componentes',
            text: 'Transición a arquitecturas frontend modernas y conceptos de UI reactiva. Migración de sistemas existentes y creación de ecosistemas de componentes escalables.',
          },
          {
            title: '4. Desarrollo de producto y plataforma (2019–2022)',
            projects: '4 proyectos',
            tagline: 'Productos desde cero',
            text: 'Desarrollo de nuevas plataformas y productos digitales en startups y grandes empresas. Enfoque en arquitectura de producto, sistemas modulares e integración.',
          },
          {
            title: '5. Design systems y plataformas a escala (2021–hoy)',
            projects: '6+ sistemas frontend a gran escala',
            tagline: 'Ecosistemas frontend escalables',
            text: 'Creación y escalado de design systems corporativos, bibliotecas de componentes y arquitecturas de plataforma. Enfoque en consistencia, accesibilidad y estrategias frontend sostenibles.',
          },
          {
            title: '6. Desarrollo asistido por IA (2022–hoy)',
            projects: '10+ iniciativas impulsadas por IA',
            tagline: 'Personas e IA trabajando juntas',
            text: 'Adopción temprana del desarrollo asistido por IA y de procesos de ingeniería automatizados. Herramientas modernas para generación de código, análisis, refactorización y optimización de flujos de trabajo.',
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
      signs: { about: 'À propos', work: 'Parcours', blog: 'Blog', contact: 'Contact' },
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
        eyebrow: 'Parcours',
        title: 'Mon évolution frontend.',
        lead: 'Des premiers projets web aux systèmes UI modulaires, puis aux design systems, architectures de plateforme et développement assisté par l’IA. Freelance depuis 2012.',
        hint: 'Fais défiler vers le bas pour découvrir chaque station — sur ordinateur, fais défiler latéralement →',
        ariaTrack: 'Chapitres du parcours professionnel',
        chapters: [
          {
            title: '1. Premiers pas en frontend & développement web (2000–2007)',
            projects: '4+ projets',
            tagline: 'Apprendre en faisant',
            text: 'Pendant mes études d’informatique, j’ai travaillé en agences web et comme étudiant salarié dans une entreprise d’IA. C’est là que mes premiers frontends et applications web interactives ont vu le jour.',
          },
          {
            title: '2. Ingénierie de frameworks frontend (2007–2015)',
            projects: '15+ projets',
            tagline: 'Des systèmes qui génèrent les interfaces',
            text: 'Systèmes frontend pilotés par modèles, générateurs et frameworks UI pour des applications d’entreprise complexes. Freelance depuis 2012. Priorité à l’automatisation, la montée en charge et une architecture UI structurée.',
            note: '(Domaine : banque d’entreprise.)',
          },
          {
            title: '3. Architecture frontend moderne (2015–2019)',
            projects: '6+ projets',
            tagline: 'Du existant aux architectures orientées composants',
            text: 'Évolution vers des architectures frontend modernes et des concepts d’UI réactive. Migration de systèmes existants et création d’écosystèmes de composants évolutifs.',
          },
          {
            title: '4. Ingénierie produit & plateforme (2019–2022)',
            projects: '4 projets',
            tagline: 'Construire des produits à partir de zéro',
            text: 'Développement de nouvelles plateformes et produits numériques, en start-up comme en grande entreprise. Priorité à l’architecture produit, aux systèmes modulaires et à l’intégration.',
          },
          {
            title: '5. Design systems & plateformes à grande échelle (2021–aujourd’hui)',
            projects: '6+ systèmes frontend à grande échelle',
            tagline: 'Des écosystèmes frontend qui passent à l’échelle',
            text: 'Conception et montée en charge de design systems d’entreprise, bibliothèques de composants et architectures de plateforme. Priorité à la cohérence, l’accessibilité et des stratégies frontend durables.',
          },
          {
            title: '6. Développement assisté par l’IA (2022–aujourd’hui)',
            projects: '10+ initiatives pilotées par l’IA',
            tagline: 'Humain et IA, main dans la main',
            text: 'Adoption précoce du développement assisté par l’IA et de processus d’ingénierie automatisés. Outils modernes pour la génération de code, l’analyse, le refactoring et l’optimisation des workflows.',
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
