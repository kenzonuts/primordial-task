import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

type ContextMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubTrigger
> & {
  readonly inset?: boolean;
};

const ContextMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps): ReactElement => {
  return (
    <ContextMenuPrimitive.SubTrigger
      className={cn(
        'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
        'outline-none focus:bg-state-hover data-[state=open]:bg-state-hover',
        '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        inset && 'pl-8',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto text-text-muted" aria-hidden="true" />
    </ContextMenuPrimitive.SubTrigger>
  );
};

type ContextMenuSubContentProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>;

const ContextMenuSubContent = ({
  className,
  ...props
}: ContextMenuSubContentProps): ReactElement => {
  return (
    <ContextMenuPrimitive.SubContent
      className={cn(
        'z-[var(--z-dropdown)] min-w-[200px] overflow-hidden rounded-lg border border-border-default',
        'bg-surface-elevated p-1 text-text-primary shadow-popover ds-fade-in ds-scale-in',
        className,
      )}
      {...props}
    />
  );
};

type ContextMenuContentProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>;

const ContextMenuContent = ({ className, ...props }: ContextMenuContentProps): ReactElement => {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cn(
          'z-[var(--z-dropdown)] min-w-[200px] overflow-hidden rounded-lg border border-border-default',
          'bg-surface-elevated p-1 text-text-primary shadow-popover ds-fade-in ds-scale-in',
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
};

type ContextMenuItemProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
  readonly inset?: boolean;
  readonly variant?: 'default' | 'danger';
};

const ContextMenuItem = ({
  className,
  inset,
  variant = 'default',
  ...props
}: ContextMenuItemProps): ReactElement => {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        'relative flex h-[30px] cursor-default select-none items-center gap-2 rounded-sm px-2 text-sm',
        'outline-none focus:bg-state-hover data-[disabled]:pointer-events-none',
        'data-[disabled]:opacity-[var(--opacity-disabled)]',
        '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        inset && 'pl-8',
        variant === 'danger' && 'text-danger focus:bg-danger-bg',
        className,
      )}
      {...props}
    />
  );
};

type ContextMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.CheckboxItem
>;

const ContextMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: ContextMenuCheckboxItemProps): ReactElement => {
  return (
    <ContextMenuPrimitive.CheckboxItem
      className={cn(
        'relative flex h-[30px] cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm',
        'outline-none focus:bg-state-hover data-[disabled]:pointer-events-none',
        'data-[disabled]:opacity-[var(--opacity-disabled)]',
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Check className="size-4" aria-hidden="true" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
};

type ContextMenuRadioItemProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>;

const ContextMenuRadioItem = ({
  className,
  children,
  ...props
}: ContextMenuRadioItemProps): ReactElement => {
  return (
    <ContextMenuPrimitive.RadioItem
      className={cn(
        'relative flex h-[30px] cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm',
        'outline-none focus:bg-state-hover data-[disabled]:pointer-events-none',
        'data-[disabled]:opacity-[var(--opacity-disabled)]',
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current" aria-hidden="true" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
};

type ContextMenuLabelProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
  readonly inset?: boolean;
};

const ContextMenuLabel = ({ className, inset, ...props }: ContextMenuLabelProps): ReactElement => {
  return (
    <ContextMenuPrimitive.Label
      className={cn('px-2 py-1.5 text-xs font-medium text-text-muted', inset && 'pl-8', className)}
      {...props}
    />
  );
};

type ContextMenuSeparatorProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>;

const ContextMenuSeparator = ({ className, ...props }: ContextMenuSeparatorProps): ReactElement => {
  return (
    <ContextMenuPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-divider', className)}
      {...props}
    />
  );
};

const ContextMenuShortcut = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'span'>): ReactElement => {
  return (
    <span className={cn('ml-auto text-xs tracking-wide text-text-muted', className)} {...props} />
  );
};

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};

export type {
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioItemProps,
  ContextMenuLabelProps,
  ContextMenuSeparatorProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
};
