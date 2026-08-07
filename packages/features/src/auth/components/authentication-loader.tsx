import type { HTMLAttributes, ReactElement } from 'react';

import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type AuthenticationLoaderProps = HTMLAttributes<HTMLDivElement> & {
  readonly status: string;
  readonly label?: string;
};

export const AuthenticationLoader = ({
  status,
  label,
  className,
  ...props
}: AuthenticationLoaderProps): ReactElement => {
  const spinnerLabel = label ?? status;

  return (
    <Stack gap={12} align="center" className={cn(className)} {...props}>
      <LoadingIndicator
        size="page"
        label={spinnerLabel}
        className="gap-0 [&>span[aria-hidden]]:hidden"
      />
      <Text as="p" variant="body-sm" muted role="status" aria-live="polite">
        {status}
      </Text>
    </Stack>
  );
};

export type { AuthenticationLoaderProps };
