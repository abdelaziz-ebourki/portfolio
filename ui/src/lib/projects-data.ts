import { projects, type Project } from "@/lib/persona"
import type { ProjectCover, ProjectDto } from "@/lib/project-dto"

/** Temporary test cover (Lorem Picsum seed) until the backend serves the real
 *  screenshot URL. Swap this for the API URL — card code stays untouched. */
function picsumCover(slug: string, label: string): ProjectCover {
  return {
    url: `https://picsum.photos/seed/${slug}/1280/720`,
    alt: { en: `${label} preview (test image)` },
    kind: "image" as const,
  }
}

/**
 * Static adapter: shapes today's hand-maintained data as backend DTOs.
 * Card components consume only `ProjectDto` — when the API lands, replace
 * this module's body with `fetch` (+ static fallback on error) and nothing
 * downstream changes.
 */
export type ProjectView = {
  dto: ProjectDto
  /** Local presentation fallback until the backend serves the cover URL. */
  icon: Project["icon"]
  gradient: string
}

export function getProjectViews(): ProjectView[] {
  return projects
    .map(
      (project, index): ProjectView => ({
        dto: {
          slug: project.slug,
          name: project.name,
          tagline: project.tagline,
          status: project.status,
          role: project.role,
          teamSize: project.teamSize,
          kind: project.kind,
          period: project.period,
          stack: project.stack,
          repos: project.repos,
          links: project.links,
          highlights: project.highlights,
          metrics: project.metrics,
          cover: picsumCover(project.slug, project.name.en),
          featured: project.featured ?? false,
          displayOrder: index,
        },
        icon: project.icon,
        gradient: project.gradient,
      })
    )
    .sort(
      (a, b) =>
        Number(b.dto.featured) - Number(a.dto.featured) ||
        a.dto.displayOrder - b.dto.displayOrder
    )
}
