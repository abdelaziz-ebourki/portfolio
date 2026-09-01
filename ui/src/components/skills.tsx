import { skillGroups } from "@/lib/persona"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { SectionHeading } from "@/components/section-heading"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Braces, Database, LayoutPanelTop, Server } from "lucide-react"

const groupIcons = [Braces, Server, LayoutPanelTop, Database]

export function Skills() {
  const { t } = useI18n()

  return (
    <section id="skills" className="scroll-mt-20 py-24">
      <SectionHeading eyebrow={ui.skills.subtitle} title={ui.skills.title} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, index) => {
          const Icon = groupIcons[index % groupIcons.length]
          return (
            <Card
              key={group.label.en}
              className="group bg-card/60 transition-colors hover:border-foreground/25"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-none border border-border bg-muted/50 transition-colors group-hover:text-primary">
                    <Icon className="size-4.5" />
                  </div>
                  <CardTitle className="text-base">{t(group.label)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Badge key={item} variant="secondary" className="font-normal">
                    {item}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
