import type { Localized } from "@/lib/i18n"

export const ui = {
  nav: {
    about: { en: "About", fr: "À propos", ar: "نبذة" },
    skills: { en: "Skills", fr: "Compétences", ar: "المهارات" },
    projects: { en: "Projects", fr: "Projets", ar: "المشاريع" },
    education: { en: "Education", fr: "Formation", ar: "التعليم" },
    terminal: { en: "Terminal", fr: "Terminal", ar: "الطرفية" },
    contact: { en: "Contact", fr: "Contact", ar: "تواصل" },
  } satisfies Record<string, Localized>,

  hero: {
    ctaProjects: { en: "View my work", fr: "Voir mes projets", ar: "شاهد أعمالي" },
    ctaContact: { en: "Get in touch", fr: "Me contacter", ar: "تواصل معي" },
  } satisfies Record<string, Localized>,

  about: {
    title: { en: "About me", fr: "À propos de moi", ar: "نبذة عني" },
    subtitle: {
      en: "A quick introduction",
      fr: "Une brève présentation",
      ar: "مقدمة سريعة",
    },
    paragraphs: [
      {
        en: "I'm Alex, a recent Computer Science graduate from Lyon. I discovered development through Java and never looked back — today I design full-stack applications where the backend is as carefully crafted as the interface.",
        fr: "Je m'appelle Alex et je viens d'obtenir ma licence informatique à Lyon. J'ai découvert le développement avec Java et je n'ai jamais arrêté — aujourd'hui je conçois des applications full-stack où le back-end est aussi soigné que l'interface.",
        ar: "أنا أليكس، خريج علوم الحاسب حديثًا من ليون. اكتشفت البرمجة من خلال Java ولم أتوقف منذ ذلك الحين — واليوم أصمم تطبيقات full-stack حيث الواجهة الخلفية مصممة بعناية بقدر الواجهة الأمامية.",
      },
      {
        en: "I'm now pursuing a Master's in Software Engineering, because I learn best when I build things that people actually use.",
        fr: "Je poursuis actuellement un master en génie logiciel, car j'apprends mieux en construisant des choses utiles aux gens.",
        ar: "أتابع حاليًا ماجستير في هندسة البرمجيات، لأنني أتعلم بشكل أفضل عندما أبني أشياء يستخدمها الناس فعلًا.",
      },
      {
        en: "Beyond code, you'll find me contributing to open-source, playing chess badly, and over-engineering my espresso.",
        fr: "En dehors du code : contributions open-source, échecs (médiocres) et sur-ingenierie de mon espresso.",
        ar: "خارج البرمجة، ستجدني أساهم في المشاريع مفتوحة المصدر، وألعب الشطرنج بشكل سيئ، وأبالغ في تحضير الإسبريسو.",
      },
    ] satisfies Array<Localized>,
    values: [
      {
        id: "craft",
        label: { en: "Craft", fr: "Rigueur", ar: "الإتقان" },
        detail: {
          en: "Clean architecture, tested code, honest commits.",
          fr: "Architecture propre, code testé, commits honnêtes.",
          ar: "بنية نظيفة، وكود مُختبَر، والتزامات صادقة.",
        },
      },
      {
        id: "curiosity",
        label: { en: "Curiosity", fr: "Curiosité", ar: "الفضول" },
        detail: {
          en: "New stacks, RFCs and papers — always reading.",
          fr: "Nouvelles stacks, RFC et papiers — lecture permanente.",
          ar: "تقنيات جديدة وRFCs وأوراق علمية — قراءة دائمة.",
        },
      },
      {
        id: "teamwork",
        label: { en: "Teamwork", fr: "Esprit d'équipe", ar: "العمل الجماعي" },
        detail: {
          en: "Code reviews as conversations, not verdicts.",
          fr: "Les revues de code comme des échanges, pas des verdicts.",
          ar: "مراجعات الكود كحوارات، وليست أحكامًا.",
        },
      },
    ],
  } satisfies Record<string, unknown>,

  skills: {
    title: { en: "Skills & tools", fr: "Compétences & outils", ar: "المهارات والأدوات" },
    subtitle: {
      en: "The stack I reach for daily",
      fr: "La stack que j'utilise au quotidien",
      ar: "التقنيات التي أستخدمها يوميًا",
    },
  } satisfies Record<string, Localized>,

  projects: {
    title: { en: "Selected projects", fr: "Projets sélectionnés", ar: "مشاريع مختارة" },
    subtitle: {
      en: "Things I designed, built and shipped",
      fr: "Des projets conçus, développés et livrés",
      ar: "مشاريع صممتها وبنيتها وأطلقتها",
    },
    viewCode: { en: "Code", fr: "Code", ar: "الكود" },
    liveDemo: { en: "Live demo", fr: "Démo", ar: "عرض حي" },
    featured: { en: "Featured", fr: "À la une", ar: "مميز" },
    moreOnGithub: {
      en: "More experiments on GitHub",
      fr: "Plus d'expériences sur GitHub",
      ar: "المزيد من التجارب على GitHub",
    },
  } satisfies Record<string, Localized>,

  education: {
    title: { en: "Education", fr: "Formation", ar: "التعليم" },
    subtitle: {
      en: "The academic path so far",
      fr: "Mon parcours académique",
      ar: "مساري الأكاديمي حتى الآن",
    },
  } satisfies Record<string, Localized>,

  terminal: {
    title: { en: "Talk to my shell", fr: "Parlez à mon shell", ar: "تحدث إلى سطري" },
    subtitle: {
      en: "An interactive terminal, for the curious",
      fr: "Un terminal interactif, pour les curieux",
      ar: "طرفية تفاعلية، للفضوليين",
    },
    hint: {
      en: "Type 'help' to list available commands.",
      fr: "Tapez 'help' pour lister les commandes disponibles.",
      ar: "اكتب 'help' لعرض الأوامر المتاحة.",
    },
    ariaLabel: {
      en: "Interactive terminal input",
      fr: "Saisie du terminal interactif",
      ar: "إدخال الطرفية التفاعلية",
    },
    unknown: {
      en: "command not found:",
      fr: "commande introuvable :",
      ar: "أمر غير موجود:",
    },
    help: {
      en: "Available commands:\n  about        who I am, in a few lines\n  skills       my daily stack\n  projects     things I shipped\n  education    my academic path\n  contact      how to reach me\n  whoami ls clear\n  theme        toggle or set theme (light/dark)\n  lang         switch language (en/fr/ar)",
      fr: "Commandes disponibles :\n  about        qui je suis, en quelques lignes\n  skills       ma stack du quotidien\n  projects     ce que j'ai livré\n  education    mon parcours\n  contact      comment me joindre\n  whoami ls clear\n  theme        changer de thème (light/dark)\n  lang         changer de langue (en/fr/ar)",
      ar: "الأوامر المتاحة:\n  about        من أنا، في سطور قليلة\n  skills       تقنياتي اليومية\n  projects     ما أنجزته\n  education    مساري الأكاديمي\n  contact      كيف تتواصل معي\n  whoami ls clear\n  theme        تبديل أو تحديد المظهر (light/dark)\n  lang         تغيير اللغة (en/fr/ar)",
    },
    about: {
      en: "Computer Science graduate from Lyon.\nFull-stack: Java & Spring Boot behind, React & TypeScript in front.\nPursuing a Master's in Software Engineering.",
      fr: "Diplômé en informatique à Lyon.\nFull-stack : Java et Spring Boot derrière, React et TypeScript devant.\nActuellement en master génie logiciel.",
      ar: "خريج علوم الحاسب من ليون.\nFull-stack: ‏Java وSpring Boot في الخلفية، وReact وTypeScript في الواجهة.\nأتابع ماجستير في هندسة البرمجيات.",
    },
    skills: {
      en: "languages    Java · TypeScript · SQL · Python\nbackend      Spring Boot · Spring Security · REST · JUnit 5\nfrontend     React · Vite · Tailwind CSS · shadcn/ui\ndata/tools   PostgreSQL · Redis · Docker · Git · Linux",
      fr: "langages      Java · TypeScript · SQL · Python\nback-end      Spring Boot · Spring Security · REST · JUnit 5\nfront-end     React · Vite · Tailwind CSS · shadcn/ui\ndonnées/outils PostgreSQL · Redis · Docker · Git · Linux",
      ar: "اللغات        Java · TypeScript · SQL · Python\nالخلفية       Spring Boot · Spring Security · REST · JUnit 5\nالواجهة       React · Vite · Tailwind CSS · shadcn/ui\nبيانات/أدوات  PostgreSQL · Redis · Docker · Git · Linux",
    },
    projects: {
      en: "portfolio-sync   self-updating portfolio (webhooks + Spring Boot + React)\ncampusflow       campus room booking platform\nlibritrack       library management system\nmeteolens        weather dashboard\ntry 'ls' — or scroll up, they are all on this page.",
      fr: "portfolio-sync   portfolio auto-synchronisé (webhooks + Spring Boot + React)\ncampusflow       réservation de salles pour le campus\nlibritrack       gestion de bibliothèque\nmeteolens        tableau de bord météo\nessayez 'ls' — ou remontez, tout est sur cette page.",
      ar: "portfolio-sync   ملف أعمال ذاتي التحديث (webhooks ‏+ Spring Boot ‏+ React)\ncampusflow       منصة حجز قاعات الحرم الجامعي\nlibritrack       نظام إدارة المكتبات\nmeteolens        لوحة متابعة الطقس\nجرّب 'ls' — أو مرّر للأعلى، فكلها في هذه الصفحة.",
    },
    education: {
      en: "2026-2028   Master Génie Logiciel — UCBL (in progress)\n2023-2026   Licence Informatique — UCBL (honours)",
      fr: "2026-2028     Master Génie Logiciel — UCBL (en cours)\n2023-2026     Licence Informatique — UCBL (mention Bien)",
      ar: "2026-2028   ماجستير هندسة البرمجيات — UCBL (قيد الدراسة)\n2023-2026   إجازة في علوم الحاسب — UCBL (بميزة)",
    },
    ls: {
      en: "about/  skills/  projects/  education/  contact/",
      fr: "about/  skills/  projects/  education/  contact/",
      ar: "about/  skills/  projects/  education/  contact/",
    },
    rmDenied: {
      en: "rm: permission denied — this portfolio is read-only :)",
      fr: "rm : permission refusée — ce portfolio est en lecture seule :)",
      ar: "rm: تم الرفض — هذا الملف للقراءة فقط :)",
    },
    catHint: {
      en: "cat: nothing to gnaw here — try 'about' or 'projects'.",
      fr: "cat : rien à grignoter ici — essayez 'about' ou 'projects'.",
      ar: "cat: لا شيء هنا — جرّب 'about' أو 'projects'.",
    },
    side: {
      cheatHint: {
        en: "Click to run · Tab complete · ↑↓ history",
        fr: "Cliquer pour exécuter · Tab complète · ↑↓ historique",
        ar: "انقر للتشغيل · Tab للإكمال · ↑↓ للسجل",
      },
      commands: {
        help: { en: "list commands", fr: "lister les commandes", ar: "عرض الأوامر" },
        whoami: { en: "who am I", fr: "qui suis-je", ar: "من أنا" },
        about: { en: "who I am", fr: "qui je suis", ar: "نبذة عني" },
        skills: { en: "daily stack", fr: "stack du jour", ar: "تقنياتي اليومية" },
        projects: { en: "things I shipped", fr: "ce que j'ai livré", ar: "ما أنجزته" },
        education: { en: "academic path", fr: "parcours", ar: "المسار الأكاديمي" },
        contact: { en: "reach me", fr: "me joindre", ar: "تواصل معي" },
        ls: { en: "list sections", fr: "lister sections", ar: "عرض الأقسام" },
        clear: { en: "clear screen", fr: "effacer écran", ar: "مسح الشاشة" },
        theme: { en: "toggle theme", fr: "changer de thème", ar: "تبديل المظهر" },
        lang: { en: "switch language", fr: "changer de langue", ar: "تغيير اللغة" },
      } satisfies Record<string, Localized>,
    },
  } satisfies Record<string, unknown>,

  contact: {
    title: { en: "Let's talk", fr: "Discutons", ar: "لنتحدث" },
    subtitle: {
      en: "Have a project in mind? Let's build it.",
      fr: "Une idée en tête ? Construisons-la.",
      ar: "لديك فكرة مشروع؟ لنبنِها معًا.",
    },
    nameLabel: { en: "Name", fr: "Nom", ar: "الاسم" },
    namePlaceholder: { en: "Jane Doe", fr: "Jeanne Dupont", ar: "أحمد علي" },
    emailLabel: { en: "Email", fr: "E-mail", ar: "البريد الإلكتروني" },
    emailPlaceholder: {
      en: "jane@company.com",
      fr: "jeanne@entreprise.fr",
      ar: "ahmed@company.com",
    },
    messageLabel: { en: "Message", fr: "Message", ar: "الرسالة" },
    messagePlaceholder: {
      en: "Tell me about your project...",
      fr: "Parlez-moi de votre projet...",
      ar: "حدثني عن مشروعك...",
    },
    send: { en: "Send message", fr: "Envoyer le message", ar: "أرسل الرسالة" },
    sending: { en: "Sending...", fr: "Envoi...", ar: "جارٍ الإرسال..." },
    sent: { en: "Sent!", fr: "Envoyé !", ar: "تم الإرسال!" },
    sentHint: {
      en: "Thanks! This demo form doesn't send anything yet — email me directly instead.",
      fr: "Merci ! Ce formulaire de démo n'envoie rien pour l'instant — écrivez-moi directement.",
      ar: "شكرًا! نموذج العرض هذا لا يرسل أي شيء بعد — راسلني مباشرة عبر البريد.",
    },
    orReach: { en: "Or reach me at", fr: "Ou contactez-moi à", ar: "أو تواصل معي عبر" },
  } satisfies Record<string, Localized>,

  footer: {
    backToTop: { en: "Back to top", fr: "Retour en haut", ar: "العودة إلى الأعلى" },
  } satisfies Record<string, Localized>,

  resume: {
    menuLabel: { en: "Resume", fr: "CV", ar: "السيرة الذاتية" },
    ariaLabel: {
      en: "Download resume",
      fr: "Télécharger le CV",
      ar: "تحميل السيرة الذاتية",
    },
    fileNames: {
      en: { en: "English CV", fr: "CV en anglais", ar: "السيرة الذاتية بالإنجليزية" },
      fr: { en: "French CV", fr: "CV en français", ar: "السيرة الذاتية بالفرنسية" },
      ar: { en: "Arabic CV", fr: "CV en arabe", ar: "السيرة الذاتية بالعربية" },
    } satisfies Record<string, Localized>,
  } satisfies Record<string, unknown>,
}
