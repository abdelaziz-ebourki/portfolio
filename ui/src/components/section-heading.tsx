import { useI18n, type Localized } from "@/lib/i18n"

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: Localized
  title: Localized
}) {
  const { t } = useI18n()

  return (
    <div className="mb-10 flex flex-col gap-2">
      <span className="text-xs font-medium tracking-widest text-primary/80 uppercase">
        {"$ "}
        {t(eyebrow)}
      </span>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t(title)}
      </h2>
      <span aria-hidden className="text-sm text-primary/60">
        {"▔".repeat(24)}
      </span>
    </div>
  )
}
