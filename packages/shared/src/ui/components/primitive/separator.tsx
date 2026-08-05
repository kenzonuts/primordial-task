import type { ReactNode } from 'react';

import { cn } from '@ui/lib/cn';

interface SeparatorProps {
  readonly orientation?: 'horizontal' | 'vertical';
  readonly className?: string;
}

export const Separator = ({ orientation = 'horizontal', className }: SeparatorProps): ReactNode => {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-divider',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
};
