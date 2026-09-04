import { useI18n, type Lang } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Languages } from "lucide-react"

const options: Array<{ value: Lang; label: string; short: string }> = [
  { value: "fr", label: "Français", short: "FR" },
  { value: "en", label: "English", short: "EN" },
  { value: "ar", label: "العربية", short: "AR" },
]

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  const current = options.find((o) => o.value === lang)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="font-mono text-xs">
          <Languages data-icon="inline-start" className="opacity-70" />
          {current?.short}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setLang(option.value)}
              className="flex items-center justify-between"
            >
              {option.label}
              {option.value === lang && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
