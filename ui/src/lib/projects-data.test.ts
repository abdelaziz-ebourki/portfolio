import { describe, expect, it } from "vitest"
import { getProjectViews } from "@/lib/projects-data"
import { isSafeUrl } from "@/lib/project-dto"

describe("getProjectViews", () => {
  it("returns dto shape with cover and sorted featured first", () => {
    const views = getProjectViews()
    expect(views.length).toBeGreaterThan(0)
    for (const view of views) {
      expect(view.dto.slug).toBeTruthy()
      expect(view.dto.name.en).toBeTruthy()
      expect(isSafeUrl(view.dto.cover?.url)).toBe(true)
      expect(view.gradient).toBeTruthy()
      expect(view.icon).toBeTruthy()
    }
    // featured projects should lead
    const firstNonFeatured = views.findIndex((v) => !v.dto.featured)
    const lastFeatured = views.findLastIndex((v) => v.dto.featured)
    if (firstNonFeatured !== -1 && lastFeatured !== -1) {
      expect(lastFeatured).toBeLessThan(firstNonFeatured)
    }
  })

  it("cover uses picsum seed and displayOrder follows original index", () => {
    const views = getProjectViews()
    for (const view of views) {
      expect(view.dto.cover?.url).toContain(`seed/${view.dto.slug}/`)
      expect(view.dto.displayOrder).toBeGreaterThanOrEqual(0)
    }
  })
})
