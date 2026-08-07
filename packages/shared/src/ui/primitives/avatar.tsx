import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full bg-surface-elevated text-text-secondary',
  {
    variants: {
      size: {
        xs: 'size-6 text-[10px] leading-3',
        sm: 'size-7 text-[11px] leading-4',
        md: 'size-8 text-xs leading-4',
        lg: 'size-10 text-sm leading-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type AvatarProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>;

type AvatarImageProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>;

type AvatarFallbackProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
  readonly initials?: string;
};

export const Avatar = ({ className, size, ...props }: AvatarProps): ReactElement => {
  return <AvatarPrimitive.Root className={cn(avatarVariants({ size }), className)} {...props} />;
};

export const AvatarImage = ({ className, ...props }: AvatarImageProps): ReactElement => {
  return (
    <AvatarPrimitive.Image
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  );
};

export const AvatarFallback = ({
  className,
  initials,
  children,
  ...props
}: AvatarFallbackProps): ReactElement => {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'flex size-full items-center justify-center bg-state-selected font-medium uppercase',
        className,
      )}
      {...props}
    >
      {initials ?? children}
    </AvatarPrimitive.Fallback>
  );
};

export { avatarVariants };
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
