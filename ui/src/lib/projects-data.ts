import { projects, type Project } from "@/lib/persona"
import type { ProjectDto, ProjectMedia } from "@/lib/project-dto"

/** Temporary test covers (Lorem Picsum seeds) until the backend serves real
 *  screenshot URLs. Swap these for API URLs — card code stays untouched. */
function picsumMedia(slug: string, label: string): ProjectMedia[] {
  return Array.from({ length: 5 }, (_, i) => ({
    url: `https://picsum.photos/seed/${slug}-${i + 1}/1280/720`,
    alt: { en: `${label} preview ${i + 1} (test image)` },
    kind: "image" as const,
  }))
}

/**
 * Static adapter: shapes today's hand-maintained data as backend DTOs.
 * Card components consume only `ProjectDto` — when the API lands, replace
 * this module's body with `fetch` (+ static fallback on error) and nothing
 * downstream changes.
 */
export type ProjectView = {
  dto: ProjectDto
  /** Local presentation fallback until the backend serves media URLs. */
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
          media: picsumMedia(project.slug, project.name.en),
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
