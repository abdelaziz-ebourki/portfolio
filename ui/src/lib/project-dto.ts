import type { Lang } from "@/lib/i18n"

/**
 * Contract for project data as served by the backend (`api/`, fed by
 * `.portfolio.json` manifests). The UI renders *only* this shape — it never
 * constructs GitHub URLs, guesses asset locations, or embeds demos.
 *
 * Until the API lands, static data is adapted into this type (see
 * `ui/src/lib/projects-data.ts`); swapping in `fetch` later must not touch
 * the card components.
 */

/** Localized map from the backend. Languages may be missing per field —
 *  the UI always falls back to English, then to an empty string. */
export type LocalizedMap = Partial<Record<Lang, string>>

export function resolveLocalized(
  map: LocalizedMap | undefined,
  lang: Lang
): string {
  const full: Record<Lang, string> = { en: "", fr: "", ar: "", ...map }
  return full[lang] || full.en
}

/** Localized string list (e.g. highlights). Resolved as a whole per language
 *  so bullets never mix languages within one list. */
export type LocalizedList = { en: string[] } & Partial<
  Record<Exclude<Lang, "en">, string[]>
>

export function resolveLocalizedList(
  list: LocalizedList | undefined,
  lang: Lang
): string[] {
  const full: Record<Lang, string[]> = { en: [], fr: [], ar: [], ...list }
  return full[lang].length > 0 ? full[lang] : full.en
}

export type ProjectStatus = "shipped" | "in-progress" | "maintained" | "archived"
export type ProjectRole = "solo" | "team"
export type ProjectKind = "personal" | "academic" | "client" | "oss"

export type ProjectRepo = {
  /** e.g. "api", "ui", "infra", "monorepo" */
  label: string
  url: string
}

export type ProjectCoverKind = "image" | "gif" | "video"

/** Single card hero: one screenshot/cover served by the API (assets fetched
 *  from the project repo), `null` when the project has no cover — the card
 *  then falls back to its icon gradient. */
export type ProjectCover = {
  /** Absolute URL served by the API (assets fetched from the project repo). */
  url: string
  alt: LocalizedMap
  kind: ProjectCoverKind
}

export type ProjectMetric = {
  label: LocalizedMap
  value: string
}

export type ProjectLinks = {
  /** Rendered as an external link — never embedded. */
  demo?: string
  docs?: string
  design?: string
  video?: string
}

export type ProjectPeriod = {
  /** "YYYY-MM", e.g. "2024-02". */
  start: string
  /** Omitted while the project is ongoing. */
  end?: string
}

/** Allowlist for backend-fed URLs rendered into `href`/`src`. Manifests
 *  arrive via webhooks, so only http(s) survives — `javascript:` and other
 *  schemes are dropped before render. */
export function isSafeUrl(url: string | undefined): url is string {
  if (!url) return false
  try {
    return ["http:", "https:"].includes(
      new URL(url, "https://portfolio.local").protocol
    )
  } catch {
    return false
  }
}

export type ProjectDto = {
  slug: string
  name: LocalizedMap
  tagline: LocalizedMap
  status: ProjectStatus
  role: ProjectRole
  teamSize?: number
  kind: ProjectKind
  period: ProjectPeriod
  stack: string[]
  repos: ProjectRepo[]
  links: ProjectLinks
  highlights: LocalizedList
  metrics: ProjectMetric[]
  /** Card hero cover (`null` = no cover, icon-gradient fallback). */
  cover: ProjectCover | null
  featured: boolean
  displayOrder: number
}
