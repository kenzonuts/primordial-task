import { AlertTriangle } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { Alert } from '@shared/ui/feedback/alert';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type NoteErrorStateProps = {
  readonly title?: string;
  readonly message?: string;
  readonly onRetry?: () => void;
  readonly action?: ReactNode;
  readonly className?: string;
};

export const NoteErrorState = ({
  title = 'Notes could not be loaded',
  message = 'Something went wrong while loading notes. Try again.',
  onRetry,
  action,
  className,
}: NoteErrorStateProps): ReactElement => {
  return (
    <Stack gap={16} className={cn('items-start p-6', className)}>
      <Alert variant="danger" title={title} icon={<AlertTriangle aria-hidden="true" />}>
        {message}
      </Alert>
      {onRetry ? (
        <Button type="button" variant="secondary" size="md" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
      {action}
    </Stack>
  );
};

export type { NoteErrorStateProps };
