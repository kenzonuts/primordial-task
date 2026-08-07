import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { ComponentPropsWithoutRef, HTMLAttributes, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@shared/ui/overlays/dialog';

const Drawer = Dialog;
const DrawerTrigger = DialogTrigger;
const DrawerClose = DialogClose;
const DrawerPortal = DialogPortal;

const drawerContentVariants = cva(
  [
    'fixed inset-y-0 right-0 z-[var(--z-drawer)] flex h-full flex-col',
    'border-l border-border-default bg-surface-elevated text-text-primary shadow-lg',
    'outline-none ds-slide-in-right',
  ],
  {
    variants: {
      size: {
        default: 'w-[360px] max-w-[100vw]',
        wide: 'w-[480px] max-w-[100vw]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

type DrawerContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof drawerContentVariants> & {
    readonly showCloseButton?: boolean;
  };

const DrawerContent = ({
  className,
  children,
  size,
  showCloseButton = true,
  ...props
}: DrawerContentProps): ReactElement => {
  return (
    <DrawerPortal>
      <DialogOverlay className="z-[var(--z-drawer)]" />
      <DialogPrimitive.Content
        className={cn(drawerContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            className={cn(
              'absolute right-4 top-4 rounded-sm text-text-muted opacity-80',
              'ds-transition-fast hover:opacity-100 hover:text-text-primary',
              'focus-visible:outline-none focus-visible:ds-focus-ring',
            )}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden="true" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DrawerPortal>
  );
};

const DrawerHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 border-b border-border-subtle px-5 py-4 pr-12',
        className,
      )}
      {...props}
    />
  );
};

const DrawerFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return (
    <div
      className={cn(
        'mt-auto flex flex-col-reverse gap-2 border-t border-border-subtle px-5 py-4 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
};

const DrawerBody = ({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return <div className={cn('flex-1 overflow-y-auto px-5 py-4', className)} {...props} />;
};

type DrawerTitleProps = ComponentPropsWithoutRef<typeof DialogTitle>;

const DrawerTitle = ({ className, ...props }: DrawerTitleProps): ReactElement => {
  return (
    <DialogTitle
      className={cn('text-lg font-semibold leading-[26px] text-text-primary', className)}
      {...props}
    />
  );
};

type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof DialogDescription>;

const DrawerDescription = ({ className, ...props }: DrawerDescriptionProps): ReactElement => {
  return (
    <DialogDescription
      className={cn('text-sm leading-[22px] text-text-secondary', className)}
      {...props}
    />
  );
};

export {
  Drawer,
  DrawerPortal,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerTitle,
  DrawerDescription,
  drawerContentVariants,
};

export type { DrawerContentProps, DrawerTitleProps, DrawerDescriptionProps };
