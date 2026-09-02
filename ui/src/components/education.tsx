import { education } from "@/lib/persona"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { SectionHeading } from "@/components/section-heading"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

export function Education() {
  const { t } = useI18n()

  return (
    <section id="education" className="scroll-mt-20 py-24">
      <SectionHeading eyebrow={ui.education.subtitle} title={ui.education.title} />

      <div className="grid gap-5 md:grid-cols-2">
        {education.map((item) => (
          <Card key={item.period} className="bg-card/60">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-11 items-center justify-center rounded-none border border-border bg-muted/50">
                  <GraduationCap className="size-5 text-primary" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge
                    variant={item.status === "ongoing" ? "default" : "secondary"}
                    className={cn(item.status === "ongoing" && "gap-1.5", "rounded-full")}
                  >
                    {item.status === "ongoing" && (
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
                      </span>
                    )}
                    {t(item.statusLabel)}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {item.period}
                  </span>
                </div>
              </div>
              <CardTitle className="pt-3 text-lg leading-snug">{t(item.degree)}</CardTitle>
              <CardDescription>{item.school}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(item.detail)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
