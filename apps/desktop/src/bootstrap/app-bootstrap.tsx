import type { PropsWithChildren } from 'react';
import { Component, StrictMode, Suspense, useEffect } from 'react';

import App from '@/App';
import { QueryProvider } from '@shared/hooks/use-query-provider';
import { useRootStore } from '@shared/hooks/use-root-store';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      return <div role="alert">Application initialization failed: {this.state.error.message}</div>;
    }

    return this.props.children;
  }
}

const AppBootstrapHost = (): React.ReactNode => {
  const setAppReady = useRootStore((state) => state.setAppReady);

  useEffect(() => {
    setAppReady(true);
  }, [setAppReady]);

  return (
    <Suspense fallback={<div>Loading application infrastructure…</div>}>
      <App />
    </Suspense>
  );
};

export const AppBootstrap = (): React.ReactNode => {
  return (
    <StrictMode>
      <AppErrorBoundary>
        <QueryProvider>
          <AppBootstrapHost />
        </QueryProvider>
      </AppErrorBoundary>
    </StrictMode>
  );
};
