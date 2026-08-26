import { experience } from "@/lib/persona"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { SectionHeading } from "@/components/section-heading"
import { Badge } from "@/components/ui/badge"

export function Experience() {
  const { t } = useI18n()

  return (
    <section id="experience" className="scroll-mt-20 py-24">
      <SectionHeading eyebrow={ui.experience.subtitle} title={ui.experience.title} />

      <div className="relative flex flex-col gap-10 before:absolute before:inset-y-2 before:left-[7px] before:w-px before:bg-border sm:before:left-[91px]">
        {experience.map((item) => (
          <article
            key={item.company}
            className="relative grid gap-4 pl-8 sm:grid-cols-[80px_1fr] sm:gap-8 sm:pl-0"
          >
            <span
              aria-hidden
              className="absolute left-0 top-2 size-[15px] rounded-full border-2 border-border bg-background sm:left-[84px] sm:top-1.5 sm:size-3.5"
            />

            <p className="font-mono text-sm text-muted-foreground sm:text-right">
              {item.period}
            </p>

            <div className="flex flex-col gap-3">
              <div>
                <h3 className="font-medium leading-snug">{t(item.role)}</h3>
                <p className="text-sm text-muted-foreground">{item.company}</p>
              </div>
              <p className="text-sm text-muted-foreground">{t(item.summary)}</p>
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm marker:text-muted-foreground/50">
                {item.highlights.map((highlight) => (
                  <li key={highlight.en}>{t(highlight)}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.stack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="font-normal">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
