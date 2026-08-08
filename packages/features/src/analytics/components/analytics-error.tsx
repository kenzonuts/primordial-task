import type { ReactElement } from 'react';

import { Alert } from '@shared/ui/feedback/alert';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type AnalyticsErrorProps = {
  readonly title?: string;
  readonly message?: string;
  readonly onRetry?: () => void;
  readonly className?: string;
};

export const AnalyticsError = ({
  title = 'Data aggregation failed',
  message = 'Data aggregation failed. Retrying… Check your connection and try again.',
  onRetry,
  className,
}: AnalyticsErrorProps): ReactElement => {
  return (
    <Alert variant="danger" title={title} className={cn(className)} role="alert">
      <Stack gap={12}>
        <span>{message}</span>
        {onRetry ? (
          <div>
            <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        ) : null}
      </Stack>
    </Alert>
  );
};

export type { AnalyticsErrorProps };
