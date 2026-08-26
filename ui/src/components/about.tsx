import { persona } from "@/lib/persona"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { SectionHeading } from "@/components/section-heading"
import { TerminalWindow } from "@/components/terminal-window"

export function About() {
  const { t } = useI18n()

  return (
    <section id="about" className="scroll-mt-20 py-24">
      <SectionHeading eyebrow={ui.about.subtitle} title={ui.about.title} />

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-4 text-muted-foreground">
          {ui.about.paragraphs.map((paragraph) => (
            <p
              key={paragraph.en}
              className="leading-relaxed first:text-lg first:text-foreground/90"
            >
              {t(paragraph)}
            </p>
          ))}
        </div>

        <TerminalWindow title="~/values.ts" className="h-fit">
          <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed">
            <code>
              <span className="text-fuchsia-600 dark:text-fuchsia-400">const</span>{" "}
              <span className="text-sky-700 dark:text-sky-300">alex</span>{" "}
              <span className="text-muted-foreground">=</span>{" "}
              <span className="text-muted-foreground">{"{"}</span>
              {"\n  "}
              <span className="text-sky-700 dark:text-sky-300">values</span>
              <span className="text-muted-foreground">: [</span>
              {ui.about.values.map((value) => (
                <span key={value.id}>
                  {"\n    "}
                  <span className="text-muted-foreground">{"{ "}</span>
                  <span className="text-sky-700 dark:text-sky-300">id</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-emerald-700 dark:text-emerald-400">"{value.id}"</span>
                  <span className="text-muted-foreground">, </span>
                  <span className="text-sky-700 dark:text-sky-300">label</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    "{t(value.label)}"
                  </span>
                  <span className="text-muted-foreground">,</span>
                  {"\n      "}
                  <span className="text-sky-700 dark:text-sky-300">detail</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    "{t(value.detail)}"
                  </span>
                  <span className="text-muted-foreground">{" },"}</span>
                </span>
              ))}
              {"\n  "}
              <span className="text-muted-foreground">],</span>
              {"\n"}
              <span className="text-muted-foreground">{"}"}</span>
              <span
                aria-hidden
                className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-primary"
              />
            </code>
          </pre>
        </TerminalWindow>
      </div>

      <p className="mt-10 font-mono text-sm text-muted-foreground">
        {"// "}
        {persona.name} · {t(persona.role)} · {t(persona.location)}
      </p>
    </section>
  )
}
