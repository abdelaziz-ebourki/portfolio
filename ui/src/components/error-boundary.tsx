import { Component, type ReactNode } from "react"

type ErrorBoundaryProps = {
  children: ReactNode
  /** Shown when the subtree crashes (e.g. WebGL unavailable). */
  fallback?: ReactNode
}

type ErrorBoundaryState = { crashed: boolean }

/**
 * Isolates crashes in heavy subtrees (hero terminal, WebGL) so one
 * failing widget never blanks the whole page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { crashed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { crashed: true }
  }

  componentDidCatch(error: unknown): void {
    console.error("[ui] section crashed", error)
  }

  render(): ReactNode {
    if (this.state.crashed) {
      return (
        this.props.fallback ?? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            This section failed to load.
          </div>
        )
      )
    }
    return this.props.children
  }
}
