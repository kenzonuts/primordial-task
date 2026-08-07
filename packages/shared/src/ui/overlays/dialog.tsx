import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { ComponentPropsWithoutRef, HTMLAttributes, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

type DialogOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

const DialogOverlay = ({ className, ...props }: DialogOverlayProps): ReactElement => {
  return (
    <DialogPrimitive.Overlay
      className={cn('fixed inset-0 z-[var(--z-modal)] bg-overlay-scrim ds-fade-in', className)}
      {...props}
    />
  );
};

const dialogContentVariants = cva(
  [
    'fixed left-1/2 top-1/2 z-[var(--z-modal)] grid w-full -translate-x-1/2 -translate-y-1/2',
    'max-h-[80vh] gap-4 overflow-y-auto border border-border-default bg-surface-elevated',
    'p-6 text-text-primary shadow-modal rounded-xl outline-none ds-fade-in ds-scale-in',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-[400px]',
        md: 'max-w-[560px]',
        lg: 'max-w-[760px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants> & {
    readonly showCloseButton?: boolean;
  };

const DialogContent = ({
  className,
  children,
  size,
  showCloseButton = true,
  ...props
}: DialogContentProps): ReactElement => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            className={cn(
              'absolute right-4 top-4 rounded-sm text-text-muted opacity-80',
              'ds-transition-fast hover:opacity-100 hover:text-text-primary',
              'focus-visible:outline-none focus-visible:ds-focus-ring',
              'disabled:pointer-events-none',
            )}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden="true" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};

const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return <div className={cn('flex flex-col gap-1.5 pr-8 text-left', className)} {...props} />;
};

const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
};

type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

const DialogTitle = ({ className, ...props }: DialogTitleProps): ReactElement => {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-semibold leading-[26px] text-text-primary', className)}
      {...props}
    />
  );
};

type DialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

const DialogDescription = ({ className, ...props }: DialogDescriptionProps): ReactElement => {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm leading-[22px] text-text-secondary', className)}
      {...props}
    />
  );
};

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  dialogContentVariants,
};

export type { DialogContentProps, DialogOverlayProps, DialogTitleProps, DialogDescriptionProps };
