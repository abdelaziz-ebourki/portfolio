import { persona } from "@/lib/persona"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowUp, Mail } from "lucide-react"
import { GithubMark as Github, LinkedinMark as Linkedin } from "@/components/icons"

export function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-1">
          {[
            { href: persona.github, label: "GitHub", icon: Github },
            { href: persona.linkedin, label: "LinkedIn", icon: Linkedin },
            { href: `mailto:${persona.email}`, label: "Email", icon: Mail },
          ].map(({ href, label, icon: Icon }) => (
            <Button key={label} variant="ghost" size="icon" asChild>
              <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon className="size-4" />
              </a>
            </Button>
          ))}
        </div>

        <Separator className="max-w-xs" />

        <p className="text-center text-sm text-muted-foreground">
          © {year} {persona.name} · {t(persona.location)}
          <span className="mt-1 block">{t(ui.footer.tagline)}</span>
          <span className="mt-1 block font-mono text-xs opacity-70">
            React · TypeScript · Tailwind CSS · shadcn/ui
          </span>
        </p>

        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <a href="#top">
            <ArrowUp className="size-4" />
            {t(ui.footer.backToTop)}
          </a>
        </Button>
      </div>
    </footer>
  )
}
