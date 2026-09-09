import { afterEach, describe, expect, it, vi } from "vitest"
import {
  apiBase,
  fallbackGradient,
  fallbackIcon,
  isValidProjectDto,
  resolveCoverUrl,
  toProjectView,
} from "@/lib/projects-api"
import type { ProjectDto } from "@/lib/project-dto"

afterEach(() => vi.unstubAllEnvs())

describe("apiBase", () => {
  it("defaults to local api", () => {
    vi.stubEnv("VITE_API_URL", "")
    expect(apiBase()).toBe("http://localhost:8080")
  })
  it("trims trailing slash", () => {
    vi.stubEnv("VITE_API_URL", "https://api.example.com/")
    expect(apiBase()).toBe("https://api.example.com")
  })
})

const minimalDto = (overrides: Partial<ProjectDto> = {}): ProjectDto => ({
  slug: "alpha",
  name: { en: "Alpha" },
  tagline: { en: "Tag" },
  status: "shipped",
  role: "solo",
  kind: "personal",
  period: { start: "2024-01" },
  stack: ["TS"],
  repos: [{ label: "repo", url: "https://example.com" }],
  links: {},
  highlights: { en: ["hi"] },
  metrics: [],
  cover: null,
  featured: false,
  displayOrder: 0,
  ...overrides,
})

describe("isValidProjectDto", () => {
  it("accepts minimal valid dto", () => {
    expect(isValidProjectDto(minimalDto())).toBe(true)
  })
  it("rejects missing slug or name", () => {
    expect(isValidProjectDto({ ...minimalDto(), slug: "" })).toBe(false)
    expect(isValidProjectDto({ ...minimalDto(), name: {} as unknown as ProjectDto["name"] })).toBe(false)
    expect(isValidProjectDto(null)).toBe(false)
  })
})

describe("fallback hashing", () => {
  it("is deterministic per slug", () => {
    expect(fallbackIcon("alpha")).toBe(fallbackIcon("alpha"))
    expect(fallbackGradient("alpha")).toBe(fallbackGradient("alpha"))
  })
  it("covers different slugs", () => {
    const icons = new Set(["a", "b", "c", "d"].map(fallbackIcon))
    expect(icons.size).toBeGreaterThan(1)
  })
})

describe("resolveCoverUrl", () => {
  it("prefixes relative api cover with base", () => {
    expect(resolveCoverUrl("/api/projects/alpha/cover")).toBe(
      "http://localhost:8080/api/projects/alpha/cover"
    )
  })
  it("keeps absolute https cover", () => {
    expect(resolveCoverUrl("https://cdn.example.com/cover.png")).toBe(
      "https://cdn.example.com/cover.png"
    )
  })
})

describe("toProjectView", () => {
  it("resolves cover and assigns fallback visuals", () => {
    const dto = minimalDto({
      cover: { url: "/api/projects/alpha/cover", alt: { en: "Board" }, kind: "image" },
    })
    const view = toProjectView(dto)
    expect(view.dto.cover?.url).toBe("http://localhost:8080/api/projects/alpha/cover")
    expect(view.icon).toBeTruthy()
    expect(view.gradient).toBeTruthy()
  })
  it("keeps null cover", () => {
    expect(toProjectView(minimalDto()).dto.cover).toBeNull()
  })
})
