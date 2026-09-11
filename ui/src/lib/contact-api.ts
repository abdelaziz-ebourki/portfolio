import { apiBase, withTimeout } from "@/lib/projects-api"

export type ContactInput = {
  name: string
  email: string
  message: string
  /** Honeypot — must stay empty. */
  company?: string
}

export type ContactError =
  | { kind: "validation"; fields: Record<string, string> }
  | { kind: "rate-limited" }
  | { kind: "server" }
  | { kind: "network" }

export type ContactResult = { ok: true } | { ok: false; error: ContactError }

export const CONTACT_TIMEOUT_MS = 10_000

function stringRecord(value: unknown): Record<string, string> {
  if (typeof value !== "object" || value === null) return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(value)) {
    if (typeof v === "string") out[k] = v
  }
  return out
}

/**
 * POST the contact form. Never throws on API failures — they map to
 * ContactError (caller-abort still rethrows so unmount stays silent).
 * Times out so the form can't hang on "Sending..." forever.
 */
export async function postContact(
  input: ContactInput,
  signal?: AbortSignal
): Promise<ContactResult> {
  let res: Response
  try {
    res = await fetch(`${apiBase()}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: withTimeout(signal, CONTACT_TIMEOUT_MS),
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError" && signal?.aborted) throw e
    return { ok: false, error: { kind: "network" } }
  }
  if (res.status === 202) return { ok: true }
  if (res.status === 429) return { ok: false, error: { kind: "rate-limited" } }
  if (res.status === 422) {
    try {
      const data: unknown = await res.json()
      const fields =
        typeof data === "object" && data !== null
          ? stringRecord((data as Record<string, unknown>).fields)
          : {}
      return { ok: false, error: { kind: "validation", fields } }
    } catch {
      return { ok: false, error: { kind: "validation", fields: {} } }
    }
  }
  if (res.status >= 500) return { ok: false, error: { kind: "server" } }
  return { ok: false, error: { kind: "network" } }
}
