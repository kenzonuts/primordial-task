import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react';

import { Stack } from '@shared/ui/layout/stack';
import { Surface } from '@shared/ui/layout/surface';
import { cn } from '@shared/ui/lib/cn';

type AuthCardProps = HTMLAttributes<HTMLDivElement> & {
  readonly children: ReactNode;
  readonly maxWidth?: number | string;
};

export const AuthCard = ({
  children,
  maxWidth = 440,
  className,
  style,
  ...props
}: AuthCardProps): ReactElement => {
  const cardStyle: CSSProperties = {
    width: '100%',
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    ...style,
  };

  return (
    <Surface
      variant="base"
      className={cn('mx-auto rounded-lg border border-border-subtle p-32 shadow-sm', className)}
      style={cardStyle}
      {...props}
    >
      <Stack gap={24}>{children}</Stack>
    </Surface>
  );
};

export type { AuthCardProps };
