import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const radioGroupVariants = cva('grid gap-2');

const radioItemVariants = cva([
  'peer relative inline-flex size-8 shrink-0 items-center justify-center',
  'rounded-full focus-visible:outline-none focus-visible:ds-focus-ring',
  'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
]);

const radioControlVariants = cva([
  'flex size-4 items-center justify-center rounded-full border border-border-default',
  'bg-surface-input ds-transition-fast',
  'data-[state=checked]:border-gray-100',
]);

type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

export const RadioGroup = ({ className, ...props }: RadioGroupProps): ReactElement => {
  return <RadioGroupPrimitive.Root className={cn(radioGroupVariants(), className)} {...props} />;
};

export const RadioGroupItem = ({ className, ...props }: RadioGroupItemProps): ReactElement => {
  return (
    <RadioGroupPrimitive.Item className={cn(radioItemVariants(), className)} {...props}>
      <span className={cn(radioControlVariants())} aria-hidden>
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="size-2 rounded-full bg-gray-100" />
        </RadioGroupPrimitive.Indicator>
      </span>
    </RadioGroupPrimitive.Item>
  );
};

export { radioGroupVariants, radioItemVariants };
export type { RadioGroupProps, RadioGroupItemProps };
