import { useState, type FormEvent } from "react"
import { persona } from "@/lib/persona"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail, Send } from "lucide-react"
import { GithubMark as Github, LinkedinMark as Linkedin } from "@/components/icons"

type FormState = "idle" | "sending" | "sent"

export function Contact() {
  const { t } = useI18n()
  const [state, setState] = useState<FormState>("idle")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state !== "idle") return
    setState("sending")
    window.setTimeout(() => setState("sent"), 900)
  }

  return (
    <section id="contact" className="scroll-mt-20 py-24">
      <SectionHeading eyebrow={ui.contact.subtitle} title={ui.contact.title} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>{t(ui.contact.title)}</CardTitle>
            <CardDescription>{t(ui.contact.subtitle)}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t(ui.contact.nameLabel)}</Label>
                  <Input id="name" name="name" required placeholder={t(ui.contact.namePlaceholder)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t(ui.contact.emailLabel)}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={t(ui.contact.emailPlaceholder)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">{t(ui.contact.messageLabel)}</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder={t(ui.contact.messagePlaceholder)}
                  className="resize-none"
                />
              </div>
              <Button type="submit" disabled={state === "sending"} className="w-fit gap-2">
                <Send className="size-4" />
                {state === "idle" && t(ui.contact.send)}
                {state === "sending" && t(ui.contact.sending)}
                {state === "sent" && t(ui.contact.sent)}
              </Button>
              {state === "sent" && (
                <p className="text-sm text-muted-foreground">{t(ui.contact.sentHint)}</p>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t(ui.contact.orReach)}
          </h3>

          <a
            href={`mailto:${persona.email}`}
            className="group flex items-center gap-3 rounded-none border border-border bg-card/60 p-4 transition-colors hover:border-foreground/25"
          >
            <Mail className="size-4.5 text-muted-foreground transition-colors group-hover:text-primary" />
            <span className="truncate text-sm">{persona.email}</span>
          </a>

          <a
            href={persona.github}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-none border border-border bg-card/60 p-4 transition-colors hover:border-foreground/25"
          >
            <Github className="size-4.5 text-muted-foreground transition-colors group-hover:text-primary" />
            <span className="text-sm">github/{persona.initials.toLowerCase()}</span>
          </a>

          <a
            href={persona.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-none border border-border bg-card/60 p-4 transition-colors hover:border-foreground/25"
          >
            <Linkedin className="size-4.5 text-muted-foreground transition-colors group-hover:text-primary" />
            <span className="text-sm">in/{persona.initials.toLowerCase()}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
