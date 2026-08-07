import type { ReactElement, ReactNode, Ref } from 'react';

import { Alert, type AlertProps } from '@shared/ui/feedback/alert';
import { cn } from '@shared/ui/lib/cn';

type AuthenticationAlertProps = Omit<AlertProps, 'variant' | 'role' | 'ref'> & {
  readonly variant?: 'danger' | 'info';
  readonly children?: ReactNode;
  readonly ref?: Ref<HTMLDivElement>;
};

export const AuthenticationAlert = ({
  variant = 'danger',
  title,
  children,
  className,
  ref,
  ...props
}: AuthenticationAlertProps): ReactElement => {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={cn('rounded-lg outline-none focus-visible:ds-focus-ring', className)}
    >
      <Alert role="alert" variant={variant} title={title} {...props}>
        {children}
      </Alert>
    </div>
  );
};

export type { AuthenticationAlertProps };
