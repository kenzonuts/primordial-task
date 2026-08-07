import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react';

import { alignClasses, gapClasses, justifyClasses } from '@shared/ui/layout/stack';
import type { LayoutAlign, LayoutGap, LayoutJustify } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

const directionClasses: Record<FlexDirection, string> = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
};

export type FlexProps = HTMLAttributes<HTMLDivElement> & {
  readonly direction?: FlexDirection;
  readonly align?: LayoutAlign;
  readonly justify?: LayoutJustify;
  readonly gap?: LayoutGap;
  readonly wrap?: boolean;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly style?: CSSProperties;
};

export const Flex = ({
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap = 8,
  wrap = false,
  className,
  children,
  ...rest
}: FlexProps): ReactElement => {
  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        gapClasses[gap],
        wrap && 'flex-wrap',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
