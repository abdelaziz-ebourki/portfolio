import { persona } from "@/lib/persona"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { useTypewriter } from "@/lib/use-typewriter"
import { Button } from "@/components/ui/button"
import { ArrowDown, Mail } from "lucide-react"
import { GithubMark as Github, LinkedinMark as Linkedin } from "@/components/icons"

export function Hero() {
  const { t } = useI18n()
  const typed = useTypewriter("whoami", { speed: 90, startDelay: 600 })

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,--alpha(var(--color-primary)/7%),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,black,transparent)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
        <div className="flex max-w-3xl flex-col gap-6">
          <div className="font-mono text-sm text-primary/80">
            <span className="text-muted-foreground">alex@dev:~$</span>{" "}
            {typed.output}
            {typed.isTyping && (
              <span
                aria-hidden
                className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-primary"
              />
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-balance crt-glow sm:text-5xl md:text-6xl">
            {persona.name}
            <span className="text-primary">_</span>
            <span
              aria-hidden
              className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.12em] animate-blink bg-primary"
            />
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground text-pretty">
            <span className="font-medium text-foreground">{t(persona.role)}</span>
            {" — "}
            {t(persona.tagline)}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg">
              <a href="#projects">{t(ui.hero.ctaProjects)}</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#contact">{t(ui.hero.ctaContact)}</a>
            </Button>
            <div className="ml-1 flex items-center gap-1">
              {[
                { href: persona.github, label: "GitHub", icon: Github },
                { href: persona.linkedin, label: "LinkedIn", icon: Linkedin },
                { href: `mailto:${persona.email}`, label: "Email", icon: Mail },
              ].map(({ href, label, icon: Icon }) => (
                <Button key={label} variant="ghost" size="icon" asChild>
                  <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                    <Icon className="size-4 transition-all hover:text-primary" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="group absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary sm:flex"
      >
        {t(ui.hero.scroll)}
        <ArrowDown className="size-4 animate-bounce" />
      </a>
    </section>
  )
}
