import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';

export type LayoutGap = 2 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48;

export type LayoutAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export type LayoutJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export const gapClasses: Record<LayoutGap, string> = {
  2: 'gap-[var(--space-2)]',
  4: 'gap-[var(--space-4)]',
  8: 'gap-[var(--space-8)]',
  12: 'gap-[var(--space-12)]',
  16: 'gap-[var(--space-16)]',
  20: 'gap-[var(--space-20)]',
  24: 'gap-[var(--space-24)]',
  32: 'gap-[var(--space-32)]',
  40: 'gap-[var(--space-40)]',
  48: 'gap-[var(--space-48)]',
};

export const alignClasses: Record<LayoutAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

export const justifyClasses: Record<LayoutJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  readonly gap?: LayoutGap;
  readonly align?: LayoutAlign;
  readonly justify?: LayoutJustify;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly style?: CSSProperties;
};

export const Stack = ({
  gap = 8,
  align = 'stretch',
  justify = 'start',
  className,
  children,
  ...rest
}: StackProps): ReactElement => {
  return (
    <div
      className={cn(
        'flex flex-col',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
