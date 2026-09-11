import { persona } from "@/lib/persona"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { GithubMark as Github, LinkedinMark as Linkedin } from "@/components/icons"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: persona.github, label: "GitHub", icon: Github },
  { href: persona.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: `mailto:${persona.email}`, label: "Email", icon: Mail },
] as const

type Props = {
  className?: string
  iconClassName?: string
}

export function SocialLinks({ className, iconClassName }: Props) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {LINKS.map(({ href, label, icon: Icon }) => {
        const external = !href.startsWith("mailto:")
        return (
          <Button key={label} variant="ghost" size="icon" asChild>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              aria-label={label}
            >
              <Icon className={iconClassName} />
            </a>
          </Button>
        )
      })}
    </div>
  )
}
