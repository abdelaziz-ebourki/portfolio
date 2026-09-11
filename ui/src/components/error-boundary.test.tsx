import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ErrorBoundary } from "@/components/error-boundary"

function Boom(): React.JSX.Element {
  throw new Error("kaboom")
}

describe("ErrorBoundary", () => {
  it("renders children when healthy", () => {
    render(
      <ErrorBoundary>
        <p>fine</p>
      </ErrorBoundary>
    )
    expect(screen.getByText("fine")).toBeInTheDocument()
  })

  it("renders fallback when the subtree crashes", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    render(
      <ErrorBoundary fallback={<p>section down</p>}>
        <Boom />
      </ErrorBoundary>
    )
    expect(screen.getByText("section down")).toBeInTheDocument()
  })
})
