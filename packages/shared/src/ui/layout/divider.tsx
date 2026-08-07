import * as Separator from '@radix-ui/react-separator';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

export type DividerOrientation = 'horizontal' | 'vertical';

export type DividerProps = ComponentPropsWithoutRef<typeof Separator.Root> & {
  readonly orientation?: DividerOrientation;
  readonly decorative?: boolean;
  readonly className?: string;
};

export const Divider = ({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...rest
}: DividerProps): ReactElement => {
  return (
    <Separator.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-[var(--divider)]',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...rest}
    />
  );
};
