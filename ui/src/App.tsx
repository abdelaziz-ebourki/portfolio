import { I18nProvider } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Experience } from "@/components/experience"
import { Education } from "@/components/education"
import { TerminalSection } from "@/components/terminal-section"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import { LogoLoop } from "@/components/logo-loop"
import { techLogos } from "@/lib/tech-logos"

export default function App() {
  return (
    <I18nProvider>
      <div className="relative min-h-svh bg-background text-foreground antialiased">
        <div aria-hidden className="crt-scanlines" />
        <Navbar />
        <main>
          <Hero />
          <div className="border-y border-border/60 bg-card/30 py-6">
            <LogoLoop
              logos={techLogos}
              speed={80}
              gap={64}
              logoHeight={28}
              pauseOnHover
              scaleOnHover
              fadeOut
              ariaLabel="Technologies I work with"
              className="text-foreground/55"
            />
          </div>
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
              <Experience />
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
  )
}
