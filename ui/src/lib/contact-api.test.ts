import { afterEach, describe, expect, it, vi } from "vitest"
import { postContact } from "@/lib/contact-api"

const input = { name: "Jane", email: "jane@company.com", message: "Hello" }

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

afterEach(() => vi.unstubAllGlobals())

describe("postContact", () => {
  it("returns ok on 202", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(202, { status: "received" })))
    expect(await postContact(input)).toEqual({ ok: true })
  })

  it("maps 422 to validation fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(422, { error: "validation failed", fields: { email: "must be an email" } })
      )
    )
    const result = await postContact(input)
    expect(result).toEqual({
      ok: false,
      error: { kind: "validation", fields: { email: "must be an email" } },
    })
  })

  it("maps 429 to rate-limited", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(429, { error: "slow down" })))
    expect(await postContact(input)).toEqual({ ok: false, error: { kind: "rate-limited" } })
  })

  it("maps network failure and 500 to network", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("down")))
    expect(await postContact(input)).toEqual({ ok: false, error: { kind: "network" } })

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(500, {})))
    expect(await postContact(input)).toEqual({ ok: false, error: { kind: "network" } })
  })

  it("posts to the configured api base", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(202, {}))
    vi.stubGlobal("fetch", fetch)
    vi.stubEnv("VITE_API_URL", "https://api.example.com/")
    await postContact(input)
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/api/contact",
      expect.objectContaining({ method: "POST" })
    )
  })
})
