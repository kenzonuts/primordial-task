import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react';

import { gapClasses } from '@shared/ui/layout/stack';
import type { LayoutGap } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  readonly cols?: number;
  readonly gap?: LayoutGap;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly style?: CSSProperties;
};

export const Grid = ({
  cols = 1,
  gap = 16,
  className,
  children,
  style,
  ...rest
}: GridProps): ReactElement => {
  return (
    <div
      className={cn('grid', gapClasses[gap], className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
