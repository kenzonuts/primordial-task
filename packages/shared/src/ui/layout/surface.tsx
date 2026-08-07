import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';

export type SurfaceVariant = 'base' | 'elevated' | 'card' | 'sidebar' | 'nav' | 'input';

const surfaceVariantClasses: Record<SurfaceVariant, string> = {
  base: 'bg-surface-base',
  elevated: 'bg-surface-elevated',
  card: 'bg-surface-card',
  sidebar: 'bg-surface-sidebar',
  nav: 'bg-surface-nav',
  input: 'bg-surface-input',
};

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  readonly variant?: SurfaceVariant;
  readonly bordered?: boolean;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly style?: CSSProperties;
};

export const Surface = ({
  variant = 'base',
  bordered = false,
  className,
  children,
  ...rest
}: SurfaceProps): ReactElement => {
  return (
    <div
      className={cn(
        surfaceVariantClasses[variant],
        bordered && 'border border-border-default',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export { surfaceVariantClasses };
