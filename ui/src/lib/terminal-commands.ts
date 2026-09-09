export const CHEAT_COMMANDS = [
  "help",
  "whoami",
  "about",
  "skills",
  "projects",
  "education",
  "contact",
  "ls",
  "clear",
  "theme",
  "lang",
] as const

export const TAB_COMMANDS = [...CHEAT_COMMANDS, "rm", "cat"] as const
