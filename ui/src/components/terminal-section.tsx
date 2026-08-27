import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { persona } from "@/lib/persona"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { TAB_COMMANDS } from "@/lib/terminal-commands"
import { SectionHeading } from "@/components/section-heading"
import { TerminalSidePanel } from "@/components/terminal-side-panel"
import { TerminalWindow } from "@/components/terminal-window"

type LineKind = "input" | "output" | "error" | "success"

type Line = {
  id: number
  kind: LineKind
  content: string
}

let lineId = 0
const nextId = () => ++lineId

const lineStyles: Record<LineKind, string> = {
  input: "text-foreground",
  output: "text-muted-foreground",
  error: "text-destructive",
  success: "text-primary crt-glow",
}

export function TerminalSection() {
  const { t } = useI18n()
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [value, setValue] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)

  const [lines, setLines] = useState<Line[]>(() => [
    { id: nextId(), kind: "output", content: "alexmoreau.dev [version 2.0.0]" },
    { id: nextId(), kind: "success", content: t(ui.terminal.hint) },
  ])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const respond = useCallback((output: string[], kind: LineKind = "output") => {
    setLines((prev) => [
      ...prev,
      ...output.map((content) => ({ id: nextId(), kind, content })),
    ])
  }, [])

  const run = useCallback((raw: string) => {
    const input = raw.trim()
    setLines((prev) => [...prev, { id: nextId(), kind: "input", content: raw }])

    if (!input) return
    setHistory((prev) => [...prev, input])
    setHistoryIndex(null)

    const [command, ...args] = input.toLowerCase().split(/\s+/)

    switch (command) {
      case "help":
        respond(t(ui.terminal.help).split("\n"))
        break
      case "whoami":
        respond([`${persona.name} — ${t(persona.role)}`, t(persona.tagline)])
        break
      case "about":
        respond(t(ui.terminal.about).split("\n"))
        break
      case "skills":
        respond(t(ui.terminal.skills).split("\n"))
        break
      case "projects":
        respond(t(ui.terminal.projects).split("\n"))
        break
      case "experience":
        respond(t(ui.terminal.experience).split("\n"))
        break
      case "education":
        respond(t(ui.terminal.education).split("\n"))
        break
      case "contact":
        respond([`email    ${persona.email}`, `github   github.com/${persona.github.split("/").pop()}`, `linkedin in/${persona.linkedin.split("/").pop()}`])
        break
      case "ls":
        respond([t(ui.terminal.ls)])
        break
      case "clear":
        setLines([])
        break
      case "sudo":
        if (args[0] === "hire-me") {
          respond([t(ui.terminal.sudoGranted), persona.email], "success")
        } else {
          respond(["usage: sudo hire-me"], "error")
        }
        break
      case "rm":
        respond([t(ui.terminal.rmDenied)], "error")
        break
      case "cat":
        respond([t(ui.terminal.catHint)], "error")
        break
      default:
        respond([`${t(ui.terminal.unknown)} ${command}`, t(ui.terminal.hint)], "error")
    }
  }, [t, respond])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    run(value)
    setValue("")
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (history.length === 0) return
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setValue(history[next])
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      if (historyIndex === null) return
      const next = historyIndex + 1
      if (next >= history.length) {
        setHistoryIndex(null)
        setValue("")
      } else {
        setHistoryIndex(next)
        setValue(history[next])
      }
    } else if (event.key === "Tab") {
      event.preventDefault()
      const match = TAB_COMMANDS.find((candidate) => candidate.startsWith(value.trim().toLowerCase()))
      if (match) setValue(`${match} `)
    }
  }

  const prompt = (
    <span className="shrink-0 select-none text-primary" aria-hidden>
      guest@alexmoreau:<span className="text-muted-foreground">~</span>$
    </span>
  )

  return (
    <section id="terminal" className="scroll-mt-20 py-24">
      <SectionHeading eyebrow={ui.terminal.subtitle} title={ui.terminal.title} />

      <div className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr] lg:items-stretch">
        <TerminalWindow title="guest@alexmoreau: ~" className="flex h-full w-full max-w-none flex-col">
        <div
          className="flex min-h-0 flex-1 flex-col cursor-text font-mono text-sm leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          <div
            ref={scrollRef}
            className="min-h-[20rem] max-h-80 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            aria-live="polite"
            aria-label={t(ui.terminal.ariaLabel)}
          >
            {lines.map((line) => (
              <p key={line.id} className={`${lineStyles[line.kind]} min-w-0 overflow-x-hidden`}>
                {line.kind === "input" && (
                  <span className="mr-2 select-none text-primary" aria-hidden>
                    $
                  </span>
                )}
                <span className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                  {line.content}
                </span>
              </p>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
            {prompt}
            <div
              className="relative flex min-w-0 flex-1 items-center"
              onClick={() => inputRef.current?.focus()}
            >
              <input
                ref={inputRef}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 h-full w-full bg-transparent opacity-0 caret-transparent outline-none"
                aria-label={t(ui.terminal.ariaLabel)}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <span className="pointer-events-none flex min-w-0 flex-1 items-center">
                <span className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-foreground">
                  {value}
                </span>
                <span
                  aria-hidden
                  className="ml-1 inline-block h-3.5 w-1.5 shrink-0 translate-y-0.5 animate-blink bg-primary"
                />
              </span>
            </div>
          </form>
        </div>
        </TerminalWindow>
        <TerminalSidePanel onRun={run} />
      </div>
    </section>
  )
}
