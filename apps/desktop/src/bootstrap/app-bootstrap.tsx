import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import { Component, StrictMode, Suspense, useEffect } from 'react';

import App from '@/App';
import { loadEnvironment } from '@/bootstrap/environment-loader';
import { useAppBootstrap } from '@/bootstrap/use-app-bootstrap';
import { normalizeEnvironment } from '@core/app/environment';
import { APP_ERROR_CODES } from '@core/errors/error-codes';
import { createLogger } from '@core/logging/logger';
import { QueryProvider } from '@shared/hooks/use-query-provider';
import { useRootStore } from '@shared/hooks/use-root-store';
import { ServiceContainerProvider } from '@shared/hooks/use-service-container';

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

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const environment = normalizeEnvironment(loadEnvironment().mode);
    const logger = createLogger(environment);

    logger.error('Unhandled render error', {
      errorCode: APP_ERROR_CODES.unknown,
      message: error.message,
      componentStack: info.componentStack,
    });
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
        <QueryProvider>
          <AppBootstrapHost />
        </QueryProvider>
      </AppErrorBoundary>
    </StrictMode>
  );
};
