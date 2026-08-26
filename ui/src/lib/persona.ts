import type { Localized } from "@/lib/i18n"

export const persona = {
  name: "Alex Moreau",
  initials: "AM",
  role: {
    en: "Full-Stack Developer",
    fr: "Développeur Full-Stack",
  } satisfies Localized,
  tagline: {
    en: "Computer Science graduate building reliable web applications with Java & React.",
    fr: "Diplômé en informatique, je conçois des applications web fiables avec Java et React.",
  } satisfies Localized,
  location: { en: "Lyon, France", fr: "Lyon, France" } satisfies Localized,
  email: "alex.moreau.dev@example.com",
  github: "https://github.com/alexmoreau-dev",
  linkedin: "https://www.linkedin.com/in/alexmoreau-dev",
}

export type Project = {
  title: string
  icon: "webhook" | "calendar" | "book" | "cloud"
  gradient: string
  description: Localized
  stack: string[]
  repoUrl?: string
  demoUrl?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    title: "Portfolio Sync",
    icon: "webhook",
    gradient:
      "from-emerald-500/20 via-teal-500/10 to-transparent dark:from-emerald-400/15 dark:via-teal-400/5",
    description: {
      en: "Self-updating portfolio. GitHub webhooks trigger a Spring Boot API that syncs project manifests into PostgreSQL, rendered by a React UI.",
      fr: "Portfolio auto-synchronisé. Des webhooks GitHub déclenchent une API Spring Boot qui synchronise les projets dans PostgreSQL, affichés par une interface React.",
    },
    stack: ["Java 21", "Spring Boot", "PostgreSQL", "React", "Webhooks"],
    repoUrl: "https://github.com/alexmoreau-dev/portfolio-sync",
    featured: true,
  },
  {
    title: "CampusFlow",
    icon: "calendar",
    gradient:
      "from-sky-500/20 via-indigo-500/10 to-transparent dark:from-sky-400/15 dark:via-indigo-400/5",
    description: {
      en: "Room and equipment booking platform for a university campus, with conflict detection and role-based access.",
      fr: "Plateforme de réservation de salles et de matériel pour un campus universitaire, avec détection de conflits et gestion des rôles.",
    },
    stack: ["Spring Boot", "React", "TypeScript", "PostgreSQL", "Docker"],
    repoUrl: "https://github.com/alexmoreau-dev/campusflow",
    demoUrl: "https://campusflow.example.com",
    featured: true,
  },
  {
    title: "LibriTrack",
    icon: "book",
    gradient:
      "from-amber-500/20 via-orange-500/10 to-transparent dark:from-amber-400/15 dark:via-orange-400/5",
    description: {
      en: "Library management system: catalog, loans, late-return notifications and an admin dashboard with usage statistics.",
      fr: "Système de gestion de bibliothèque : catalogue, prêts, relances automatiques et tableau de bord administrateur avec statistiques.",
    },
    stack: ["Java", "Spring Security", "Thymeleaf", "PostgreSQL"],
    repoUrl: "https://github.com/alexmoreau-dev/libritrack",
  },
  {
    title: "MeteoLens",
    icon: "cloud",
    gradient:
      "from-violet-500/20 via-fuchsia-500/10 to-transparent dark:from-violet-400/15 dark:via-fuchsia-400/5",
    description: {
      en: "Weather dashboard consuming Open-Meteo, with saved locations, hourly forecasts and offline caching.",
      fr: "Tableau de bord météo utilisant Open-Meteo, avec lieux favoris, prévisions horaires et cache hors ligne.",
    },
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    repoUrl: "https://github.com/alexmoreau-dev/meteolens",
    demoUrl: "https://meteolens.example.com",
  },
]

export type SkillGroup = {
  label: Localized
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    label: { en: "Languages", fr: "Langages" },
    items: ["Java", "TypeScript", "SQL", "Python", "HTML / CSS"],
  },
  {
    label: { en: "Backend", fr: "Back-end" },
    items: ["Spring Boot", "Spring Security", "REST APIs", "JUnit 5", "Flyway"],
  },
  {
    label: { en: "Frontend", fr: "Front-end" },
    items: ["React", "Vite", "Tailwind CSS", "shadcn/ui", "React Query"],
  },
  {
    label: { en: "Data & Tools", fr: "Données & Outils" },
    items: ["PostgreSQL", "Redis", "Docker", "Git & GitHub", "Linux"],
  },
]

export type ExperienceItem = {
  role: Localized
  company: string
  period: string
  summary: Localized
  highlights: Array<Localized>
  stack: string[]
}

export const experience: ExperienceItem[] = [
  {
    role: {
      en: "Software Engineering Intern",
      fr: "Stagiaire ingénierie logicielle",
    },
    company: "Nexvia Solutions · Lyon",
    period: "2026",
    summary: {
      en: "Six-month end-of-degree internship on the internal logistics platform.",
      fr: "Stage de fin de licence de six mois sur la plateforme logistique interne.",
    },
    highlights: [
      {
        en: "Built 12 REST endpoints in Spring Boot for the order-tracking module.",
        fr: "Développé 12 points d'API REST en Spring Boot pour le module de suivi des commandes.",
      },
      {
        en: "Raised backend test coverage from 34% to 78% with JUnit and Testcontainers.",
        fr: "Porté la couverture de tests back-end de 34 % à 78 % avec JUnit et Testcontainers.",
      },
      {
        en: "Shipped a React admin view used daily by the operations team.",
        fr: "Livré une interface d'administration React utilisée quotidiennement par l'équipe opérations.",
      },
    ],
    stack: ["Java 21", "Spring Boot", "React", "PostgreSQL"],
  },
  {
    role: {
      en: "Teaching Assistant — Algorithms",
      fr: "Assistant pédagogique — Algorithmique",
    },
    company: "Université Claude Bernard Lyon 1",
    period: "2024 – 2026",
    summary: {
      en: "Tutored first-year students in algorithms and Java labs.",
      fr: "Accompagnement d'étudiants de première année en algorithmique et TP Java.",
    },
    highlights: [
      {
        en: "Led weekly lab sessions for groups of 25+ students.",
        fr: "Animé des séances de TP hebdomadaires pour des groupes de plus de 25 étudiants.",
      },
      {
        en: "Authored graded exercises now reused in the standard curriculum.",
        fr: "Rédigé des exercices notés désormais réutilisés dans le cursus standard.",
      },
    ],
    stack: ["Java", "Algorithmes", "Pédagogie"],
  },
]

export type EducationItem = {
  degree: Localized
  school: string
  period: string
  status: "completed" | "ongoing"
  statusLabel: Localized
  detail: Localized
}

export const education: EducationItem[] = [
  {
    degree: {
      en: "Master's Degree in Software Engineering",
      fr: "Master Génie Logiciel",
    },
    school: "Université Claude Bernard Lyon 1",
    period: "2026 – 2028",
    status: "ongoing",
    statusLabel: {
      en: "In progress",
      fr: "En cours",
    },
    detail: {
      en: "Focus on distributed systems, software architecture and DevOps — pursued under a work-study contract.",
      fr: "Axes : systèmes distribués, architecture logicielle et DevOps — en contrat d'alternance.",
    },
  },
  {
    degree: {
      en: "Bachelor's Degree in Computer Science",
      fr: "Licence Informatique",
    },
    school: "Université Claude Bernard Lyon 1",
    period: "2023 – 2026",
    status: "completed",
    statusLabel: {
      en: "Graduated, honours",
      fr: "Obtenue, mention Bien",
    },
    detail: {
      en: "Java / Spring Boot specialization, databases and web development. Final-year internship at Nexvia Solutions.",
      fr: "Spécialisation Java / Spring Boot, bases de données et développement web. Stage de fin d'études chez Nexvia Solutions.",
    },
  },
]
