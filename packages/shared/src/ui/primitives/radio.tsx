import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

export const RadioGroup = ({ className, ...props }: RadioGroupProps): ReactElement => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-[8px]', className)} {...props} />;
};

export const RadioGroupItem = ({ className, ...props }: RadioGroupItemProps): ReactElement => {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        [
          'group peer relative inline-flex size-[32px] shrink-0 items-center justify-center',
          'rounded-full focus-visible:outline-none',
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
          'flex size-[16px] items-center justify-center rounded-full border border-border-default',
          'bg-surface-input ds-transition-fast',
          'group-data-[state=checked]:border-gray-100',
        )}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="size-[8px] rounded-full bg-gray-100" />
        </RadioGroupPrimitive.Indicator>
      </span>
    </RadioGroupPrimitive.Item>
  );
};

export type { RadioGroupProps, RadioGroupItemProps };
