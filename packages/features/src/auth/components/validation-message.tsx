import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type ValidationMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  readonly children?: ReactNode;
  readonly tone?: 'error' | 'helper';
};

export const ValidationMessage = ({
  children,
  tone = 'error',
  className,
  ...props
}: ValidationMessageProps): ReactElement | null => {
  if (!children) {
    return null;
  }

  return (
    <Text
      as="p"
      variant="caption"
      role={tone === 'error' ? 'alert' : undefined}
      className={cn('font-medium', tone === 'error' ? 'text-danger' : 'text-text-muted', className)}
      {...props}
    >
      {children}
    </Text>
  );
};

export type { ValidationMessageProps };
