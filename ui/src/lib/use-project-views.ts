import { useEffect, useState } from "react"
import { getProjectViews, type ProjectView } from "@/lib/projects-data"
import { fetchProjectDtos, toProjectView } from "@/lib/projects-api"

export type UseProjectViewsResult = {
  views: ProjectView[]
  loading: boolean
  source: "live" | "fallback"
  retry: () => void
}

/** Live fetch with clearly-labelled static fallback. Abort-safe. */
export function useProjectViews(): UseProjectViewsResult {
  const [views, setViews] = useState<ProjectView[] | null>(null)
  const [source, setSource] = useState<"live" | "fallback">("live")
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let alive = true

    async function load() {
      try {
        const dtos = await fetchProjectDtos(controller.signal)
        if (!alive || controller.signal.aborted) return
        const mapped = dtos.map(toProjectView).sort(
          (a, b) =>
            Number(b.dto.featured) - Number(a.dto.featured) ||
            a.dto.displayOrder - b.dto.displayOrder
        )
        setViews(mapped.length > 0 ? mapped : getProjectViews())
        setSource(mapped.length > 0 ? "live" : "fallback")
        if (mapped.length === 0) console.warn("[projects] API returned empty array, using fallback")
      } catch (e) {
        if (controller.signal.aborted) return
        if (!alive) return
        console.warn("[projects] live fetch failed, using fallback", e)
        setViews(getProjectViews())
        setSource("fallback")
      }
    }

    void load()
    return () => {
      alive = false
      controller.abort()
    }
  }, [attempt])

  const retry = () => {
    setViews(null)
    setSource("live")
    setAttempt((n) => n + 1)
  }

  if (views === null) return { views: [], loading: true, source, retry }
  return { views, loading: false, source, retry }
}
