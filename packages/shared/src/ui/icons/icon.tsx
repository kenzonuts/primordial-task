import type { LucideIcon, LucideProps } from 'lucide-react';
import type { ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';
import { iconSizes, iconStrokeWidths } from '@shared/ui/tokens/icons';
import type { IconSizeToken } from '@shared/ui/tokens/icons';

export type IconSize = IconSizeToken;

export type IconProps = Omit<LucideProps, 'ref' | 'size' | 'strokeWidth'> & {
  readonly icon: LucideIcon;
  readonly size?: IconSize;
  readonly strokeWidth?: number;
  readonly className?: string;
  readonly decorative?: boolean;
  readonly label?: string;
};

export const Icon = ({
  icon: IconComponent,
  size = 'default',
  strokeWidth,
  className,
  decorative,
  label,
  ...rest
}: IconProps): ReactElement => {
  const pixelSize = iconSizes[size];
  const resolvedStrokeWidth =
    strokeWidth ??
    (size === 'empty' || size === 'navigation' ? iconStrokeWidths.large : iconStrokeWidths.default);

  const isDecorative = decorative ?? !label;

  return (
    <IconComponent
      size={pixelSize}
      strokeWidth={resolvedStrokeWidth}
      focusable="false"
      {...rest}
      className={cn('shrink-0 text-current', className)}
      aria-hidden={isDecorative ? true : undefined}
      aria-label={isDecorative ? undefined : label}
      role={isDecorative ? undefined : 'img'}
    />
  );
};
