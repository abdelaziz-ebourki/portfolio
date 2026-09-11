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

/**
 * Turn a (possibly relative) cover URL from the API into an absolute one.
 * Unsafe schemes are dropped to "" so they never linger in state —
 * rendering re-checks, but the DTO must not retain a javascript: URL.
 */
export function resolveCoverUrl(url: string): string {
  if (!isSafeUrl(url)) return ""
  if (url.startsWith("/")) return `${apiBase()}${url}`
  return url
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

const STATUSES = new Set(["shipped", "in-progress", "maintained", "archived"])
const KINDS = new Set(["personal", "academic", "client", "oss"])

export function isValidProjectDto(value: unknown): value is ProjectDto {
  if (!isRecord(value)) return false
  if (typeof value.slug !== "string" || value.slug.length === 0) return false
  if (typeof value.status !== "string" || !STATUSES.has(value.status)) return false
  if (typeof value.kind !== "string" || !KINDS.has(value.kind)) return false
  const en = (value.name as Record<string, unknown> | undefined)?.en
  if (!isRecord(value.name) || typeof en !== "string" || en.length === 0) return false
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

/** Fetch timeout so a hung API surfaces the fallback instead of skeletons forever. */
export const PROJECTS_TIMEOUT_MS = 10_000

export function withTimeout(signal?: AbortSignal, ms = PROJECTS_TIMEOUT_MS): AbortSignal {
  const combined = AbortSignal.timeout(ms)
  if (!signal) return combined
  if (signal.aborted) return signal
  const controller = new AbortController()
  const onAbort = () => controller.abort(signal.reason)
  signal.addEventListener("abort", onAbort, { once: true })
  combined.addEventListener("abort", onAbort, { once: true })
  return controller.signal
}

export async function fetchProjectDtos(signal?: AbortSignal): Promise<ProjectDto[]> {
  const res = await fetch(`${apiBase()}/api/projects`, { signal: withTimeout(signal) })
  if (!res.ok) throw new Error(`GET /api/projects failed: ${res.status}`)
  if (res.status === 204) return []
  const data: unknown = await res.json()
  if (!Array.isArray(data)) throw new Error("Expected array from /api/projects")
  const valid = data.filter(isValidProjectDto)
  if (valid.length === 0 && data.length > 0) throw new Error("No valid ProjectDto in response")
  return valid
}
