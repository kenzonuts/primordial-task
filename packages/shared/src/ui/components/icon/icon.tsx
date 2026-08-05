import type { LucideIcon } from 'lucide-react';
import type { AriaAttributes, ReactNode } from 'react';

import { cn } from '@ui/lib/cn';
import { iconSizes } from '@ui/tokens/metrics';

export type IconSize = keyof typeof iconSizes;

interface AppIconProps {
  icon: LucideIcon;
  size?: IconSize;
  strokeWidth?: number;
  className?: string;
  title?: string;
}

export const AppIcon = ({
  icon: Icon,
  size = 'md',
  strokeWidth,
  className,
  title,
}: AppIconProps): ReactNode => {
  const pixelSize = iconSizes[size];
  const resolvedStrokeWidth = strokeWidth ?? (size === 'xl' ? 1.5 : 1.75);

  const ariaHidden: AriaAttributes['aria-hidden'] = title ? undefined : true;

  return (
    <span title={title} aria-hidden={ariaHidden}>
      <Icon
        role={title ? 'img' : undefined}
        size={pixelSize}
        strokeWidth={resolvedStrokeWidth}
        className={cn('shrink-0', className)}
      />
    </span>
  );
};
