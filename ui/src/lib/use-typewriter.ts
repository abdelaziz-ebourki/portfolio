import { useEffect, useState } from "react"

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function useTypewriter(
  text: string,
  options?: { speed?: number; startDelay?: number; enabled?: boolean }
) {
  const { speed = 65, startDelay = 500, enabled = true } = options ?? {}
  const [output, setOutput] = useState(() =>
    !enabled || prefersReducedMotion() ? text : ""
  )

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return

    let index = 0
    let interval: number | undefined
    const timeout = window.setTimeout(() => {
      index = 1
      setOutput(text.slice(0, 1))
      interval = window.setInterval(() => {
        index += 1
        setOutput(text.slice(0, index))
        if (index >= text.length && interval !== undefined) {
          window.clearInterval(interval)
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(timeout)
      if (interval !== undefined) window.clearInterval(interval)
    }
  }, [text, speed, startDelay, enabled])

  return {
    output,
    isTyping: enabled && !prefersReducedMotion() && output.length < text.length,
  }
}
