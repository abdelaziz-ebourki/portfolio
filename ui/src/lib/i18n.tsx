import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Lang = "en" | "fr" | "ar"
export type Localized = Record<Lang, string>

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (value: Localized) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = "portfolio-lang"

function getLangDir(lang: Lang): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr"
}

function applyLangAttributes(lang: Lang) {
  if (typeof document === "undefined") return
  document.documentElement.lang = lang
  document.documentElement.dir = getLangDir(lang)
}

// fallow-ignore-next-line complexity -- guarded storage read, branching inherent to validation + fallback
function readStoredLang(): Lang | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "en" || stored === "fr" || stored === "ar") return stored
  } catch {
    // Storage unavailable (private mode, blocked cookies) — fall through.
  }
  return null
}

// fallow-ignore-next-line complexity -- stored > browser > default chain, branching intentional
function readInitialLang(): Lang {
  if (typeof window === "undefined") return "en"
  const stored = readStoredLang()
  if (stored) return stored
  const browser = navigator.language.toLowerCase()
  if (browser.startsWith("ar")) return "ar"
  if (browser.startsWith("fr")) return "fr"
  return "en"
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable — language still applies for this session.
    }
    applyLangAttributes(next)
  }, [])

  const t = useCallback(
    (value: Localized) => value[lang] ?? value.en,
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  useEffect(() => {
    applyLangAttributes(lang)
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider")
  return ctx
}
