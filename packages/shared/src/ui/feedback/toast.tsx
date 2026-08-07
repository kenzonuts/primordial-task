import type { ComponentProps, CSSProperties, ReactElement } from 'react';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

import { cn } from '@shared/ui/lib/cn';

type ToasterProps = ComponentProps<typeof SonnerToaster>;

const toasterStyle = {
  '--width': '400px',
  zIndex: 'var(--z-toast)',
} as CSSProperties;

const Toaster = ({ className, theme = 'dark', ...props }: ToasterProps): ReactElement => {
  return (
    <SonnerToaster
      theme={theme}
      className={cn('toaster group', className)}
      position="bottom-right"
      visibleToasts={3}
      duration={5000}
      gap={10}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            'group toast flex w-[min(100vw-2rem,400px)] items-start gap-3 rounded-lg border',
            'border-border-default bg-surface-elevated px-4 py-3.5 text-sm text-text-primary',
            'shadow-floating ds-fade-in',
          ),
          title: 'font-medium text-text-primary',
          description: 'text-text-secondary',
          actionButton: cn(
            'rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-950',
            'ds-transition-fast hover:bg-gray-50',
          ),
          cancelButton: cn(
            'rounded-md bg-state-hover px-2.5 py-1 text-xs font-medium text-text-secondary',
            'ds-transition-fast hover:bg-state-pressed',
          ),
          closeButton: cn(
            'rounded-sm text-text-muted opacity-70 hover:opacity-100',
            'focus-visible:outline-none focus-visible:ds-focus-ring',
          ),
          success: 'border-success/30 bg-success-bg text-success',
          error: 'border-danger/30 bg-danger-bg text-danger',
          warning: 'border-warning/30 bg-warning-bg text-warning',
          info: 'border-info/30 bg-info-bg text-info',
        },
      }}
      style={toasterStyle}
      {...props}
    />
  );
};

type ToastMessage = Parameters<typeof sonnerToast>[0];
type ToastData = Parameters<typeof sonnerToast>[1];

type ToastFn = {
  (message: ToastMessage, data?: ToastData): string | number;
  success: (message: ToastMessage, data?: ToastData) => string | number;
  error: (message: ToastMessage, data?: ToastData) => string | number;
  warning: (message: ToastMessage, data?: ToastData) => string | number;
  info: (message: ToastMessage, data?: ToastData) => string | number;
  message: (message: ToastMessage, data?: ToastData) => string | number;
  dismiss: typeof sonnerToast.dismiss;
  custom: typeof sonnerToast.custom;
  promise: typeof sonnerToast.promise;
  loading: typeof sonnerToast.loading;
};

const toast: ToastFn = Object.assign(
  (message: ToastMessage, data?: ToastData) => sonnerToast(message, data),
  {
    success: (message: ToastMessage, data?: ToastData) => sonnerToast.success(message, data),
    error: (message: ToastMessage, data?: ToastData) => sonnerToast.error(message, data),
    warning: (message: ToastMessage, data?: ToastData) => sonnerToast.warning(message, data),
    info: (message: ToastMessage, data?: ToastData) => sonnerToast.info(message, data),
    message: (message: ToastMessage, data?: ToastData) => sonnerToast.message(message, data),
    promise: sonnerToast.promise,
    dismiss: sonnerToast.dismiss,
    custom: sonnerToast.custom,
    loading: sonnerToast.loading,
  },
);

export { Toaster, toast };
export type { ToasterProps, ToastFn };
