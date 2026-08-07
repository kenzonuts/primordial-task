import * as SelectPrimitive from '@radix-ui/react-select';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const selectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between gap-[8px] rounded-md border bg-surface-input',
    'text-text-primary ds-transition-fast',
    'focus-visible:outline-none focus-visible:border-border-strong',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus)]',
    'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
    'data-[placeholder]:text-text-placeholder',
    '[&>span]:line-clamp-1',
  ],
  {
    variants: {
      size: {
        sm: 'h-[28px] px-[8px] text-xs leading-4',
        md: 'h-[32px] px-[12px] text-sm leading-[22px]',
        lg: 'h-[40px] px-[12px] text-sm leading-[22px]',
      },
      error: {
        true: 'border-danger focus-visible:border-danger',
        false: 'border-border-default',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  },
);

type SelectProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;

type SelectTriggerProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
  VariantProps<typeof selectTriggerVariants>;

type SelectContentProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Content>;

type SelectItemProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

type SelectValueProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Value>;

type SelectGroupProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Group>;

type SelectLabelProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;

type SelectSeparatorProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>;

export const Select = (props: SelectProps): ReactElement => {
  return <SelectPrimitive.Root {...props} />;
};

export const SelectGroup = (props: SelectGroupProps): ReactElement => {
  return <SelectPrimitive.Group {...props} />;
};

export const SelectValue = (props: SelectValueProps): ReactElement => {
  return <SelectPrimitive.Value {...props} />;
};

export const SelectTrigger = ({
  className,
  size,
  error = false,
  children,
  ...props
}: SelectTriggerProps): ReactElement => {
  return (
    <SelectPrimitive.Trigger
      className={cn(selectTriggerVariants({ size, error }), className)}
      aria-invalid={error || undefined}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-[16px] shrink-0 text-text-muted" aria-hidden />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
};

export const SelectScrollUpButton = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>): ReactElement => {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn('flex cursor-default items-center justify-center py-[4px]', className)}
      {...props}
    >
      <ChevronUp className="size-[16px] text-text-muted" aria-hidden />
    </SelectPrimitive.ScrollUpButton>
  );
};

export const SelectScrollDownButton = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>): ReactElement => {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn('flex cursor-default items-center justify-center py-[4px]', className)}
      {...props}
    >
      <ChevronDown className="size-[16px] text-text-muted" aria-hidden />
    </SelectPrimitive.ScrollDownButton>
  );
};

export const SelectContent = ({
  className,
  children,
  position = 'popper',
  ...props
}: SelectContentProps): ReactElement => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          [
            'relative z-[var(--z-dropdown)] max-h-[288px] min-w-[128px] overflow-hidden',
            'rounded-md border border-border-default bg-surface-elevated text-text-primary shadow-popover',
            'ds-scale-in',
          ],
          position === 'popper' &&
            'data-[side=bottom]:translate-y-[4px] data-[side=left]:-translate-x-[4px] data-[side=right]:translate-x-[4px] data-[side=top]:-translate-y-[4px]',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-[4px]',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

export const SelectLabel = ({ className, ...props }: SelectLabelProps): ReactElement => {
  return (
    <SelectPrimitive.Label
      className={cn('px-[8px] py-[6px] text-xs font-medium text-text-muted', className)}
      {...props}
    />
  );
};

export const SelectItem = ({ className, children, ...props }: SelectItemProps): ReactElement => {
  return (
    <SelectPrimitive.Item
      className={cn(
        [
          'relative flex w-full cursor-default select-none items-center rounded-sm py-[6px] pl-[8px] pr-[32px]',
          'text-sm text-text-primary outline-none ds-transition-fast',
          'focus:bg-state-hover data-[highlighted]:bg-state-hover',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]',
        ],
        className,
      )}
      {...props}
    >
      <span className="absolute right-[8px] flex size-[14px] items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-[16px] text-text-primary" aria-hidden />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};

export const SelectSeparator = ({ className, ...props }: SelectSeparatorProps): ReactElement => {
  return (
    <SelectPrimitive.Separator
      className={cn('-mx-[4px] my-[4px] h-px bg-[var(--divider)]', className)}
      {...props}
    />
  );
};

export { selectTriggerVariants };
export type {
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
  SelectValueProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectSeparatorProps,
};
