import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Lang = "en" | "fr"
export type Localized = Record<Lang, string>

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (value: Localized) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = "portfolio-lang"

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "fr"
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "en" || stored === "fr") return stored
  return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en"
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next
  }, [])

  const t = useCallback(
    (value: Localized) => value[lang] ?? value.en,
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider")
  return ctx
}
