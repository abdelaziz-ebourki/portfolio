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

const baseUrl = import.meta.env.BASE_URL || "/"

const resumeFiles: Array<{ lang: Lang; file: string }> = [
  { lang: "en", file: `${baseUrl}resumes/cv-en.pdf` },
  { lang: "fr", file: `${baseUrl}resumes/cv-fr.pdf` },
  { lang: "ar", file: `${baseUrl}resumes/cv-ar.pdf` },
]

export function ResumeMenu({
  className,
  onPick,
}: {
  className?: string
  onPick?: () => void
}) {
  const { lang, t } = useI18n()
  const ordered = [
    ...resumeFiles.filter((entry) => entry.lang === lang),
    ...resumeFiles.filter((entry) => entry.lang !== lang),
  ]

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
              <a href={file} download={`cv-${fileLang}.pdf`} className="w-full">
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
