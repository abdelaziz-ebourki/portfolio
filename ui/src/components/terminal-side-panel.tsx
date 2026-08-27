import { TerminalWindow } from "@/components/terminal-window"
import { ui } from "@/lib/content"
import { useI18n } from "@/lib/i18n"
import { CHEAT_COMMANDS } from "@/lib/terminal-commands"

export function TerminalSidePanel({
  onRun,
}: {
  onRun: (cmd: string) => void
}) {
  const { t } = useI18n()

  return (
    <TerminalWindow title="~/cheatsheet" className="flex h-full flex-col">
      <div className="flex flex-1 flex-col">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-primary/80">
          {t(ui.terminal.side.cheatTitle)}
        </p>
        <div className="mt-3 flex flex-1 flex-col gap-1">
          {CHEAT_COMMANDS.map((cmd) => {
            const key = cmd.split(" ")[0]
            const hint =
              ui.terminal.side.commands[key as keyof typeof ui.terminal.side.commands]
            return (
              <button
                key={cmd}
                type="button"
                onClick={() => onRun(cmd)}
                className="group flex items-center justify-between rounded px-2 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="text-primary group-hover:text-primary">{cmd}</span>
                <span className="ml-3 truncate text-muted-foreground/70">
                  {hint ? t(hint) : ""}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted-foreground/60">
          {t(ui.terminal.side.cheatHint)}
        </p>
      </div>
    </TerminalWindow>
  )
}
