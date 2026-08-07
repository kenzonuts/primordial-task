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
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Toaster } from '@shared/ui/feedback/toast';
import { Surface } from '@shared/ui/layout/surface';
import { TooltipProvider } from '@shared/ui/overlays/tooltip';
import { ThemeProvider } from '@shared/ui/theme/theme-provider';
import { Text } from '@shared/ui/typography/text';

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
      return (
        <Surface
          variant="base"
          className="grid min-h-screen place-items-center p-[var(--space-24)]"
        >
          <Text as="p" role="alert" variant="body-md">
            Application initialization failed: {this.state.error.message}
          </Text>
        </Surface>
      );
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
    return (
      <Surface variant="base" className="grid min-h-screen place-items-center">
        <LoadingIndicator label="Loading application infrastructure..." />
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface variant="base" className="grid min-h-screen place-items-center p-[var(--space-24)]">
        <Text as="p" role="alert" variant="body-md">
          Application bootstrap failed: {error.message}
        </Text>
      </Surface>
    );
  }

  if (!context) {
    return (
      <Surface variant="base" className="grid min-h-screen place-items-center p-[var(--space-24)]">
        <Text as="p" role="alert" variant="body-md">
          Application bootstrap context unavailable.
        </Text>
      </Surface>
    );
  }

  return (
    <ServiceContainerProvider container={context.container}>
      <Suspense
        fallback={
          <Surface variant="base" className="grid min-h-screen place-items-center">
            <LoadingIndicator label="Loading shell..." />
          </Surface>
        }
      >
        <App />
      </Suspense>
    </ServiceContainerProvider>
  );
};

export const AppBootstrap = (): ReactNode => {
  return (
    <StrictMode>
      <ThemeProvider>
        <TooltipProvider delayDuration={500}>
          <AppErrorBoundary>
            <QueryProvider>
              <AppBootstrapHost />
              <Toaster />
            </QueryProvider>
          </AppErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </StrictMode>
  );
};
