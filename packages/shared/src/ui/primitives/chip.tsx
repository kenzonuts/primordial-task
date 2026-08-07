import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { HTMLAttributes, MouseEventHandler, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';

const chipVariants = cva(
  [
    'inline-flex max-w-full items-center gap-[4px] rounded-md border border-border-default',
    'bg-surface-elevated text-text-primary ds-transition-fast',
  ],
  {
    variants: {
      size: {
        sm: 'h-[24px] pl-[8px] text-xs leading-4',
        md: 'h-[28px] pl-[10px] text-sm leading-[22px]',
      },
      removable: {
        true: '',
        false: 'pr-[8px]',
      },
    },
    compoundVariants: [
      { removable: true, size: 'sm', className: 'pr-[2px]' },
      { removable: true, size: 'md', className: 'pr-[4px]' },
    ],
    defaultVariants: {
      size: 'md',
      removable: false,
    },
  },
);

type ChipProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof chipVariants> & {
    readonly removable?: boolean;
    readonly onRemove?: MouseEventHandler<HTMLButtonElement>;
    readonly removeLabel?: string;
    readonly leading?: ReactNode;
  };

export const Chip = ({
  className,
  size,
  removable = false,
  onRemove,
  removeLabel = 'Remove',
  leading,
  children,
  ...props
}: ChipProps): ReactElement => {
  return (
    <span className={cn(chipVariants({ size, removable }), className)} {...props}>
      {leading ? (
        <span className="flex shrink-0 items-center text-text-muted [&_svg]:size-[14px]">
          {leading}
        </span>
      ) : null}
      <span className="truncate">{children}</span>
      {removable ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-[var(--radius-sm)]',
            'text-text-muted hover:bg-state-hover hover:text-text-primary',
            'focus-visible:outline-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus)]',
            'ds-transition-fast',
            size === 'sm' ? 'size-[20px]' : 'size-[24px]',
          )}
        >
          <X className={size === 'sm' ? 'size-[12px]' : 'size-[14px]'} aria-hidden />
        </button>
      ) : null}
    </span>
  );
};

export { chipVariants };
export type { ChipProps };
