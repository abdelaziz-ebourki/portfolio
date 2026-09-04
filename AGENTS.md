# AGENTS.md

## Project

Portfolio – full-stack showcase of GitHub projects via `.portfolio.json` webhook sync.
- `api/` (planned) – Spring Boot 3 + Java 21 + PostgreSQL + webhook HMAC
- `ui/` – React 19 + TypeScript 6 + Vite 8 + Tailwind 4 (only JS/TS package today)

## Operational Guidelines for Agents

### Communication – Tone and Style
- Responses short and concise.
- Focus on facts and problem-solving, direct objective technical info without superlatives/praise.
- No emojis unless requested.
- Reference code as `file_path:line_number`.

### Behavior – Truthfulness & Preciseness
- Never guess URLs; only use URLs provided or verified.
- Prioritize technical accuracy over validation; disagree when necessary.
- Verify correctness via execution when reasonable (run code, tests, sanity checks).
- Evidence before synthesis – inspect files before answering; trust evidence over speculation.
- Prefer editing existing files over creating new ones. Don't create docs unless requested.
- Check workspace for local instructions/config before generic commands.
- Inspect all candidate areas before diagnosing.

### Tool Use
- Prefer specialized tools: `read` over `cat`, `edit` over `sed`, `write` over `echo` heredoc, `glob`/`grep` over `find`/`grep`.
- Use `TodoWrite` for 3+ step tasks; mark one `in_progress` at a time.
- Use `Task` subagents for independent workstreams.
- Batch parallel tool calls where safe; chain sequentially with `&&` when dependent.
- For one-off computation use `bash` with `python3 -c`; use `/tmp/opencode` for temp.
- Don't `cd <dir> && cmd`; use `workdir` param.
- Always use the question tool to ask questions, gather preferences, or clarify ambiguous instructions before assuming.

### Git
- Only commit/push/PR when explicitly requested. Inspect `git status/diff/log` before committing, never commit secrets.
- Don't amend failed commits; fix and create new commit.

## Fallow Setup (static-only, warn mode)

- Installed as `devDependency` in `ui/` only (no root package.json). Run via `npx fallow` inside `ui/`.
- Config lives at `ui/.fallowrc.json` – static analysis only (dead-code, duplication, circular-deps, health). Runtime/coverage disabled.
- Rules default to `warn` (non-blocking). Promote to `error` after cleanup.
- Cache dir `.fallow/` is gitignored. Do not commit.
- CLI usage:
  ```bash
  cd ui
  npx fallow audit --format json --quiet   # full audit, exit 1 = findings (normal)
  npx fallow dead-code
  npx fallow dupes --mode mild
  npx fallow health --score
  ```
- CI: `.github/workflows/fallow.yml` runs `warn` mode, posts summary + annotations, SARIF upload if GHAS enabled. Uses package.json pin, so CLI upgrades only via `ui/package.json`.
- Never run `fallow watch` in agent loops (non-exiting). Telemetry off by default.

## Commands

```bash
# ui
cd ui
npm run dev          # vite
npm run build        # tsc -b && vite build
npm run lint         # oxlint
npx fallow audit
```

## Conventions
- Path alias `@` → `ui/src` (`ui/vite.config.ts:10`, `ui/tsconfig.json`)
- UI components: `ui/src/components/`, shadcn `ui/src/components/ui/`
- Bilingual i18n via `ui/src/lib/i18n.tsx`, terminal commands `ui/src/lib/terminal-commands.ts`
