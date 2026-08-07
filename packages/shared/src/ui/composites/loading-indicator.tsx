import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';
import { Spinner, type SpinnerProps } from '@shared/ui/primitives/spinner';

type LoadingIndicatorProps = HTMLAttributes<HTMLDivElement> & {
  readonly label?: string;
  readonly size?: SpinnerProps['size'];
};

export const LoadingIndicator = ({
  className,
  label = 'Loading',
  size = 'page',
  ...props
}: LoadingIndicatorProps): ReactElement => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-[var(--space-12)] text-text-secondary',
        className,
      )}
      {...props}
    >
      <Spinner size={size} label={label} />
      {label ? (
        <span aria-hidden="true" className="text-sm leading-[22px]">
          {label}
        </span>
      ) : null}
    </div>
  );
};

export type { LoadingIndicatorProps };
