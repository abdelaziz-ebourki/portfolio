import { projects, type Project } from "@/lib/persona"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { SectionHeading } from "@/components/section-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  CalendarDays,
  Cloud,
  ExternalLink,
  Star,
  Webhook,
} from "lucide-react"
import { GithubMark as Github } from "@/components/icons"

const icons = {
  webhook: Webhook,
  calendar: CalendarDays,
  book: BookOpen,
  cloud: Cloud,
} as const

function projectHeaderClass(project: Project): string {
  if (project.featured) return cn("bg-linear-to-br", project.gradient)
  return "bg-muted/40"
}

function ProjectCard({ project }: { project: Project }) {
  const { t } = useI18n()
  const Icon = icons[project.icon]

  return (
    <Card className="group flex h-full flex-col overflow-hidden bg-card/60 transition-all hover:border-foreground/25 hover:shadow-lg">
      <div
        className={cn(
          "relative flex h-36 items-center justify-center border-b border-border",
          projectHeaderClass(project)
        )}
      >
        <Icon className="size-10 text-muted-foreground/70 transition-transform duration-300 group-hover:scale-110" />
        {project.featured && (
          <Badge className="absolute left-3 top-3 gap-1 rounded-full">
            <Star className="size-3" />
            {t(ui.projects.featured)}
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription>{t(project.description)}</CardDescription>
      </CardHeader>

      <CardContent className="mt-auto flex flex-wrap gap-1.5 pb-4">
        {project.stack.map((tech) => (
          <Badge key={tech} variant="outline" className="font-normal text-muted-foreground">
            {tech}
          </Badge>
        ))}
      </CardContent>

      <Separator />
      <CardFooter className="gap-2 py-3!">
        {project.repoUrl && (
          <Button asChild variant="ghost" size="sm">
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              <Github data-icon="inline-start" />
              {t(ui.projects.viewCode)}
            </a>
          </Button>
        )}
        {project.demoUrl && (
          <Button asChild variant="ghost" size="sm">
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              <ExternalLink data-icon="inline-start" />
              {t(ui.projects.liveDemo)}
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export function Projects() {
  const { t } = useI18n()

  return (
    <section id="projects" className="scroll-mt-20 py-24">
      <SectionHeading eyebrow={ui.projects.subtitle} title={ui.projects.title} />

      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="link" className="text-muted-foreground">
          <a href="https://github.com/alexmoreau-dev" target="_blank" rel="noreferrer">
            <Github data-icon="inline-start" />
            {t(ui.projects.moreOnGithub)}
          </a>
        </Button>
      </div>
    </section>
  )
}
