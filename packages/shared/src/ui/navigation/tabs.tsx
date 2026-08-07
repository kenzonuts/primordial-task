import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const Tabs = TabsPrimitive.Root;

type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>;

const tabsListVariants = cva('inline-flex items-center text-text-secondary', {
  variants: {
    variant: {
      underline: 'h-[34px] gap-1 border-b border-border-default',
      pill: 'h-[34px] gap-1 rounded-lg bg-surface-base p-1',
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
});

const TabsList = ({ className, variant = 'underline', ...props }: TabsListProps): ReactElement => {
  return (
    <TabsPrimitive.List
      data-variant={variant ?? 'underline'}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
};

type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

const TabsTrigger = ({ className, ...props }: TabsTriggerProps): ReactElement => {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-3 text-sm font-medium',
        'ds-transition-fast outline-none focus-visible:ds-focus-ring',
        'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
        'text-text-secondary hover:text-text-primary',
        'data-[state=active]:text-text-primary',
        // Underline variant (default from parent data attribute via group-like selectors)
        '[[data-variant=underline]_&]:h-full [[data-variant=underline]_&]:rounded-none',
        '[[data-variant=underline]_&]:border-b-2 [[data-variant=underline]_&]:border-transparent',
        '[[data-variant=underline]_&]:data-[state=active]:border-gray-100',
        // Pill variant
        '[[data-variant=pill]_&]:h-7 [[data-variant=pill]_&]:rounded-md',
        '[[data-variant=pill]_&]:data-[state=active]:bg-surface-elevated',
        '[[data-variant=pill]_&]:data-[state=active]:shadow-sm',
        className,
      )}
      {...props}
    />
  );
};

type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

const TabsContent = ({ className, ...props }: TabsContentProps): ReactElement => {
  return (
    <TabsPrimitive.Content
      className={cn('mt-4 outline-none focus-visible:ds-focus-ring', className)}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
export type { TabsListProps, TabsTriggerProps, TabsContentProps };
