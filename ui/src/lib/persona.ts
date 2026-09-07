import type { Localized } from "@/lib/i18n"
import type {
  ProjectKind,
  ProjectLinks,
  ProjectPeriod,
  ProjectRepo,
  ProjectRole,
  ProjectStatus,
} from "@/lib/project-dto"

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
  slug: string
  icon: "webhook" | "calendar" | "book" | "cloud"
  gradient: string
  name: Localized
  tagline: Localized
  status: ProjectStatus
  role: ProjectRole
  teamSize?: number
  kind: ProjectKind
  period: ProjectPeriod
  stack: string[]
  repos: ProjectRepo[]
  links: ProjectLinks
  highlights: Record<"en" | "fr" | "ar", string[]>
  metrics: { label: Localized; value: string }[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    slug: "portfolio-sync",
    icon: "webhook",
    gradient:
      "from-[var(--grad-portfolio-from)] via-[var(--grad-portfolio-via)] to-transparent",
    name: {
      en: "Portfolio Sync",
      fr: "Portfolio Sync",
      ar: "مزامنة الملف",
    },
    tagline: {
      en: "Self-updating portfolio. GitHub webhooks trigger a Spring Boot API that syncs project manifests into PostgreSQL, rendered by a React UI.",
      fr: "Portfolio auto-synchronisé. Des webhooks GitHub déclenchent une API Spring Boot qui synchronise les projets dans PostgreSQL, affichés par une interface React.",
      ar: "ملف أعمال ذاتي التحديث. تُطلق webhooks من GitHub واجهة Spring Boot التي تُزامن المشاريع في PostgreSQL، وتعرضها واجهة React.",
    },
    status: "in-progress",
    role: "solo",
    kind: "personal",
    period: { start: "2025-09" },
    stack: ["Java 21", "Spring Boot", "PostgreSQL", "React", "Webhooks"],
    repos: [{ label: "monorepo", url: "https://github.com/alexmoreau-dev/portfolio-sync" }],
    links: {},
    highlights: {
      en: [
        "Push to main triggers a sync within seconds via GitHub webhooks",
        "HMAC-verified receiver upserts manifests into PostgreSQL",
        "Trilingual UI with full RTL support renders the synced data",
      ],
      fr: [
        "Un push sur main déclenche une synchro en quelques secondes via webhooks",
        "Un récepteur vérifié HMAC synchronise les manifestes dans PostgreSQL",
        "Une interface trilingue avec support RTL affiche les données",
      ],
      ar: [
        "الدفع إلى main يُطلق المزامنة خلال ثوانٍ عبر webhooks",
        "مستقبِل مُتحقق منه بـ HMAC يُزامن البيانات في PostgreSQL",
        "واجهة بثلاث لغات مع دعم كامل للاتجاه RTL تعرض البيانات",
      ],
    },
    metrics: [],
    featured: true,
  },
  {
    slug: "campusflow",
    icon: "calendar",
    gradient:
      "from-[var(--grad-campus-from)] via-[var(--grad-campus-via)] to-transparent",
    name: {
      en: "CampusFlow",
      fr: "CampusFlow",
      ar: "CampusFlow",
    },
    tagline: {
      en: "Room and equipment booking platform for a university campus, with conflict detection and role-based access.",
      fr: "Plateforme de réservation de salles et de matériel pour un campus universitaire, avec détection de conflits et gestion des rôles.",
      ar: "منصة حجز القاعات والمعدات للحرم الجامعي، مع كشف التعارضات وإدارة الوصول حسب الأدوار.",
    },
    status: "shipped",
    role: "team",
    teamSize: 4,
    kind: "academic",
    period: { start: "2025-02", end: "2025-06" },
    stack: ["Spring Boot", "React", "TypeScript", "PostgreSQL", "Docker"],
    repos: [
      { label: "api", url: "https://github.com/alexmoreau-dev/campusflow-api" },
      { label: "ui", url: "https://github.com/alexmoreau-dev/campusflow-ui" },
    ],
    links: { demo: "https://campusflow.example.com" },
    highlights: {
      en: [
        "Conflict detection across rooms, equipment and time slots",
        "Role-based access for students, staff and admins",
        "Shipped with Docker behind a single Compose stack",
      ],
      fr: [
        "Détection de conflits sur salles, matériel et créneaux",
        "Accès par rôles pour étudiants, personnel et admins",
        "Livré avec Docker via une stack Compose unique",
      ],
      ar: [
        "كشف التعارضات عبر القاعات والمعدات والمواعيد",
        "وصول حسب الأدوار للطلاب والموظفين والإداريين",
        "أُطلق عبر Docker ضمن حزمة Compose واحدة",
      ],
    },
    metrics: [],
    featured: true,
  },
  {
    slug: "libritrack",
    icon: "book",
    gradient:
      "from-[var(--grad-libri-from)] via-[var(--grad-libri-via)] to-transparent",
    name: {
      en: "LibriTrack",
      fr: "LibriTrack",
      ar: "LibriTrack",
    },
    tagline: {
      en: "Library management system: catalog, loans, late-return notifications and an admin dashboard with usage statistics.",
      fr: "Système de gestion de bibliothèque : catalogue, prêts, relances automatiques et tableau de bord administrateur avec statistiques.",
      ar: "نظام إدارة المكتبات: فهرس وإعارات وتنبيهات التأخير ولوحة إدارة مع إحصاءات الاستخدام.",
    },
    status: "maintained",
    role: "solo",
    kind: "academic",
    period: { start: "2024-09", end: "2025-01" },
    stack: ["Java", "Spring Security", "Thymeleaf", "PostgreSQL"],
    repos: [{ label: "monorepo", url: "https://github.com/alexmoreau-dev/libritrack" }],
    links: {},
    highlights: {
      en: [
        "Catalog, loans and automatic late-return notifications",
        "Admin dashboard with borrowing statistics",
        "Secured end to end with Spring Security roles",
      ],
      fr: [
        "Catalogue, prêts et relances automatiques de retard",
        "Tableau de bord admin avec statistiques d'emprunt",
        "Sécurisé de bout en bout par rôles Spring Security",
      ],
      ar: [
        "فهرس وإعارات وتنبيهات تلقائية بالتأخير",
        "لوحة إدارة مع إحصاءات الإعارة",
        "مؤمّن بالكامل بأدوار Spring Security",
      ],
    },
    metrics: [],
  },
  {
    slug: "meteolens",
    icon: "cloud",
    gradient:
      "from-[var(--grad-meteo-from)] via-[var(--grad-meteo-via)] to-transparent",
    name: {
      en: "MeteoLens",
      fr: "MeteoLens",
      ar: "MeteoLens",
    },
    tagline: {
      en: "Weather dashboard consuming Open-Meteo, with saved locations, hourly forecasts and offline caching.",
      fr: "Tableau de bord météo utilisant Open-Meteo, avec lieux favoris, prévisions horaires et cache hors ligne.",
      ar: "لوحة طقس تعتمد على Open-Meteo، مع مواقع محفوظة وتوقعات بالساعة وتخزين مؤقت دون اتصال.",
    },
    status: "shipped",
    role: "solo",
    kind: "personal",
    period: { start: "2024-03", end: "2024-05" },
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    repos: [{ label: "ui", url: "https://github.com/alexmoreau-dev/meteolens" }],
    links: { demo: "https://meteolens.example.com" },
    highlights: {
      en: [
        "Hourly forecasts with saved locations",
        "Offline caching of last-viewed data",
        "Zero-backend build on the Open-Meteo API",
      ],
      fr: [
        "Prévisions horaires avec lieux favoris",
        "Cache hors ligne des dernières données",
        "Build sans back-end sur l'API Open-Meteo",
      ],
      ar: [
        "توقعات بالساعة مع مواقع محفوظة",
        "تخزين مؤقت دون اتصال لآخر البيانات",
        "بناء دون خادم خلفي على واجهة Open-Meteo",
      ],
    },
    metrics: [],
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
