import type { Localized } from "@/lib/i18n"

export const persona = {
  name: "Alex Moreau",
  initials: "AM",
  role: {
    en: "Full-Stack Developer",
    fr: "Développeur Full-Stack",
    ar: "مطوّر Full-Stack",
  } satisfies Localized,
  tagline: {
    en: "Computer Science graduate building reliable web applications with Java & React.",
    fr: "Diplômé en informatique, je conçois des applications web fiables avec Java et React.",
    ar: "خريج علوم الحاسب، أبني تطبيقات ويب موثوقة باستخدام Java وReact.",
  } satisfies Localized,
  location: { en: "Lyon, France", fr: "Lyon, France", ar: "ليون، فرنسا" } satisfies Localized,
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
      "from-[var(--grad-portfolio-from)] via-[var(--grad-portfolio-via)] to-transparent",
    description: {
      en: "Self-updating portfolio. GitHub webhooks trigger a Spring Boot API that syncs project manifests into PostgreSQL, rendered by a React UI.",
      fr: "Portfolio auto-synchronisé. Des webhooks GitHub déclenchent une API Spring Boot qui synchronise les projets dans PostgreSQL, affichés par une interface React.",
      ar: "ملف أعمال ذاتي التحديث. تُطلق webhooks من GitHub واجهة Spring Boot التي تُزامن المشاريع في PostgreSQL، وتعرضها واجهة React.",
    },
    stack: ["Java 21", "Spring Boot", "PostgreSQL", "React", "Webhooks"],
    repoUrl: "https://github.com/alexmoreau-dev/portfolio-sync",
    featured: true,
  },
  {
    title: "CampusFlow",
    icon: "calendar",
    gradient:
      "from-[var(--grad-campus-from)] via-[var(--grad-campus-via)] to-transparent",
    description: {
      en: "Room and equipment booking platform for a university campus, with conflict detection and role-based access.",
      fr: "Plateforme de réservation de salles et de matériel pour un campus universitaire, avec détection de conflits et gestion des rôles.",
      ar: "منصة حجز القاعات والمعدات للحرم الجامعي، مع كشف التعارضات وإدارة الوصول حسب الأدوار.",
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
      "from-[var(--grad-libri-from)] via-[var(--grad-libri-via)] to-transparent",
    description: {
      en: "Library management system: catalog, loans, late-return notifications and an admin dashboard with usage statistics.",
      fr: "Système de gestion de bibliothèque : catalogue, prêts, relances automatiques et tableau de bord administrateur avec statistiques.",
      ar: "نظام إدارة المكتبات: فهرس وإعارات وتنبيهات التأخير ولوحة إدارة مع إحصاءات الاستخدام.",
    },
    stack: ["Java", "Spring Security", "Thymeleaf", "PostgreSQL"],
    repoUrl: "https://github.com/alexmoreau-dev/libritrack",
  },
  {
    title: "MeteoLens",
    icon: "cloud",
    gradient:
      "from-[var(--grad-meteo-from)] via-[var(--grad-meteo-via)] to-transparent",
    description: {
      en: "Weather dashboard consuming Open-Meteo, with saved locations, hourly forecasts and offline caching.",
      fr: "Tableau de bord météo utilisant Open-Meteo, avec lieux favoris, prévisions horaires et cache hors ligne.",
      ar: "لوحة طقس تعتمد على Open-Meteo، مع مواقع محفوظة وتوقعات بالساعة وتخزين مؤقت دون اتصال.",
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
    label: { en: "Languages", fr: "Langages", ar: "اللغات" },
    items: ["Java", "TypeScript", "SQL", "Python", "HTML / CSS"],
  },
  {
    label: { en: "Backend", fr: "Back-end", ar: "الواجهة الخلفية" },
    items: ["Spring Boot", "Spring Security", "REST APIs", "JUnit 5", "Flyway"],
  },
  {
    label: { en: "Frontend", fr: "Front-end", ar: "الواجهة الأمامية" },
    items: ["React", "Vite", "Tailwind CSS", "shadcn/ui", "React Query"],
  },
  {
    label: { en: "Data & Tools", fr: "Données & Outils", ar: "البيانات والأدوات" },
    items: ["PostgreSQL", "Redis", "Docker", "Git & GitHub", "Linux"],
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
      ar: "ماجستير في هندسة البرمجيات",
    },
    school: "Université Claude Bernard Lyon 1",
    period: "2026 – 2028",
    status: "ongoing",
    statusLabel: {
      en: "In progress",
      fr: "En cours",
      ar: "قيد الدراسة",
    },
    detail: {
      en: "Focus on distributed systems, software architecture and DevOps — pursued under a work-study contract.",
      fr: "Axes : systèmes distribués, architecture logicielle et DevOps — en contrat d'alternance.",
      ar: "التركيز على الأنظمة الموزعة وبنية البرمجيات وDevOps — ضمن عقد دراسة وعمل.",
    },
  },
  {
    degree: {
      en: "Bachelor's Degree in Computer Science",
      fr: "Licence Informatique",
      ar: "إجازة في علوم الحاسب",
    },
    school: "Université Claude Bernard Lyon 1",
    period: "2023 – 2026",
    status: "completed",
    statusLabel: {
      en: "Graduated, honours",
      fr: "Obtenue, mention Bien",
      ar: "تخرج بميزة",
    },
    detail: {
      en: "Java / Spring Boot specialization, databases and web development. Final-year internship at Nexvia Solutions.",
      fr: "Spécialisation Java / Spring Boot, bases de données et développement web. Stage de fin d'études chez Nexvia Solutions.",
      ar: "تخصص Java ‏/ Spring Boot وقواعد البيانات وتطوير الويب. تدريب نهاية الدراسة لدى Nexvia Solutions.",
    },
  },
]
