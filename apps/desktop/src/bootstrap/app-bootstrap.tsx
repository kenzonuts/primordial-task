import type { PropsWithChildren, ReactNode } from 'react';
import { Component, StrictMode, Suspense } from 'react';
import { useEffect } from 'react';

import App from '@/App';
import { loadEnvironment } from '@/bootstrap/environment-loader';
import { useAppBootstrap } from '@shared/hooks/use-app-bootstrap';
import { QueryProvider } from '@shared/hooks/use-query-provider';
import { useRootStore } from '@shared/hooks/use-root-store';
import { ServiceContainerProvider } from '@shared/hooks/use-service-container';
import { ThemeProvider } from '@ui/theme';

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
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

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return <div role="alert">Application initialization failed: {this.state.error.message}</div>;
    }

    return this.props.children;
  }
}

const environmentSource = loadEnvironment();

const AppBootstrapHost = (): ReactNode => {
  const setAppReady = useRootStore((state) => state.setAppReady);
  const setBootstrapError = useRootStore((state) => state.setBootstrapError);
  const { isLoading, context, error } = useAppBootstrap(environmentSource);

  useEffect(() => {
    if (!isLoading && !error && context) {
      setAppReady(true);
      setBootstrapError(null);
    }

    if (error) {
      setBootstrapError(error.message);
    }
  }, [context, error, isLoading, setAppReady, setBootstrapError]);

  if (isLoading) {
    return <div>Loading application infrastructure...</div>;
  }

  if (error) {
    return <div role="alert">Application bootstrap failed: {error.message}</div>;
  }

  if (!context) {
    return <div role="alert">Application bootstrap context unavailable.</div>;
  }

  return (
    <ServiceContainerProvider container={context.container}>
      <Suspense fallback={<div>Loading shell...</div>}>
        <App />
      </Suspense>
    </ServiceContainerProvider>
  );
};

export const AppBootstrap = (): ReactNode => {
  return (
    <StrictMode>
      <AppErrorBoundary>
        <ThemeProvider>
          <QueryProvider>
            <AppBootstrapHost />
          </QueryProvider>
        </ThemeProvider>
      </AppErrorBoundary>
    </StrictMode>
  );
};
