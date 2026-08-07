import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

export const Checkbox = ({ className, ...props }: CheckboxProps): ReactElement => {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        [
          'group peer relative inline-flex size-[32px] shrink-0 items-center justify-center',
          'rounded-md focus-visible:outline-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus)]',
          'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
        ],
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-[16px] items-center justify-center rounded-[var(--radius-sm)] border',
          'bg-surface-input text-gray-950 ds-transition-fast',
          'border-border-default',
          'group-data-[state=checked]:border-gray-100 group-data-[state=checked]:bg-gray-100',
          'group-data-[state=indeterminate]:border-gray-100 group-data-[state=indeterminate]:bg-gray-100',
        )}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Check
            className="size-[12px] group-data-[state=indeterminate]:hidden"
            strokeWidth={2.5}
          />
          <Minus
            className="hidden size-[12px] group-data-[state=indeterminate]:block"
            strokeWidth={2.5}
          />
        </CheckboxPrimitive.Indicator>
      </span>
    </CheckboxPrimitive.Root>
  );
};

export type { CheckboxProps };
