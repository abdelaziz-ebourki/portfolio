import { useCallback, useEffect, useMemo, useState } from "react"
import { getProjectViews, type ProjectView } from "@/lib/projects-data"
import {
  isSafeUrl,
  resolveLocalized,
  resolveLocalizedList,
  type ProjectDto,
  type ProjectKind,
  type ProjectMedia,
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
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
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

function carouselDir(lang: Lang): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr"
}

function useCarouselIndex(api: CarouselApi | undefined): number {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!api) return
    setIndex(api.selectedScrollSnap())
    const onSelect = () => setIndex(api.selectedScrollSnap())
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  return index
}

/** Drops failed/unsafe media so broken slides never render. The surviving
 *  list feeds both the card carousel and the lightbox, keeping dots,
 *  counters and open-index consistent. */
function useVisibleMedia(dto: ProjectDto): [ProjectMedia[], (url: string) => void] {
  const [failed, setFailed] = useState<ReadonlySet<string>>(new Set())

  const markFailed = useCallback((url: string) => {
    setFailed((prev) => (prev.has(url) ? prev : new Set(prev).add(url)))
  }, [])

  const visible = useMemo(
    () =>
      dto.media.filter((item) => isSafeUrl(item.url) && !failed.has(item.url)),
    [dto.media, failed]
  )
  return [visible, markFailed]
}

function SlideDots({ api, count }: { api: CarouselApi | undefined; count: number }) {
  const current = useCarouselIndex(api)
  if (count <= 1) return null
  return (
    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => api?.scrollTo(i)}
          aria-label={`${i + 1} / ${count}`}
          className={cn(
            "size-1.5 rounded-full transition-colors",
            i === current ? "bg-primary-foreground" : "bg-primary-foreground/40 hover:bg-primary-foreground/70"
          )}
        />
      ))}
    </div>
  )
}

function SlideImage({
  item,
  lang,
  className = "aspect-video w-full object-cover",
  onError,
}: {
  item: ProjectMedia
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

function CardCarousel({
  media,
  onOpen,
  onFail,
}: {
  media: ProjectMedia[]
  onOpen: (index: number) => void
  onFail: (url: string) => void
}) {
  const { lang, t } = useI18n()
  const [api, setApi] = useState<CarouselApi>()
  const current = useCarouselIndex(api)
  const dir = carouselDir(lang)
  const opts = useMemo(() => ({ loop: true, direction: dir }), [dir])

  return (
    <div className="group/carousel relative">
      <Carousel setApi={setApi} opts={opts} dir={dir}>
        <CarouselContent className="ml-0">
          {media.map((item, i) => (
            <CarouselItem key={`${item.url}-${i}`} className="pl-0">
              <button
                type="button"
                onClick={() => onOpen(i)}
                className="block w-full cursor-zoom-in"
                aria-label={`${i + 1} / ${media.length}`}
              >
                <SlideImage item={item} lang={lang} onError={onFail} />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          prevLabel={t(ui.projects.prevSlide)}
          className="left-2 top-1/2 -translate-y-1/2 transition-opacity group-focus-within/carousel:opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 rtl:rotate-180"
        />
        <CarouselNext
          nextLabel={t(ui.projects.nextSlide)}
          className="right-2 top-1/2 -translate-y-1/2 transition-opacity group-focus-within/carousel:opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 rtl:rotate-180"
        />
      </Carousel>
      <span className="absolute end-2 top-2 rounded-md bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground">
        {current + 1} / {media.length}
      </span>
      <SlideDots api={api} count={media.length} />
    </div>
  )
}

function Lightbox({
  dto,
  media,
  index,
  onClose,
}: {
  dto: ProjectDto
  media: ProjectMedia[]
  index: number | null
  onClose: () => void
}) {
  const { lang, t } = useI18n()
  const [api, setApi] = useState<CarouselApi>()
  const current = useCarouselIndex(api)
  const dir = carouselDir(lang)
  const startIndex = index === null ? 0 : Math.min(index, media.length - 1)
  const opts = useMemo(
    () => ({ loop: true, direction: dir, startIndex }),
    [dir, startIndex]
  )

  return (
    <Dialog
      open={index !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
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
        {index !== null && (
          <Carousel setApi={setApi} opts={opts} dir={dir}>
            <CarouselContent className="ml-0 items-center">
              {media.map((item, i) => (
                <CarouselItem key={`${item.url}-${i}`} className="pl-0">
                  <SlideImage
                    item={item}
                    lang={lang}
                    className="max-h-[80dvh] w-full rounded-xl object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              prevLabel={t(ui.projects.prevSlide)}
              className="left-2 top-1/2 -translate-y-1/2 rtl:rotate-180"
            />
            <CarouselNext
              nextLabel={t(ui.projects.nextSlide)}
              className="right-2 top-1/2 -translate-y-1/2 rtl:rotate-180"
            />
          </Carousel>
        )}
        <p className="text-center text-sm text-muted-foreground">
          {index !== null ? current + 1 : 1} / {media.length}
        </p>
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
        <a href={repos[0].url} target="_blank" rel="noreferrer">
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
              <a href={repo.url} target="_blank" rel="noreferrer">
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
            <a href={url} target="_blank" rel="noreferrer">
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
  const { lang } = useI18n()
  const { dto } = view
  const highlights = resolveLocalizedList(dto.highlights, lang).slice(0, 3)
  const [visibleMedia, markFailed] = useVisibleMedia(dto)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <Card className="group flex h-full flex-col overflow-hidden bg-card/60 pt-0 transition-all hover:border-foreground/25 hover:shadow-lg">
        <div className="relative border-b border-border">
          {visibleMedia.length > 0 ? (
            <CardCarousel media={visibleMedia} onOpen={setLightboxIndex} onFail={markFailed} />
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
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
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

      {visibleMedia.length > 0 && (
        <Lightbox
          dto={dto}
          media={visibleMedia}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}

const ALL_KINDS: ProjectKind[] = ["personal", "academic", "client", "oss"]

function FilterChips<T extends string>({
  options,
  value,
  onChange,
  getLabel,
}: {
  options: readonly T[]
  value: T | "all"
  onChange: (next: T | "all") => void
  getLabel: (option: T | "all") => string
}) {
  const { t } = useI18n()
  return (
    <div className="flex flex-wrap gap-1.5">
      {(["all", ...options] as const).map((option) => (
        <Button
          key={option}
          variant={value === option ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(option)}
        >
          {option === "all" ? t(ui.projects.all) : getLabel(option)}
        </Button>
      ))}
    </div>
  )
}

export function Projects() {
  const { t } = useI18n()
  const labels = useProjectLabels(t)
  const views = useMemo(() => getProjectViews(), [])
  const [kindFilter, setKindFilter] = useState<ProjectKind | "all">("all")
  const [stackFilter, setStackFilter] = useState<string>("all")

  const stacks = useMemo(() => {
    const seen = new Set<string>()
    for (const view of views) {
      for (const tech of view.dto.stack) seen.add(tech)
    }
    return [...seen]
  }, [views])

  const visible = views.filter(
    (view) =>
      (kindFilter === "all" || view.dto.kind === kindFilter) &&
      (stackFilter === "all" || view.dto.stack.includes(stackFilter))
  )

  return (
    <section id="projects" className="scroll-mt-20 py-24">
      <SectionHeading eyebrow={ui.projects.subtitle} title={ui.projects.title} />

      <div className="flex flex-col gap-3 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground">
            {t(ui.projects.filterByType)}
          </span>
          <FilterChips
            options={ALL_KINDS}
            value={kindFilter}
            onChange={setKindFilter}
            getLabel={(kind) => (kind === "all" ? "" : labels.kind[kind])}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground">
            {t(ui.projects.filterByStack)}
          </span>
          <FilterChips
            options={stacks}
            value={stackFilter}
            onChange={setStackFilter}
            getLabel={(stack) => stack}
          />
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {visible.map((view) => (
            <ProjectCard key={view.dto.slug} view={view} labels={labels} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {t(ui.projects.noResults)}
        </p>
      )}

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
