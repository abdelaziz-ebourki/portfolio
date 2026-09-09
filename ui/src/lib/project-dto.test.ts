import { describe, expect, it } from "vitest"
import { isSafeUrl, resolveLocalized, resolveLocalizedList } from "@/lib/project-dto"

describe("resolveLocalized", () => {
  it("returns language value when present", () => {
    expect(resolveLocalized({ en: "Hello", fr: "Bonjour" }, "fr")).toBe("Bonjour")
    expect(resolveLocalized({ en: "Hello", fr: "Bonjour" }, "en")).toBe("Hello")
  })

  it("falls back to English", () => {
    expect(resolveLocalized({ en: "Hello" }, "fr")).toBe("Hello")
    expect(resolveLocalized({ en: "Hello", ar: "مرحبا" }, "fr")).toBe("Hello")
  })

  it("returns empty string when map missing or empty", () => {
    expect(resolveLocalized(undefined, "en")).toBe("")
    expect(resolveLocalized({}, "en")).toBe("")
    expect(resolveLocalized({ en: "" }, "en")).toBe("")
  })

  it("handles Arabic fallback", () => {
    expect(resolveLocalized({ en: "Hello", ar: "مرحبا" }, "ar")).toBe("مرحبا")
  })
})

describe("resolveLocalizedList", () => {
  it("returns language list when non-empty", () => {
    expect(resolveLocalizedList({ en: ["a"], fr: ["b"] }, "fr")).toEqual(["b"])
  })

  it("falls back to English when translation empty or missing", () => {
    expect(resolveLocalizedList({ en: ["a", "b"] }, "fr")).toEqual(["a", "b"])
    expect(resolveLocalizedList({ en: ["a"], fr: [] }, "fr")).toEqual(["a"])
  })

  it("returns empty array when undefined", () => {
    expect(resolveLocalizedList(undefined, "en")).toEqual([])
  })

  it("never mixes languages within one list", () => {
    const list = { en: ["en1", "en2"], fr: ["fr1"] }
    // fr has one item, so it returns fr list entirely, not a mix
    expect(resolveLocalizedList(list, "fr")).toEqual(["fr1"])
    expect(resolveLocalizedList(list, "ar")).toEqual(["en1", "en2"])
  })
})

describe("isSafeUrl", () => {
  it("allows http and https", () => {
    expect(isSafeUrl("http://example.com")).toBe(true)
    expect(isSafeUrl("https://example.com/path?q=1")).toBe(true)
  })

  it("rejects javascript and other schemes", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false)
    expect(isSafeUrl("data:text/html,hi")).toBe(false)
    expect(isSafeUrl("ftp://example.com")).toBe(false)
  })

  it("rejects falsy and invalid URLs", () => {
    expect(isSafeUrl(undefined)).toBe(false)
    expect(isSafeUrl("")).toBe(false)
    expect(isSafeUrl("https://example.com:99999")).toBe(false)
  })

  it("accepts absolute URLs with base fallback for relative", () => {
    // relative URL without scheme resolves against https://portfolio.local -> https:
    expect(isSafeUrl("/api/projects/slug/cover")).toBe(true)
  })
})
