import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react';

import type { LayoutGap } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';

const paddingXClasses: Record<LayoutGap, string> = {
  2: 'px-[var(--space-2)]',
  4: 'px-[var(--space-4)]',
  8: 'px-[var(--space-8)]',
  12: 'px-[var(--space-12)]',
  16: 'px-[var(--space-16)]',
  20: 'px-[var(--space-20)]',
  24: 'px-[var(--space-24)]',
  32: 'px-[var(--space-32)]',
  40: 'px-[var(--space-40)]',
  48: 'px-[var(--space-48)]',
};

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  readonly maxWidth?: string;
  readonly padding?: LayoutGap | false;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly style?: CSSProperties;
};

export const Container = ({
  maxWidth = 'var(--layout-container)',
  padding = 24,
  className,
  children,
  style,
  ...rest
}: ContainerProps): ReactElement => {
  return (
    <div
      className={cn('mx-auto w-full', padding !== false && paddingXClasses[padding], className)}
      style={{ maxWidth, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};
