import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    // central error reporting hook
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return <div role="alert">Application error.</div>
    }

    return this.props.children
  }
}