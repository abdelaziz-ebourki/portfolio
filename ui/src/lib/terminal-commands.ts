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
] as const

export const TAB_COMMANDS = [
  ...CHEAT_COMMANDS.map((c) => c.split(" ")[0]),
  "rm",
  "cat",
] as const
