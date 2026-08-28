// fallow-ignore-file unused-file -- hook kept for future view-triggered animation, intentionally not wired yet
import { useEffect, useRef, useState } from "react"

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

type Options = {
  speed?: number
  initialDelay?: number
  startOnVisible?: boolean
  enabled?: boolean
}

export function useTypewriterOnVisible(text: string, options?: Options) {
  const {
    speed = 22,
    initialDelay = 80,
    startOnVisible = true,
    enabled = true,
  } = options ?? {}

  const ref = useRef<HTMLSpanElement>(null)

  // SSR-safe initial state: assume no reduced motion on server; sync in effects
  const [isVisible, setIsVisible] = useState(() => !startOnVisible)
  const [output, setOutput] = useState(() => {
    if (!enabled || !startOnVisible) return text
    return ""
  })
  const [isDone, setIsDone] = useState(() => {
    if (!enabled || !startOnVisible) return true
    return text.length === 0
  })

  // sync reduced-motion after mount (avoids hydration mismatch)
  useEffect(() => {
    if (prefersReducedMotion()) {
      setOutput(text)
      setIsDone(true)
      setIsVisible(true)
    }
  }, [text])

  // reset when text / mode changes
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      setOutput(text)
      setIsDone(true)
      setIsVisible(true)
      return
    }
    if (!startOnVisible) {
      setOutput(text)
      setIsDone(true)
      return
    }
    setOutput("")
    setIsDone(text.length === 0)
    setIsVisible(false)
  }, [text, startOnVisible, enabled])

  // observe visibility – re-create when text resets (fixes disconnected observer bug)
  // fallow-ignore-next-line complexity -- visibility observer setup requires branching
  useEffect(() => {
    if (!startOnVisible || !enabled || prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      // fallow-ignore-next-line complexity -- observer callback is inherently branching
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [startOnVisible, enabled, text, isVisible])

  // typing
  // fallow-ignore-next-line complexity -- typing effect requires multiple guards
  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!enabled) return
    if (!startOnVisible) return
    if (startOnVisible && !isVisible) return
    if (text.length === 0) {
      setOutput("")
      setIsDone(true)
      return
    }

    setIsDone(false)
    let cancelled = false
    let timeout: number | undefined
    let index = 0

    // fallow-ignore-next-line complexity -- typing loop requires branches for cancel/index
    const start = () => {
      if (cancelled) return
      if (index < text.length) {
        setOutput(text.slice(0, index + 1))
        index += 1
        if (index < text.length) {
          timeout = window.setTimeout(start, speed)
        } else {
          setIsDone(true)
        }
      }
    }

    timeout = window.setTimeout(start, initialDelay)

    return () => {
      cancelled = true
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [text, speed, initialDelay, startOnVisible, isVisible, enabled])

  // reduced motion toggle mid-flight
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return
    const m = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => {
      if (m.matches) {
        setOutput(text)
        setIsDone(true)
        setIsVisible(true)
      }
    }
    if (typeof m.addEventListener === "function") {
      m.addEventListener("change", onChange)
      return () => m.removeEventListener("change", onChange)
    }
    // Safari < 16 fallback
    // eslint-disable-next-line deprecation/deprecation
    m.addListener(onChange)
    // eslint-disable-next-line deprecation/deprecation
    return () => m.removeListener(onChange)
  }, [text])

  return { output, isDone, ref, isVisible }
}
