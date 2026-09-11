import { useState } from "react"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { ResumeMenu } from "@/components/resume-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

type NavKey = keyof typeof ui.nav

const navKeys: NavKey[] = [
  "about",
  "skills",
  "projects",
  "education",
  "terminal",
  "contact",
]

export function Navbar() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className="font-mono text-sm font-semibold tracking-tight text-primary"
        >
          alex@dev:~$
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navKeys.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="rounded-none px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t(ui.nav[key])}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ResumeMenu className="hidden md:inline-flex" />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <a href="#contact">{t(ui.hero.ctaContact)}</a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={open ? t(ui.nav.closeMenu) : t(ui.nav.openMenu)}
                aria-expanded={open}
              >
                {open ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72" closeLabel={t(ui.nav.closeMenu)}>
              <SheetHeader>
                <SheetTitle className="font-mono text-primary">
                  alex@dev:~$
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navKeys.map((key) => (
                  <SheetClose key={key} asChild>
                    <a
                      href={`#${key}`}
                      className="rounded-none px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {t(ui.nav[key])}
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button asChild className="mt-3 w-full">
                    <a href="#contact">{t(ui.hero.ctaContact)}</a>
                  </Button>
                </SheetClose>
                <ResumeMenu className="mt-2 w-full" onPick={() => setOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
