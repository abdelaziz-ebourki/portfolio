import { useI18n, type Lang } from "@/lib/i18n"
import { ui } from "@/lib/content"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const resumeFiles: Array<{ lang: Lang; file: string }> = [
  { lang: "en", file: "/resumes/cv-en.pdf" },
  { lang: "fr", file: "/resumes/cv-fr.pdf" },
  { lang: "ar", file: "/resumes/cv-ar.pdf" },
]

export function ResumeMenu({
  className,
  onPick,
}: {
  className?: string
  onPick?: () => void
}) {
  const { lang, t } = useI18n()
  const ordered = [...resumeFiles].sort((a, b) =>
    a.lang === lang ? -1 : b.lang === lang ? 1 : 0
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("font-mono text-xs", className)}
          aria-label={t(ui.resume.ariaLabel)}
        >
          <Download data-icon="inline-start" className="opacity-70" />
          {t(ui.resume.menuLabel)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuGroup>
          {ordered.map(({ lang: fileLang, file }) => (
            <DropdownMenuItem
              key={fileLang}
              asChild
              onSelect={onPick}
              className="flex items-center justify-between"
            >
              <a href={file} download={`cv-${fileLang}.pdf`}>
                {t(ui.resume.fileNames[fileLang])}
                {fileLang === lang && <Check className="size-4" />}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
