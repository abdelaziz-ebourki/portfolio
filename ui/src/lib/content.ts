import type { Localized } from "@/lib/i18n"

export const ui = {
  nav: {
    about: { en: "About", fr: "À propos" },
    skills: { en: "Skills", fr: "Compétences" },
    projects: { en: "Projects", fr: "Projets" },
    experience: { en: "Experience", fr: "Expérience" },
    education: { en: "Education", fr: "Formation" },
    terminal: { en: "Terminal", fr: "Terminal" },
    contact: { en: "Contact", fr: "Contact" },
  } satisfies Record<string, Localized>,

  hero: {
    ctaProjects: { en: "View my work", fr: "Voir mes projets" },
    ctaContact: { en: "Get in touch", fr: "Me contacter" },
    scroll: { en: "Scroll to explore", fr: "Faites défiler" },
  } satisfies Record<string, Localized>,

  about: {
    title: { en: "About me", fr: "À propos de moi" },
    subtitle: {
      en: "A quick introduction",
      fr: "Une brève présentation",
    },
    paragraphs: [
      {
        en: "I'm Alex, a recent Computer Science graduate from Lyon. I discovered development through Java and never looked back — today I design full-stack applications where the backend is as carefully crafted as the interface.",
        fr: "Je m'appelle Alex et je viens d'obtenir ma licence informatique à Lyon. J'ai découvert le développement avec Java et je n'ai jamais arrêté — aujourd'hui je conçois des applications full-stack où le back-end est aussi soigné que l'interface.",
      },
      {
        en: "I'm now pursuing a Master's in Software Engineering, because I learn best when I build things that people actually use.",
        fr: "Je poursuis actuellement un master en génie logiciel, car j'apprends mieux en construisant des choses utiles aux gens.",
      },
      {
        en: "Beyond code, you'll find me contributing to open-source, playing chess badly, and over-engineering my espresso.",
        fr: "En dehors du code : contributions open-source, échecs (médiocres) et sur-ingenierie de mon espresso.",
      },
    ] satisfies Array<Localized>,
    values: [
      {
        id: "craft",
        label: { en: "Craft", fr: "Rigueur" },
        detail: {
          en: "Clean architecture, tested code, honest commits.",
          fr: "Architecture propre, code testé, commits honnêtes.",
        },
      },
      {
        id: "curiosity",
        label: { en: "Curiosity", fr: "Curiosité" },
        detail: {
          en: "New stacks, RFCs and papers — always reading.",
          fr: "Nouvelles stacks, RFC et papiers — lecture permanente.",
        },
      },
      {
        id: "teamwork",
        label: { en: "Teamwork", fr: "Esprit d'équipe" },
        detail: {
          en: "Code reviews as conversations, not verdicts.",
          fr: "Les revues de code comme des échanges, pas des verdicts.",
        },
      },
    ],
  } satisfies Record<string, unknown>,

  skills: {
    title: { en: "Skills & tools", fr: "Compétences & outils" },
    subtitle: {
      en: "The stack I reach for daily",
      fr: "La stack que j'utilise au quotidien",
    },
  } satisfies Record<string, Localized>,

  projects: {
    title: { en: "Selected projects", fr: "Projets sélectionnés" },
    subtitle: {
      en: "Things I designed, built and shipped",
      fr: "Des projets conçus, développés et livrés",
    },
    viewCode: { en: "Code", fr: "Code" },
    liveDemo: { en: "Live demo", fr: "Démo" },
    featured: { en: "Featured", fr: "À la une" },
    moreOnGithub: {
      en: "More experiments on GitHub",
      fr: "Plus d'expériences sur GitHub",
    },
  } satisfies Record<string, Localized>,

  experience: {
    title: { en: "Experience", fr: "Expérience" },
    subtitle: {
      en: "Where I've learned by doing",
      fr: "Où j'ai appris en faisant",
    },
  } satisfies Record<string, Localized>,

  education: {
    title: { en: "Education", fr: "Formation" },
    subtitle: {
      en: "The academic path so far",
      fr: "Mon parcours académique",
    },
  } satisfies Record<string, Localized>,

  terminal: {
    title: { en: "Talk to my shell", fr: "Parlez à mon shell" },
    subtitle: {
      en: "An interactive terminal, for the curious",
      fr: "Un terminal interactif, pour les curieux",
    },
    hint: {
      en: "Type 'help' to list available commands.",
      fr: "Tapez 'help' pour lister les commandes disponibles.",
    },
    inputPlaceholder: {
      en: "type a command...",
      fr: "tapez une commande...",
    },
    ariaLabel: {
      en: "Interactive terminal input",
      fr: "Saisie du terminal interactif",
    },
    unknown: {
      en: "command not found:",
      fr: "commande introuvable :",
    },
    help: {
      en: "Available commands:\n  about        who I am, in a few lines\n  skills       my daily stack\n  projects     things I shipped\n  experience   where I worked\n  education    my academic path\n  contact      how to reach me\n  whoami ls clear sudo hire-me",
      fr: "Commandes disponibles :\n  about        qui je suis, en quelques lignes\n  skills       ma stack du quotidien\n  projects     ce que j'ai livré\n  experience   où j'ai travaillé\n  education    mon parcours\n  contact      comment me joindre\n  whoami ls clear sudo hire-me",
    },
    about: {
      en: "Computer Science graduate from Lyon.\nFull-stack: Java & Spring Boot behind, React & TypeScript in front.\nPursuing a Master's in Software Engineering.",
      fr: "Diplômé en informatique à Lyon.\nFull-stack : Java et Spring Boot derrière, React et TypeScript devant.\nActuellement en master génie logiciel.",
    },
    skills: {
      en: "languages    Java · TypeScript · SQL · Python\nbackend      Spring Boot · Spring Security · REST · JUnit 5\nfrontend     React · Vite · Tailwind CSS · shadcn/ui\ndata/tools   PostgreSQL · Redis · Docker · Git · Linux",
      fr: "langages      Java · TypeScript · SQL · Python\nback-end      Spring Boot · Spring Security · REST · JUnit 5\nfront-end     React · Vite · Tailwind CSS · shadcn/ui\ndonnées/outils PostgreSQL · Redis · Docker · Git · Linux",
    },
    projects: {
      en: "portfolio-sync   self-updating portfolio (webhooks + Spring Boot + React)\ncampusflow       campus room booking platform\nlibritrack       library management system\nmeteolens        weather dashboard\ntry 'ls' — or scroll up, they are all on this page.",
      fr: "portfolio-sync   portfolio auto-synchronisé (webhooks + Spring Boot + React)\ncampusflow       réservation de salles pour le campus\nlibritrack       gestion de bibliothèque\nmeteolens        tableau de bord météo\nessayez 'ls' — ou remontez, tout est sur cette page.",
    },
    experience: {
      en: "2026        Software Engineering Intern — Nexvia Solutions\n2024-2026   Teaching Assistant (Algorithms) — UCBL",
      fr: "2026          Stagiaire ingénierie logicielle — Nexvia Solutions\n2024-2026     Assistant pédagogique (algorithmique) — UCBL",
    },
    education: {
      en: "2026-2028   Master Génie Logiciel — UCBL (in progress)\n2023-2026   Licence Informatique — UCBL (honours)",
      fr: "2026-2028     Master Génie Logiciel — UCBL (en cours)\n2023-2026     Licence Informatique — UCBL (mention Bien)",
    },
    ls: {
      en: "about/  skills/  projects/  experience/  education/  contact/",
      fr: "about/  skills/  projects/  experience/  education/  contact/",
    },
    sudoGranted: {
      en: "[sudo] permission granted — opening mailbox:",
      fr: "[sudo] permission accordée — ouverture de la boîte mail :",
    },
    rmDenied: {
      en: "rm: permission denied — this portfolio is read-only :)",
      fr: "rm : permission refusée — ce portfolio est en lecture seule :)",
    },
    catHint: {
      en: "cat: nothing to gnaw here — try 'about' or 'projects'.",
      fr: "cat : rien à grignoter ici — essayez 'about' ou 'projects'.",
    },
  } satisfies Record<string, unknown>,

  contact: {
    title: { en: "Let's talk", fr: "Discutons" },
    subtitle: {
      en: "An internship, a project, or just coffee — my inbox is open.",
      fr: "Alternance, projet ou simple café — ma boîte mail est ouverte.",
    },
    nameLabel: { en: "Name", fr: "Nom" },
    namePlaceholder: { en: "Jane Doe", fr: "Jeanne Dupont" },
    emailLabel: { en: "Email", fr: "E-mail" },
    emailPlaceholder: {
      en: "jane@company.com",
      fr: "jeanne@entreprise.fr",
    },
    messageLabel: { en: "Message", fr: "Message" },
    messagePlaceholder: {
      en: "Tell me about your project...",
      fr: "Parlez-moi de votre projet...",
    },
    send: { en: "Send message", fr: "Envoyer le message" },
    sending: { en: "Sending...", fr: "Envoi..." },
    sent: { en: "Sent!", fr: "Envoyé !" },
    sentHint: {
      en: "Thanks! This demo form doesn't send anything yet — email me directly instead.",
      fr: "Merci ! Ce formulaire de démo n'envoie rien pour l'instant — écrivez-moi directement.",
    },
    orReach: { en: "Or reach me at", fr: "Ou contactez-moi à" },
    socials: { en: "Elsewhere", fr: "Ailleurs" },
  } satisfies Record<string, Localized>,

  footer: {
    tagline: {
      en: "Designed & built with care.",
      fr: "Conçu et développé avec soin.",
    },
    rights: { en: "All rights reserved.", fr: "Tous droits réservés." },
    backToTop: { en: "Back to top", fr: "Retour en haut" },
  } satisfies Record<string, Localized>,
}
