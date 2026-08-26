import type { SimpleIcon } from "simple-icons"
import {
  siDocker,
  siGit,
  siGradle,
  siHibernate,
  siLinux,
  siOpenjdk,
  siPostgresql,
  siReact,
  siSpringboot,
  siTailwindcss,
  siTypescript,
  siVite,
} from "simple-icons"
import type { LogoLoopNodeLogo } from "@/components/logo-loop"

function renderTechIcon(icon: SimpleIcon) {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )
}

export const techLogos: LogoLoopNodeLogo[] = [
  { node: renderTechIcon(siOpenjdk), title: "Java", ariaLabel: "Java" },
  { node: renderTechIcon(siSpringboot), title: "Spring Boot", ariaLabel: "Spring Boot" },
  { node: renderTechIcon(siHibernate), title: "Hibernate", ariaLabel: "Hibernate" },
  { node: renderTechIcon(siGradle), title: "Gradle", ariaLabel: "Gradle" },
  { node: renderTechIcon(siPostgresql), title: "PostgreSQL", ariaLabel: "PostgreSQL" },
  { node: renderTechIcon(siDocker), title: "Docker", ariaLabel: "Docker" },
  { node: renderTechIcon(siLinux), title: "Linux", ariaLabel: "Linux" },
  { node: renderTechIcon(siGit), title: "Git", ariaLabel: "Git" },
  { node: renderTechIcon(siReact), title: "React", ariaLabel: "React" },
  { node: renderTechIcon(siTypescript), title: "TypeScript", ariaLabel: "TypeScript" },
  { node: renderTechIcon(siVite), title: "Vite", ariaLabel: "Vite" },
  { node: renderTechIcon(siTailwindcss), title: "Tailwind CSS", ariaLabel: "Tailwind CSS" },
]
