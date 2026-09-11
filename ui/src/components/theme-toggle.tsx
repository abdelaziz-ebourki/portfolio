import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/theme"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={t(theme === "dark" ? ui.theme.switchToLight : ui.theme.switchToDark)}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  )
}
