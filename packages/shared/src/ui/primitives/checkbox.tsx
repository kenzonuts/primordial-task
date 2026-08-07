import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, Minus } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const checkboxVariants = cva(
  [
    'peer relative inline-flex size-8 shrink-0 items-center justify-center',
    'rounded-md focus-visible:outline-none focus-visible:ds-focus-ring',
    'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {},
    defaultVariants: {},
  },
);

const checkboxControlVariants = cva([
  'flex size-4 items-center justify-center rounded-[var(--radius-sm)] border',
  'bg-surface-input text-gray-950 ds-transition-fast',
  'border-border-default',
  'data-[state=checked]:border-gray-100 data-[state=checked]:bg-gray-100',
  'data-[state=indeterminate]:border-gray-100 data-[state=indeterminate]:bg-gray-100',
]);

type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>;

export const Checkbox = ({ className, checked, ...props }: CheckboxProps): ReactElement => {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      className={cn(checkboxVariants(), className)}
      {...props}
    >
      <span
        className={cn(
          checkboxControlVariants(),
          checked === true || checked === 'indeterminate' ? 'border-gray-100 bg-gray-100' : null,
        )}
        data-state={
          checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked'
        }
        aria-hidden
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          {checked === 'indeterminate' ? (
            <Minus className="size-3" strokeWidth={2.5} />
          ) : (
            <Check className="size-3" strokeWidth={2.5} />
          )}
        </CheckboxPrimitive.Indicator>
      </span>
    </CheckboxPrimitive.Root>
  );
};

export { checkboxVariants };
export type { CheckboxProps };
