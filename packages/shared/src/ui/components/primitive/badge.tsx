import type { ReactNode } from 'react';

import { cn } from '@ui/lib/cn';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  readonly children: ReactNode;
  readonly tone?: BadgeTone;
  readonly size?: BadgeSize;
  readonly className?: string;
}

const toneClass: Record<BadgeTone, string> = {
  neutral: 'bg-hover text-text-secondary border border-border-default',
  success: 'bg-success-bg text-success border border-transparent',
  warning: 'bg-warning-bg text-warning border border-transparent',
  danger: 'bg-danger-bg text-danger border border-transparent',
  info: 'bg-info-bg text-info border border-transparent',
};

const sizeClass: Record<BadgeSize, string> = {
  sm: 'h-[18px] px-2 text-[11px]',
  md: 'h-[22px] px-2.5 text-xs',
};

export const Badge = ({
  children,
  tone = 'neutral',
  size = 'md',
  className,
}: BadgeProps): ReactNode => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-[560] leading-none',
        toneClass[tone],
        sizeClass[size],
        className,
      )}
    >
      {children}
    </span>
  );
};
