import { useState, type FormEvent } from "react"
import { persona } from "@/lib/persona"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { postContact } from "@/lib/contact-api"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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

type FormState = "idle" | "sending" | "sent" | "error"

export function Contact() {
  const { t } = useI18n()
  const [state, setState] = useState<FormState>("idle")
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})
  const [rateLimited, setRateLimited] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === "sending" || state === "sent") return
    const form = new FormData(event.currentTarget)
    setState("sending")
    setFieldErrors({})
    setRateLimited(false)
    const result = await postContact({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? ""),
    })
    if (result.ok) {
      setState("sent")
      return
    }
    if (result.error.kind === "validation") {
      const invalid: Record<string, boolean> = {}
      for (const field of Object.keys(result.error.fields)) invalid[field] = true
      setFieldErrors(invalid)
      setState("idle")
      return
    }
    setRateLimited(result.error.kind === "rate-limited")
    setState("error")
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
            <form onSubmit={(e) => void handleSubmit(e)}>
              <FieldGroup className="gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={fieldErrors.name}>
                    <FieldLabel htmlFor="name">{t(ui.contact.nameLabel)}</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder={t(ui.contact.namePlaceholder)}
                      aria-invalid={fieldErrors.name}
                    />
                    {fieldErrors.name && <FieldError>{t(ui.contact.invalidField)}</FieldError>}
                  </Field>
                  <Field data-invalid={fieldErrors.email}>
                    <FieldLabel htmlFor="email">{t(ui.contact.emailLabel)}</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder={t(ui.contact.emailPlaceholder)}
                      aria-invalid={fieldErrors.email}
                    />
                    {fieldErrors.email && <FieldError>{t(ui.contact.invalidField)}</FieldError>}
                  </Field>
                </div>
                <Field data-invalid={fieldErrors.message}>
                  <FieldLabel htmlFor="message">{t(ui.contact.messageLabel)}</FieldLabel>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder={t(ui.contact.messagePlaceholder)}
                    className="resize-none"
                    aria-invalid={fieldErrors.message}
                  />
                  {fieldErrors.message && <FieldError>{t(ui.contact.invalidField)}</FieldError>}
                </Field>
                {/* Honeypot — bots fill it, humans never see it. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="company">Company</label>
                  <Input id="company" name="company" tabIndex={-1} autoComplete="off" />
                </div>
                <Button type="submit" disabled={state === "sending" || state === "sent"} className="w-fit">
                  <Send data-icon="inline-start" />
                  {(state === "idle" || state === "error") && t(ui.contact.send)}
                  {state === "sending" && t(ui.contact.sending)}
                  {state === "sent" && t(ui.contact.sent)}
                </Button>
                {state === "sent" && (
                  <p className="text-sm text-muted-foreground">{t(ui.contact.sentHint)}</p>
                )}
                {state === "error" && (
                  <p className="text-sm text-destructive">
                    {rateLimited ? t(ui.contact.rateLimited) : t(ui.contact.sendError)}
                  </p>
                )}
              </FieldGroup>
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
            <span className="text-sm">github/{persona.github.split("/").pop()}</span>
          </a>

          <a
            href={persona.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-none border border-border bg-card/60 p-4 transition-colors hover:border-foreground/25"
          >
            <Linkedin className="size-4.5 text-muted-foreground transition-colors group-hover:text-primary" />
            <span className="text-sm">in/{persona.linkedin.split("/").pop()}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
