import { useCallback, useMemo, useState } from "react"
import { type ProjectView } from "@/lib/projects-data"
import { useProjectViews } from "@/lib/use-project-views"
import { Skeleton } from "@/components/ui/skeleton"
import {
  isSafeUrl,
  resolveLocalized,
  resolveLocalizedList,
  type ProjectDto,
  type ProjectCover,
  type ProjectKind,
  type ProjectPeriod,
  type ProjectStatus,
} from "@/lib/project-dto"
import { ui } from "@/lib/content"
import { useI18n, type Lang, type Localized } from "@/lib/i18n"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  Cloud,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  Star,
  User,
  Users,
  Video,
  Webhook,
} from "lucide-react"
import { GithubMark as Github } from "@/components/icons"

const icons = {
  webhook: Webhook,
  calendar: CalendarDays,
  book: BookOpen,
  cloud: Cloud,
} as const

const kindIcons = {
  personal: User,
  academic: GraduationCap,
  client: Briefcase,
  oss: FolderGit2,
} as const

const statusVariants = {
  shipped: "default",
  "in-progress": "featured",
  maintained: "secondary",
  archived: "outline",
} as const

type Labels = {
  status: Record<ProjectStatus, string>
  kind: Record<ProjectKind, string>
}

function useProjectLabels(t: (value: Localized) => string): Labels {
  return useMemo(
    () => ({
      status: {
        shipped: t(ui.projects.statusShipped),
        "in-progress": t(ui.projects.statusInProgress),
        maintained: t(ui.projects.statusMaintained),
        archived: t(ui.projects.statusArchived),
      },
      kind: {
        personal: t(ui.projects.kindPersonal),
        academic: t(ui.projects.kindAcademic),
        client: t(ui.projects.kindClient),
        oss: t(ui.projects.kindOss),
      },
    }),
    [t]
  )
}

function formatMonth(value: string, lang: Lang): string {
  const date = new Date(`${value}-01T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(lang, { month: "short", year: "numeric" }).format(date)
}

function formatPeriod(period: ProjectPeriod, lang: Lang, present: string): string {
  const start = formatMonth(period.start, lang)
  if (!period.end) return `${start} – ${present}`
  return `${start} – ${formatMonth(period.end, lang)}`
}

function roleLabel(dto: ProjectDto, t: (value: Localized) => string): string {
  const base =
    dto.role === "team" ? t(ui.projects.roleTeam) : t(ui.projects.roleSolo)
  return dto.role === "team" && dto.teamSize ? `${base} · ${dto.teamSize}` : base
}

/** Null/unsafe/failed covers fall back to the icon gradient so a broken
 *  hero image never renders. The surviving cover feeds both the card hero
 *  and the lightbox. */
function useVisibleCover(dto: ProjectDto): [ProjectCover | null, (url: string) => void] {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  const markFailed = useCallback((url: string) => {
    setFailedUrl((prev) => (prev === url ? prev : url))
  }, [])

  const visible = useMemo(
    () =>
      dto.cover !== null && isSafeUrl(dto.cover.url) && failedUrl !== dto.cover.url
        ? dto.cover
        : null,
    [dto.cover, failedUrl]
  )
  return [visible, markFailed]
}

function SlideImage({
  item,
  lang,
  className = "aspect-video w-full object-cover",
  onError,
}: {
  item: ProjectCover
  lang: Lang
  className?: string
  onError?: (url: string) => void
}) {
  if (item.kind === "video") {
    return (
      <video
        src={item.url}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={(e) => void e.currentTarget.play()}
        onMouseLeave={(e) => e.currentTarget.pause()}
        onError={() => onError?.(item.url)}
        className={className}
      />
    )
  }
  return (
    <img
      src={item.url}
      alt={resolveLocalized(item.alt, lang)}
      loading="lazy"
      onError={() => onError?.(item.url)}
      className={className}
    />
  )
}

function CoverFallback({ view }: { view: ProjectView }) {
  const Icon = icons[view.icon]
  return (
    <div
      className={cn(
        "flex aspect-video w-full items-center justify-center bg-linear-to-br",
        view.gradient
      )}
    >
      <Icon className="size-10 text-muted-foreground/70" />
    </div>
  )
}

function Lightbox({
  dto,
  item,
  open,
  onClose,
  onFail,
}: {
  dto: ProjectDto
  item: ProjectCover
  open: boolean
  onClose: () => void
  onFail: (url: string) => void
}) {
  const { lang, t } = useI18n()

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent
        closeLabel={t(ui.projects.closeViewer)}
        className="gap-2 border-none bg-transparent p-0 shadow-none sm:max-w-4xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{resolveLocalized(dto.name, lang)}</DialogTitle>
          <DialogDescription>
            {resolveLocalized(dto.tagline, lang)}
          </DialogDescription>
        </DialogHeader>
        <SlideImage
          item={item}
          lang={lang}
          onError={onFail}
          className="max-h-[80dvh] w-full rounded-xl object-contain"
        />
      </DialogContent>
    </Dialog>
  )
}

function CoverBadges({ dto, labels }: { dto: ProjectDto; labels: Labels }) {
  const { t } = useI18n()
  return (
    <div className="absolute start-3 top-3 flex gap-1.5">
      {dto.featured && (
        <Badge variant="featured">
          <Star className="size-3" />
          {t(ui.projects.featured)}
        </Badge>
      )}
      <Badge variant={statusVariants[dto.status]}>{labels.status[dto.status]}</Badge>
    </div>
  )
}

function MetaRow({ dto, labels }: { dto: ProjectDto; labels: Labels }) {
  const { lang, t } = useI18n()
  const KindIcon = kindIcons[dto.kind]
  const RoleIcon = dto.role === "team" ? Users : User

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <RoleIcon className="size-3" />
        {roleLabel(dto, t)}
      </span>
      <span className="inline-flex items-center gap-1">
        <KindIcon className="size-3" />
        {labels.kind[dto.kind]}
      </span>
      <span className="inline-flex items-center gap-1">
        <CalendarDays className="size-3" />
        {formatPeriod(dto.period, lang, t(ui.projects.present))}
      </span>
    </p>
  )
}

function RepoButtons({ dto }: { dto: ProjectDto }) {
  const { t } = useI18n()
  const repos = dto.repos.filter((repo) => isSafeUrl(repo.url))
  if (repos.length === 0) return null
  if (repos.length === 1) {
    return (
      <Button asChild variant="ghost" size="sm">
        <a href={repos[0].url} target="_blank" rel="noreferrer noopener">
          <Github data-icon="inline-start" />
          {t(ui.projects.viewCode)}
        </a>
      </Button>
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Github data-icon="inline-start" />
          {t(ui.projects.viewCode)}
          <ChevronDown data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {repos.map((repo, i) => (
            <DropdownMenuItem key={`${repo.label}-${i}`} asChild>
              <a href={repo.url} target="_blank" rel="noreferrer noopener">
                {repo.label}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ExtraLinks({ dto }: { dto: ProjectDto }) {
  const { t } = useI18n()
  const links = [
    { id: "demo", url: dto.links.demo, label: t(ui.projects.liveDemo), Icon: ExternalLink },
    { id: "docs", url: dto.links.docs, label: t(ui.projects.docs), Icon: FileText },
    { id: "design", url: dto.links.design, label: t(ui.projects.design), Icon: ExternalLink },
    { id: "video", url: dto.links.video, label: t(ui.projects.video), Icon: Video },
  ]
  return (
    <>
      {links.map(({ id, url, label, Icon }) =>
        isSafeUrl(url) ? (
          <Button key={id} asChild variant="ghost" size="sm">
            <a href={url} target="_blank" rel="noreferrer noopener">
              <Icon data-icon="inline-start" />
              {label}
            </a>
          </Button>
        ) : null
      )}
    </>
  )
}

function ProjectCard({ view, labels }: { view: ProjectView; labels: Labels }) {
  const { lang, t } = useI18n()
  const { dto } = view
  const highlights = resolveLocalizedList(dto.highlights, lang).slice(0, 3)
  const [visibleCover, markFailed] = useVisibleCover(dto)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <Card className="group flex h-full flex-col overflow-hidden bg-card/60 pt-0 transition-all hover:border-foreground/25 hover:shadow-lg">
        <div className="relative border-b border-border">
          {visibleCover !== null ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`${resolveLocalized(dto.name, lang)} — ${t(ui.projects.openViewer)}`}
              className="block w-full cursor-zoom-in"
            >
              <SlideImage item={visibleCover} lang={lang} onError={markFailed} />
            </button>
          ) : (
            <CoverFallback view={view} />
          )}
          <CoverBadges dto={dto} labels={labels} />
        </div>

        <CardHeader>
          <CardTitle className="text-lg">{resolveLocalized(dto.name, lang)}</CardTitle>
          <CardDescription>{resolveLocalized(dto.tagline, lang)}</CardDescription>
          <MetaRow dto={dto} labels={labels} />
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4 pb-4">
          {highlights.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {highlights.map((highlight, index) => (
                <li key={`${index}-${highlight}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {highlight}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {dto.stack.map((tech) => (
              <Badge key={tech} variant="outline" className="font-normal text-muted-foreground">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <Separator />
        <CardFooter className="flex-wrap gap-2 py-3!">
          <RepoButtons dto={dto} />
          <ExtraLinks dto={dto} />
        </CardFooter>
      </Card>

      {visibleCover !== null && (
        <Lightbox
          dto={dto}
          item={visibleCover}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onFail={markFailed}
        />
      )}
    </>
  )
}

function ProjectCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="mt-auto flex gap-1.5 pt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="gap-2 py-3!">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </CardFooter>
    </Card>
  )
}

export function Projects() {
  const { t } = useI18n()
  const labels = useProjectLabels(t)
  const { views, loading, source, retry } = useProjectViews()

  return (
    <section id="projects" className="scroll-mt-20 py-24">
      <SectionHeading eyebrow={ui.projects.subtitle} title={ui.projects.title} />

      {!loading && source === "fallback" && (
        <div
          role="status"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm"
        >
          <span className="text-amber-200">{t(ui.projects.demoDataNotice)}</span>
          <Button variant="outline" size="sm" onClick={retry}>
            {t(ui.projects.retry)}
          </Button>
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {views.map((view) => (
            <ProjectCard key={view.dto.slug} view={view} labels={labels} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button asChild variant="link" className="text-muted-foreground">
          <a href="https://github.com/alexmoreau-dev" target="_blank" rel="noreferrer noopener">
            <Github data-icon="inline-start" />
            {t(ui.projects.moreOnGithub)}
          </a>
        </Button>
      </div>
    </section>
  )
}
