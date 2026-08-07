import type { CSSProperties, ReactElement, ReactNode } from 'react';

import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type AuthLayoutProps = {
  readonly children: ReactNode;
  readonly maxWidth?: number | string;
  readonly version?: string;
  readonly className?: string;
};

export const AuthLayout = ({
  children,
  maxWidth = 440,
  version,
  className,
}: AuthLayoutProps): ReactElement => {
  const contentStyle: CSSProperties = {
    width: '100%',
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
  };

  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-center',
        'bg-bg-app p-24 min-[1024px]:p-32',
        className,
      )}
    >
      <div style={contentStyle} className="flex w-full flex-col items-stretch">
        {children}
      </div>
      {version ? (
        <Text
          as="p"
          variant="caption"
          muted
          aria-hidden={false}
          className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 min-[1024px]:bottom-32"
        >
          {version}
        </Text>
      ) : null}
    </div>
  );
};

/** Compact centered status shell used by splash / auth-check screens. */
export const AuthStatusLayout = ({
  children,
  maxWidth = 360,
  version,
  className,
}: AuthLayoutProps): ReactElement => {
  return (
    <AuthLayout maxWidth={maxWidth} version={version} className={className}>
      <Stack gap={24} align="center">
        {children}
      </Stack>
    </AuthLayout>
  );
};

export type { AuthLayoutProps };
