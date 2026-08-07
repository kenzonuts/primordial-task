import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react';

import { alignClasses, gapClasses, justifyClasses } from '@shared/ui/layout/stack';
import type { LayoutAlign, LayoutGap, LayoutJustify } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';

export type InlineProps = HTMLAttributes<HTMLDivElement> & {
  readonly gap?: LayoutGap;
  readonly align?: LayoutAlign;
  readonly justify?: LayoutJustify;
  readonly wrap?: boolean;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly style?: CSSProperties;
};

export const Inline = ({
  gap = 8,
  align = 'center',
  justify = 'start',
  wrap = false,
  className,
  children,
  ...rest
}: InlineProps): ReactElement => {
  return (
    <div
      className={cn(
        'flex flex-row',
        wrap && 'flex-wrap',
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
