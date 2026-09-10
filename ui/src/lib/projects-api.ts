import type { ProjectDto } from "@/lib/project-dto"
import type { ProjectView } from "@/lib/projects-data"
import { isSafeUrl } from "@/lib/project-dto"

/**
 * Base URL of the API (no trailing slash). Empty means same-origin:
 * requests go to `/api/...` on the serving host (nginx proxy in prod,
 * vite dev-proxy locally). Set VITE_API_URL for a direct absolute URL.
 */
export function apiBase(): string {
  const env = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
  if (env) return env.replace(/\/$/, "")
  return ""
}

const FALLBACK_ICONS: ProjectView["icon"][] = ["webhook", "calendar", "book", "cloud"]
const FALLBACK_GRADIENTS: string[] = [
  "from-[var(--grad-portfolio-from)] via-[var(--grad-portfolio-via)] to-transparent",
  "from-[var(--grad-campus-from)] via-[var(--grad-campus-via)] to-transparent",
  "from-[var(--grad-libri-from)] via-[var(--grad-libri-via)] to-transparent",
  "from-[var(--grad-meteo-from)] via-[var(--grad-meteo-via)] to-transparent",
]

function hashSlug(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return h
}

export function fallbackIcon(slug: string): ProjectView["icon"] {
  return FALLBACK_ICONS[hashSlug(slug) % FALLBACK_ICONS.length]
}

export function fallbackGradient(slug: string): string {
  return FALLBACK_GRADIENTS[hashSlug(slug) % FALLBACK_GRADIENTS.length]
}

/** Turn a (possibly relative) cover URL from the API into an absolute one. */
export function resolveCoverUrl(url: string): string {
  if (!isSafeUrl(url)) return url
  if (url.startsWith("/")) return `${apiBase()}${url}`
  return url
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function isValidProjectDto(value: unknown): value is ProjectDto {
  if (!isRecord(value)) return false
  if (typeof value.slug !== "string" || value.slug.length === 0) return false
  if (typeof value.status !== "string") return false
  if (typeof value.kind !== "string") return false
  if (!isRecord(value.name) || typeof (value.name as Record<string, unknown>).en !== "string") return false
  return true
}

export function toProjectView(dto: ProjectDto): ProjectView {
  const cover = dto.cover !== null ? { ...dto.cover, url: resolveCoverUrl(dto.cover.url) } : null
  return {
    dto: { ...dto, cover },
    icon: fallbackIcon(dto.slug),
    gradient: fallbackGradient(dto.slug),
  }
}

export async function fetchProjectDtos(signal?: AbortSignal): Promise<ProjectDto[]> {
  const res = await fetch(`${apiBase()}/api/projects`, { signal })
  if (!res.ok) throw new Error(`GET /api/projects failed: ${res.status}`)
  const data: unknown = await res.json()
  if (!Array.isArray(data)) throw new Error("Expected array from /api/projects")
  const valid = data.filter(isValidProjectDto)
  if (valid.length === 0 && data.length > 0) throw new Error("No valid ProjectDto in response")
  return valid
}
