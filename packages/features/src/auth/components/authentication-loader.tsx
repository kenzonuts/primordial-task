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
  label = 'Loading',
  className,
  ...props
}: AuthenticationLoaderProps): ReactElement => {
  return (
    <Stack gap={12} align="center" className={cn(className)} {...props}>
      <LoadingIndicator label={label} size="page" />
      <Text as="p" variant="body-sm" muted role="status" aria-live="polite">
        {status}
      </Text>
    </Stack>
  );
};

export type { AuthenticationLoaderProps };
