import {
  Braces,
  Code2,
  Database,
  GitBranch,
  Globe2,
  Layers3,
  Palette,
  Server,
  Smartphone,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react";

export const contact = {
  email: "ngoualemariel1@gmail.com",
  phone: "06 27 35 97 08",
  phoneHref: "tel:+33627359708",
  linkedin: "https://www.linkedin.com/in/ariel-ngoualem/",
  github: "https://github.com/Neressoffi",
  location: "Toute la France",
  cvPath: "/cv.png",
  portfolioUrl: "https://porte-folio-sigma.vercel.app/",
};

export const profile = {
  name: "Ariel Ngoualem",
  role: "Développeur Fullstack",
  headline: "Recherche d'une alternance — Développeur Fullstack | ASAP",
  location: contact.location,
  availability: "Alternance fullstack • Disponible immédiatement",
  image: "/profile.png",
  tagline:
    "Étudiant en Bachelor Concepteur Développeur d'Applications (Cloud Campus, Paris 2025–2027), spécialisé en développement Full-Stack. Je recherche une alternance pour mettre en pratique WordPress, Laravel, PHP et React.js, fort de mes expériences chez Illisite et Amazon.",
};

export const languages = [
  { name: "Français", level: "Langue maternelle" },
  { name: "Anglais", level: "Niveau B1" },
];

export const softSkills = [
  "Agile Scrum",
  "Travail collaboratif",
  "Esprit d'analyse",
  "Force de proposition",
];

export const navItems = [
  { label: "À propos", href: "#about" },
  { label: "Technologies", href: "#stack" },
  { label: "Projets", href: "#projects" },
  { label: "Parcours", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const highlights = [
  "WordPress sur mesure : PHP, CPT, ACF et gestion de contenu autonome",
  "Laravel : API REST, règles métier, MySQL et interfaces d'administration",
  "React.js & React Native : interfaces, état et intégration API",
  "Notifications (e-mail, SMS, push), Git/GitHub et déploiement en production",
];

export const techStack = [
  { name: "WordPress", icon: Globe2, tone: "from-sky-400/30 to-blue-500/10" },
  { name: "Laravel", icon: Server, tone: "from-red-300/20 to-orange-500/10" },
  { name: "React.js", icon: Sparkles, tone: "from-cyan-300/30 to-blue-400/10" },
  { name: "React Native", icon: Smartphone, tone: "from-blue-300/30 to-indigo-500/10" },
  { name: "PHP", icon: Code2, tone: "from-violet-300/30 to-indigo-500/10" },
  { name: "Node.js", icon: Terminal, tone: "from-green-300/25 to-emerald-500/10" },
  { name: "JavaScript", icon: Braces, tone: "from-yellow-300/20 to-amber-500/10" },
  { name: "HTML5 / CSS3 / SCSS", icon: Layers3, tone: "from-cyan-300/30 to-teal-500/10" },
  { name: "Tailwind", icon: Layers3, tone: "from-teal-300/30 to-cyan-500/10" },
  { name: "MySQL / SQL", icon: Database, tone: "from-emerald-300/30 to-green-500/10" },
  { name: "Figma / Photoshop", icon: Palette, tone: "from-pink-300/30 to-violet-500/10" },
  { name: "Git / GitHub / GitLab", icon: GitBranch, tone: "from-orange-300/30 to-pink-500/10" },
  { name: "Postman / Jira", icon: Workflow, tone: "from-slate-200/30 to-slate-500/10" },
  { name: "Agile / Scrum", icon: Workflow, tone: "from-amber-200/25 to-orange-500/10" },
];

export type Project = {
  title: string;
  category: string;
  client: string;
  description: string;
  steps: string[];
  tech: string[];
  demo?: string;
  image?: string;
  gradient: string;
  github?: string;
};

export type SideProject = {
  title: string;
  category: string;
  description: string;
  tech: string[];
  demo?: string;
  github?: string;
};

export const projects: Project[] = [
  {
    title: "APVF",
    category: "Site institutionnel",
    client: "Illisite",
    description:
      "Site pour l'Association des Petites Villes de France : actualités, événements, adhésions et valorisation des services aux collectivités. Gestion dynamique des contenus avec types de contenu personnalisés.",
    steps: [
      "Découpage maquette en composants (en-tête, corps, pied de page)",
      "Champs personnalisés ACF",
      "Types de contenu personnalisés (CPT)",
      "Version mobile adaptative",
    ],
    tech: ["WordPress", "ACF", "CPT", "PHP"],
    demo: "https://www.apvf.asso.fr",
    image: "/projects/apvf.png",
    gradient: "from-blue-500/30 via-cyan-300/15 to-transparent",
  },
  {
    title: "AIIRF",
    category: "Site institutionnel • Recette",
    client: "Illisite",
    description:
      "Site en version développement/recette pour l'Alliance de l'Industrie et de l'Ingénierie des Réseaux Ferroviaires : filière ferroviaire, groupes de travail, actualités, événements et adhésion.",
    steps: [
      "Découpage maquette en composants (en-tête, corps, pied de page)",
      "Champs personnalisés ACF",
      "Types de contenu personnalisés (CPT)",
      "Version mobile adaptative",
    ],
    tech: ["WordPress", "ACF", "CPT", "PHP"],
    demo: "https://www.aiirf.fr",
    image: "/projects/aiirf.png",
    gradient: "from-slate-300/20 via-blue-400/15 to-transparent",
  },
  {
    title: "SEPM",
    category: "Institutionnel + Espace adhérent",
    client: "Illisite • Laravel",
    description:
      "Site institutionnel et espace de gestion adhérent pour le SEPM (Syndicat des Éditeurs de la Presse Magazine) : adhérents, publications, actualités, statistiques, espace membre et outils d'administration simplifiés.",
    steps: [
      "Analyse des besoins et définition des fonctionnalités (site + espace adhérent)",
      "Modélisation BDD (MCD/MLD) : adhérents, sociétés, publications, actualités, stats",
      "Configuration Laravel : routes, contrôleurs, migrations, modèles Eloquent",
      "Espace membre sécurisé avec authentification et gestion des accès",
      "Interface d'administration simplifiée pour les administrateurs",
      "Tests, corrections, optimisations et mise en recette",
    ],
    tech: ["Laravel", "PHP", "MySQL", "Eloquent", "Blade", "Auth"],
    demo: "https://sepmcrm.illisite.info",
    image: "/projects/sepm.png",
    gradient: "from-indigo-500/30 via-violet-300/15 to-transparent",
  },
  {
    title: "ANB",
    category: "Site vitrine • Bâtiment",
    client: "Illisite",
    description:
      "Site vitrine pour l'entreprise générale de bâtiment ANB : présentation des services (industriel & particulier), demandes de devis, partenaires et contact.",
    steps: [
      "Découpage maquette en composants (en-tête, corps, pied de page)",
      "Champs personnalisés ACF",
      "Version mobile adaptative",
    ],
    tech: ["WordPress", "ACF", "PHP", "Adaptatif"],
    demo: "https://anb.illisite.info",
    image: "/projects/anb.png",
    gradient: "from-amber-500/30 via-orange-300/15 to-transparent",
  },
  {
    title: "Facitec",
    category: "Site vitrine • Électricité",
    client: "Illisite",
    description:
      "Site vitrine pour Facitec, entreprise d'électricité en région parisienne : prestations, activité et pages de présentation.",
    steps: [
      "Découpage maquette en composants (en-tête, corps, pied de page)",
      "Champs personnalisés ACF",
      "Version mobile adaptative",
    ],
    tech: ["WordPress", "ACF", "PHP", "Adaptatif"],
    demo: "https://facitec.illisite.info",
    image: "/projects/facitec.png",
    gradient: "from-yellow-400/25 via-amber-300/15 to-transparent",
  },
  {
    title: "Pixlab",
    category: "Vitrine + E-commerce",
    client: "Illisite",
    description:
      "Site vitrine avec boutique en ligne pour Pixlab (réparation d'écrans LED professionnels & matériel DJ) : services SAV, catalogue de pièces détachées et demandes de devis.",
    steps: [
      "Découpage maquette en composants (en-tête, corps, pied de page)",
      "Champs personnalisés ACF",
      "Version mobile adaptative",
    ],
    tech: ["WordPress", "ACF", "WooCommerce", "Adaptatif"],
    demo: "https://pixlab.illisite.info",
    image: "/projects/pixlab.png",
    gradient: "from-fuchsia-500/30 via-violet-300/15 to-transparent",
  },
  {
    title: "Mémoires Vives",
    category: "Site institutionnel",
    client: "Illisite",
    description:
      "Site institutionnel pour la Fédération des centres sociaux de France : actualités, ressources et repères historiques du réseau, avec frise chronologique interactive.",
    steps: [
      "Découpage maquette en composants (en-tête, corps, pied de page)",
      "Champs personnalisés ACF",
      "Frise chronologique interactive",
      "Version mobile adaptative",
    ],
    tech: ["WordPress", "ACF", "JavaScript", "Adaptatif"],
    demo: "https://memoirevive.illisite.info",
    image: "/projects/memoires-vives.png",
    gradient: "from-emerald-400/25 via-teal-300/15 to-transparent",
  },
];

export const personalProjects: SideProject[] = [
  {
    title: "Portfolio",
    category: "Projet personnel",
    description:
      "Portfolio développé avec React.js, hébergé sur Vercel, avec animations CSS et présentation de mes réalisations professionnelles.",
    tech: ["React.js", "Vercel", "CSS", "Animations"],
    demo: contact.portfolioUrl,
    github: contact.github,
  },
  {
    title: "Assistant IA personnel",
    category: "Projet personnel",
    description:
      "IA conversationnelle avec interface HUD, chat vocal et lancement automatisé (.bat). Développé en Python, JavaScript et HTML/CSS.",
    tech: ["Python", "JavaScript", "HTML/CSS", "IA conversationnelle"],
    demo: "https://myia-wtu7.onrender.com",
    github: contact.github,
  },
];

export const schoolProjects: SideProject[] = [
  {
    title: "Quiz interactif",
    category: "Projet école",
    description: "Application de quiz interactif en JavaScript.",
    tech: ["JavaScript"],
    github: contact.github,
  },
  {
    title: "Mini moteur de recherche",
    category: "Projet école",
    description: "Moteur de recherche front-end en HTML, CSS et JavaScript.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    github: contact.github,
  },
  {
    title: "Dashboard",
    category: "Projet école",
    description: "Tableau de bord conçu avec React et maquettes Figma.",
    tech: ["React.js", "Figma"],
    github: contact.github,
  },
  {
    title: "Voyages",
    category: "Projet école",
    description: "Application React avec gestion d'état Redux.",
    tech: ["React.js", "Redux"],
    github: contact.github,
  },
  {
    title: "About-the-universe",
    category: "Projet école",
    description: "Projet React avec Vite sur le thème de l'univers.",
    tech: ["React.js", "Vite"],
    github: contact.github,
  },
  {
    title: "Country",
    category: "Projet école",
    description: "Application React avec Redux pour explorer des pays.",
    tech: ["React.js", "Redux"],
    github: contact.github,
  },
  {
    title: "TP Dashboard",
    category: "Projet école",
    description: "Travaux pratiques — tableau de bord en React.",
    tech: ["React.js"],
    github: contact.github,
  },
];

export type ExperienceType = "alternance" | "stage" | "formation";

export type Experience = {
  period: string;
  duration?: string;
  company: string;
  location: string;
  title: string;
  description: string;
  type: ExperienceType;
  stack?: string[];
  points?: string[];
};

export const careerSummary = {
  headline:
    "Alternance Illisite, stage Amazon, Bachelor CDA Cloud Campus — WordPress, Laravel, React.",
};

export const experiences: Experience[] = [
  {
    period: "Juin 2025 – Juin 2026",
    duration: "1 an",
    company: "Illisite",
    location: "Paris, France",
    title: "Développeur Web",
    type: "alternance",
    stack: [
      "WordPress",
      "ACF",
      "PHP",
      "Laravel",
      "API REST",
      "MySQL",
      "Git",
      "GitHub",
    ],
    description:
      "Conception et développement de solutions web sur mesure (WordPress et Laravel) en collaboration avec l'équipe technique pour répondre aux besoins métiers des clients.",
    points: [
      "Sites WordPress en PHP, CPT et ACF pour une gestion de contenu autonome",
      "API REST Laravel (authentification, règles métier, MySQL) et interfaces d'administration",
      "Système de notifications (e-mail, SMS, push) pour automatiser les communications",
      "Versioning et déploiement avec Git et GitHub",
      "Participation au déploiement et au suivi en production",
    ],
  },
  {
    period: "Mai 2024 – Août 2024",
    duration: "4 mois",
    company: "Amazon",
    location: "Paris, France",
    title: "Développeur Full-Stack",
    type: "stage",
    stack: ["React.js", "Laravel", "PHP", "API REST", "MySQL", "Figma", "Scrum"],
    description:
      "Conception d'une plateforme web type Airbnb (frontend React.js / backend Laravel).",
    points: [
      "Frontend React.js (composants, gestion d'état) et backend Laravel (API REST, JWT, CRUD)",
      "Tableau de bord admin et utilisateur : comptes, annonces, réservations",
      "Méthode Scrum (sprints, stand-ups) et participation au lancement de l'application",
      "Maquettes UI/UX Figma et intégration des interfaces en équipe",
    ],
  },
  {
    period: "2025 – 2027",
    duration: "Bachelor",
    company: "Cloud Campus",
    location: "Paris, France",
    title: "Concepteur Développeur d'Applications",
    type: "formation",
    stack: ["Architecture", "Applications web", "Full-Stack"],
    description:
      "Formation Bachelor Concepteur Développeur d'Applications — développement d'applications web et logicielles, architecture et bonnes pratiques.",
  },
];

export const experienceTypeLabels: Record<
  ExperienceType,
  { label: string; short: string }
> = {
  alternance: { label: "Alternance", short: "Alternance" },
  stage: { label: "Stage", short: "Stage" },
  formation: { label: "Formation", short: "Formation" },
};

export const stats = [
  { label: "Projets", value: "7+", detail: "WordPress & Laravel (Illisite)" },
  { label: "Expériences", value: "2", detail: "Illisite · Amazon" },
  { label: "Objectif", value: "ASAP", detail: "Alternance fullstack" },
];
