import type { CSSProperties, HTMLAttributes, ReactElement } from 'react';

import type { LayoutGap } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';

const sizeClasses: Record<LayoutGap, string> = {
  2: 'size-[var(--space-2)]',
  4: 'size-[var(--space-4)]',
  8: 'size-[var(--space-8)]',
  12: 'size-[var(--space-12)]',
  16: 'size-[var(--space-16)]',
  20: 'size-[var(--space-20)]',
  24: 'size-[var(--space-24)]',
  32: 'size-[var(--space-32)]',
  40: 'size-[var(--space-40)]',
  48: 'size-[var(--space-48)]',
};

const widthClasses: Record<LayoutGap, string> = {
  2: 'w-[var(--space-2)]',
  4: 'w-[var(--space-4)]',
  8: 'w-[var(--space-8)]',
  12: 'w-[var(--space-12)]',
  16: 'w-[var(--space-16)]',
  20: 'w-[var(--space-20)]',
  24: 'w-[var(--space-24)]',
  32: 'w-[var(--space-32)]',
  40: 'w-[var(--space-40)]',
  48: 'w-[var(--space-48)]',
};

const heightClasses: Record<LayoutGap, string> = {
  2: 'h-[var(--space-2)]',
  4: 'h-[var(--space-4)]',
  8: 'h-[var(--space-8)]',
  12: 'h-[var(--space-12)]',
  16: 'h-[var(--space-16)]',
  20: 'h-[var(--space-20)]',
  24: 'h-[var(--space-24)]',
  32: 'h-[var(--space-32)]',
  40: 'h-[var(--space-40)]',
  48: 'h-[var(--space-48)]',
};

export type SpacerProps = HTMLAttributes<HTMLDivElement> & {
  readonly size?: LayoutGap;
  readonly axis?: 'x' | 'y' | 'both';
  readonly grow?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
};

export const Spacer = ({
  size,
  axis = 'both',
  grow = false,
  className,
  ...rest
}: SpacerProps): ReactElement => {
  return (
    <div
      aria-hidden
      className={cn(
        grow && 'flex-1 min-w-0 min-h-0',
        size !== undefined && axis === 'both' && sizeClasses[size],
        size !== undefined && axis === 'x' && widthClasses[size],
        size !== undefined && axis === 'y' && heightClasses[size],
        size !== undefined && axis === 'x' && 'shrink-0',
        size !== undefined && axis === 'y' && 'shrink-0',
        size !== undefined && axis === 'both' && 'shrink-0',
        className,
      )}
      {...rest}
    />
  );
};
