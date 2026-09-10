import { apiBase } from "@/lib/projects-api"

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
  | { kind: "network" }

export type ContactResult = { ok: true } | { ok: false; error: ContactError }

/** POST the contact form. Never throws — all failures map to ContactError. */
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
      signal,
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e
    return { ok: false, error: { kind: "network" } }
  }
  if (res.status === 202) return { ok: true }
  if (res.status === 429) return { ok: false, error: { kind: "rate-limited" } }
  if (res.status === 422) {
    try {
      const data: unknown = await res.json()
      const fields =
        typeof data === "object" && data !== null
          ? ((data as Record<string, unknown>).fields as Record<string, string>)
          : {}
      return { ok: false, error: { kind: "validation", fields: fields ?? {} } }
    } catch {
      return { ok: false, error: { kind: "validation", fields: {} } }
    }
  }
  return { ok: false, error: { kind: "network" } }
}
