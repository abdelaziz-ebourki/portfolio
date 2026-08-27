export const CHEAT_COMMANDS = [
  "help",
  "whoami",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "contact",
  "ls",
  "clear",
  "sudo hire-me",
] as const

export const TAB_COMMANDS = [
  ...CHEAT_COMMANDS.map((c) => c.split(" ")[0]),
  "rm",
  "cat",
] as const
