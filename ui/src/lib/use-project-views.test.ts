import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useProjectViews } from "@/lib/use-project-views"
import * as api from "@/lib/projects-api"

afterEach(() => vi.restoreAllMocks())

const liveDto = {
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
}

describe("useProjectViews", () => {
  it("reports live source on successful fetch", async () => {
    vi.spyOn(api, "fetchProjectDtos").mockResolvedValue([liveDto] as never)
    const { result } = renderHook(() => useProjectViews())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.source).toBe("live")
    expect(result.current.views).toHaveLength(1)
    expect(result.current.views[0].dto.slug).toBe("alpha")
  })

  it("falls back with source=fallback on fetch failure", async () => {
    vi.spyOn(api, "fetchProjectDtos").mockRejectedValue(new Error("down"))
    const { result } = renderHook(() => useProjectViews())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.source).toBe("fallback")
    expect(result.current.views.length).toBeGreaterThan(0)
  })

  it("retries the live fetch after a fallback", async () => {
    const fetch = vi.spyOn(api, "fetchProjectDtos")
    fetch.mockRejectedValueOnce(new Error("down"))
    fetch.mockResolvedValue([liveDto] as never)
    const { result } = renderHook(() => useProjectViews())

    await waitFor(() => expect(result.current.source).toBe("fallback"))
    await act(async () => result.current.retry())
    await waitFor(() => expect(result.current.source).toBe("live"))
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
