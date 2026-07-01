import {
  Braces,
  Code2,
  Database,
  GitBranch,
  Globe2,
  Layers3,
  Palette,
  Server,
  Sparkles,
  Workflow,
} from "lucide-react";

export const contact = {
  email: "ngoualemariel1@gmail.com",
  phone: "06 27 35 97 08",
  phoneHref: "tel:+33627359708",
  linkedin: "https://www.linkedin.com/in/ariel-ngoualem/",
  github: "https://github.com/Neressoffi",
  location: "Toute la France",
  cvPath: "/cv.pdf",
};

export const profile = {
  name: "Ariel Ngoualem",
  role: "Développeur Full Stack",
  headline: "Recherche d'une alternance • dès que possible",
  location: contact.location,
  availability: "Alternance full stack • Disponible",
  image: "/profile.png",
  tagline:
    "Je conçois des sites WordPress et des applications Laravel, avec des interfaces React soignées, des API REST et des outils d'administration utiles pour les équipes et les clients.",
};

export const languages = [
  { name: "Français", level: "Langue maternelle" },
  { name: "Anglais", level: "Niveau B1" },
];

export const softSkills = [
  "Esprit d'analyse",
  "Communication",
  "Force de proposition",
  "Sens du collectif",
];

export const navItems = [
  { label: "À propos", href: "#about" },
  { label: "Technologies", href: "#stack" },
  { label: "Projets", href: "#projects" },
  { label: "Parcours", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const highlights = [
  "WordPress sur mesure : ACF, types de contenu personnalisés et intégration CMS",
  "Applications Laravel : API REST, tableaux de bord admin et fonctionnalités métier",
  "React + Laravel : maquettes Figma, Scrum et mise en production",
  "Déploiement, hébergement et collaboration avec designers et développeurs",
];

export const techStack = [
  { name: "WordPress", icon: Globe2, tone: "from-sky-400/30 to-blue-500/10" },
  { name: "Laravel", icon: Server, tone: "from-red-300/20 to-orange-500/10" },
  { name: "React.js", icon: Sparkles, tone: "from-cyan-300/30 to-blue-400/10" },
  { name: "PHP", icon: Code2, tone: "from-violet-300/30 to-indigo-500/10" },
  { name: "JavaScript", icon: Braces, tone: "from-yellow-300/20 to-amber-500/10" },
  { name: "Tailwind / SCSS", icon: Layers3, tone: "from-cyan-300/30 to-teal-500/10" },
  { name: "MySQL", icon: Database, tone: "from-emerald-300/30 to-green-500/10" },
  { name: "Figma", icon: Palette, tone: "from-pink-300/30 to-violet-500/10" },
  { name: "Git / GitHub", icon: GitBranch, tone: "from-orange-300/30 to-pink-500/10" },
  { name: "Agile / Scrum", icon: Workflow, tone: "from-slate-200/30 to-slate-500/10" },
];

export type Project = {
  title: string;
  category: string;
  client: string;
  description: string;
  steps: string[];
  tech: string[];
  demo?: string;
  /** Capture du site — ex. `/projects/sepm.jpg` dans `public/projects/` */
  image?: string;
  gradient: string;
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
      "Migrations et relations entre les tables",
      "Intégration maquette : en-tête, corps, pied de page, menus et sections dynamiques",
      "Pages institutionnelles : actualités, champs d'actions, publications, statistiques",
      "Espace membre sécurisé avec authentification et gestion des accès",
      "Gestion complète des adhérents, publications et contenus administrables",
      "Interface d'administration simplifiée pour les administrateurs",
      "Version mobile, tablette et ordinateur adaptative",
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
      "Site vitrine pour l'entreprise générale de bâtiment ANB : présentation des services (industriel & particulier), demandes de devis, partenaires et contact. Design adaptatif avec gestion de contenu simplifiée pour le client.",
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
      "Site vitrine pour Facitec, entreprise d'électricité en région parisienne : prestations, activité et pages de présentation. Interface adaptative et administration simple pour les mises à jour client.",
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
      "Site vitrine avec boutique en ligne pour Pixlab (réparation d'écrans LED professionnels & matériel DJ) : services SAV, catalogue de pièces détachées, demandes de devis et gestion produits.",
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
      "Site institutionnel pour la Fédération des centres sociaux de France : actualités, ressources et repères historiques du réseau. Interface adaptative avec frise chronologique interactive.",
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
    "Alternance chez Illisite, stages chez Amazon, CCESI et DEKRA, formation Bachelor CDA (Cloud Campus).",
};

export const experiences: Experience[] = [
  {
    period: "Juin 2025 – Juin 2026",
    duration: "1 an",
    company: "Illisite",
    location: "Paris, France",
    title: "Développeur Web",
    type: "alternance",
    stack: ["WordPress", "Laravel", "PHP", "ACF", "MySQL"],
    description:
      "Conception et développement de sites WordPress en PHP et d'applications web avec Laravel. Personnalisation CMS (ACF, CPT), API REST, tableaux de bord d'administration, collaboration avec designers et déploiement en production.",
  },
  {
    period: "Juillet – Août 2024",
    duration: "2 mois",
    company: "Amazon",
    location: "Paris, France",
    title: "Développeur Full Stack",
    type: "stage",
    stack: ["React", "Laravel", "Figma", "Scrum", "MySQL"],
    description:
      "Plateforme web type Airbnb avec React.js et Laravel : tableaux de bord admin et utilisateur (comptes, annonces, réservations), maquettes Figma, méthode Scrum et participation au déploiement en production.",
  },
  {
    period: "Août – Sept. 2024",
    duration: "2 mois",
    company: "CCESI Agence de Nantes",
    location: "Paris, France",
    title: "Développeur Web",
    type: "stage",
    stack: ["PHP", "JavaScript", "Bootstrap", "WooCommerce", "MySQL", "PHPUnit"],
    description:
      "Mise en place d'un site de réservation de salles de fêtes : analyse du cahier des charges, modélisation MERISE et développement orienté réservation et paiement.",
    points: [
      "Référencement SEO et intégration WooCommerce (paiement / réservation)",
      "Interface adaptative Bootstrap et fonctionnalités interactives JavaScript",
      "Back-end PHP, sessions, formulaires et base MySQL",
      "Tests unitaires PHPUnit, documentation et méthode Scrum",
    ],
  },
  {
    period: "Mai – Nov. 2023",
    duration: "7 mois",
    company: "DEKRA France",
    location: "Paris · Sur site",
    title: "Intégrateur Webmaster",
    type: "stage",
    stack: ["HTML/CSS", "JavaScript", "CMS", "SEO"],
    description:
      "Développement et maintenance du site web DEKRA : modernisation de l'existant, amélioration de l'expérience utilisateur et suivi des performances.",
    points: [
      "Intégration de nouvelles fonctionnalités et refonte de pages clés",
      "Suivi des performances et propositions d'amélioration",
      "Collaboration avec les équipes internes pour maintenance et support",
    ],
  },
  {
    period: "2025 – 2027",
    duration: "Bachelor",
    company: "Cloud Campus",
    location: "Paris, France",
    title: "Concepteur Développeur d'Applications",
    type: "formation",
    stack: ["Architecture", "Applications web", "Projets web"],
    description:
      "Formation en développement d'applications web et logicielles : architecture, projets full stack et bonnes pratiques de développement.",
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
  { label: "Projets", value: "7", detail: "WordPress & Laravel (Illisite)" },
  { label: "Expériences", value: "4", detail: "Illisite · Amazon · CCESI · DEKRA" },
  { label: "Objectif", value: "Dès que possible", detail: "Alternance full stack" },
];
