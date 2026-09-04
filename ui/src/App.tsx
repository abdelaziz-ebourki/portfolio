import { ThemeProvider } from "@/lib/theme"
import { I18nProvider } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Education } from "@/components/education"
import { TerminalSection } from "@/components/terminal-section"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
      <div className="relative min-h-svh bg-background text-foreground antialiased">
        <div aria-hidden className="crt-scanlines" />
        <Navbar />
        <main>
          <Hero />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <About />
            </Reveal>
            <Reveal>
              <Skills />
            </Reveal>
            <Reveal>
              <Projects />
            </Reveal>
            <Reveal>
              <Education />
            </Reveal>
            <Reveal>
              <TerminalSection />
            </Reveal>
            <Reveal>
              <Contact />
            </Reveal>
          </div>
        </main>
        <Footer />
      </div>
      </I18nProvider>
    </ThemeProvider>
  )
}
