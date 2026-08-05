import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';

import { cn } from '@ui/lib/cn';

interface LabeledControlProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: ReactNode;
  readonly description?: ReactNode;
}

export const Checkbox = ({
  label,
  description,
  className,
  id,
  ...props
}: LabeledControlProps): ReactNode => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <label
      className={cn('flex min-h-8 cursor-pointer items-start gap-2', className)}
      htmlFor={fieldId}
    >
      <input
        id={fieldId}
        type="checkbox"
        className="mt-[2px] h-4 w-4 rounded-sm border border-border-default bg-input accent-gray-50"
        {...props}
      />
      <span className="flex flex-col gap-1">
        <span className="text-xs font-[560] text-text-primary">{label}</span>
        {description ? <span className="text-xs text-text-muted">{description}</span> : null}
      </span>
    </label>
  );
};

export const Radio = ({
  label,
  description,
  className,
  id,
  ...props
}: LabeledControlProps): ReactNode => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <label
      className={cn('flex min-h-8 cursor-pointer items-start gap-2', className)}
      htmlFor={fieldId}
    >
      <input
        id={fieldId}
        type="radio"
        className="mt-[2px] h-4 w-4 border border-border-default bg-input accent-gray-50"
        {...props}
      />
      <span className="flex flex-col gap-1">
        <span className="text-xs font-[560] text-text-primary">{label}</span>
        {description ? <span className="text-xs text-text-muted">{description}</span> : null}
      </span>
    </label>
  );
};

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly label: ReactNode;
}

export const Switch = ({ label, checked, className, id, ...props }: SwitchProps): ReactNode => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <label
      htmlFor={fieldId}
      className={cn('flex min-h-8 cursor-pointer items-center gap-2', className)}
    >
      <span
        className={cn(
          'relative inline-flex h-5 w-9 items-center rounded-full border border-border-default transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)]',
          checked ? 'bg-gray-100' : 'bg-surface',
        )}
      >
        <span
          className={cn(
            'absolute h-4 w-4 rounded-full bg-app transition-transform duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)]',
            checked ? 'translate-x-4' : 'translate-x-0.5',
          )}
        />
      </span>
      <input
        id={fieldId}
        type="checkbox"
        checked={checked}
        className="sr-only"
        role="switch"
        {...props}
      />
      <span className="text-xs font-[560] text-text-primary">{label}</span>
    </label>
  );
};
