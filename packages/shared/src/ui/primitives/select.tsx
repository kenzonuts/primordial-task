import * as SelectPrimitive from '@radix-ui/react-select';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const selectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between gap-2 rounded-md border bg-surface-input',
    'text-text-primary ds-transition-fast',
    'focus-visible:outline-none focus-visible:border-border-strong focus-visible:ds-focus-ring',
    'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
    'data-[placeholder]:text-text-placeholder',
    '[&>span]:line-clamp-1',
  ],
  {
    variants: {
      size: {
        sm: 'h-7 px-2 text-xs leading-4',
        md: 'h-8 px-3 text-sm leading-[22px]',
        lg: 'h-10 px-3 text-sm leading-[22px]',
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
        <ChevronDown className="size-4 shrink-0 text-text-muted" aria-hidden />
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
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronUp className="size-4 text-text-muted" aria-hidden />
    </SelectPrimitive.ScrollUpButton>
  );
};

export const SelectScrollDownButton = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>): ReactElement => {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronDown className="size-4 text-text-muted" aria-hidden />
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
            'relative z-[var(--z-dropdown)] max-h-72 min-w-[8rem] overflow-hidden',
            'rounded-md border border-border-default bg-surface-elevated text-text-primary shadow-popover',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          ],
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
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
      className={cn('px-2 py-1.5 text-xs font-medium text-text-muted', className)}
      {...props}
    />
  );
};

export const SelectItem = ({ className, children, ...props }: SelectItemProps): ReactElement => {
  return (
    <SelectPrimitive.Item
      className={cn(
        [
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8',
          'text-sm text-text-primary outline-none ds-transition-fast',
          'focus:bg-state-hover data-[highlighted]:bg-state-hover',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]',
        ],
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4 text-text-primary" aria-hidden />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};

export const SelectSeparator = ({ className, ...props }: SelectSeparatorProps): ReactElement => {
  return (
    <SelectPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-[var(--divider)]', className)}
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
