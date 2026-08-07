import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const cardVariants = cva(
  'rounded-lg border border-border-default bg-surface-card text-text-primary outline-none',
  {
    variants: {
      variant: {
        default: 'p-4 shadow-sm',
        interactive: [
          'p-4 shadow-sm cursor-pointer ds-transition-fast',
          'hover:bg-state-hover hover:border-border-strong',
          'focus-visible:ds-focus-ring active:bg-state-pressed',
        ].join(' '),
        selected: 'p-4 border-border-strong bg-state-selected shadow-sm',
        compact: 'p-3 shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

const Card = ({ className, variant, ...props }: CardProps): ReactElement => {
  const isInteractive = variant === 'interactive';

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
};

const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return <div className={cn('mb-3 flex flex-col gap-1.5', className)} {...props} />;
};

const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>): ReactElement => {
  return (
    <h3
      className={cn('text-[15px] font-semibold leading-[22px] text-text-primary', className)}
      {...props}
    />
  );
};

const CardDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>): ReactElement => {
  return <p className={cn('text-sm leading-[22px] text-text-secondary', className)} {...props} />;
};

const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return <div className={cn('text-sm text-text-primary', className)} {...props} />;
};

const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return <div className={cn('mt-4 flex items-center gap-2', className)} {...props} />;
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };

export type { CardProps };
