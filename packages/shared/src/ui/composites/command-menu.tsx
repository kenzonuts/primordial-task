import { Search } from 'lucide-react';
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';

import { cn } from '@shared/ui/lib/cn';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@shared/ui/overlays/dialog';

type CommandMenuProps = ComponentPropsWithoutRef<typeof Dialog> & {
  readonly children?: ReactNode;
};

const CommandMenu = ({ children, ...props }: CommandMenuProps): ReactElement => {
  return <Dialog {...props}>{children}</Dialog>;
};

type CommandMenuContentProps = Omit<
  ComponentPropsWithoutRef<typeof DialogContent>,
  'size' | 'showCloseButton'
> & {
  readonly title?: string;
  readonly description?: string;
};

const CommandMenuContent = ({
  className,
  children,
  title = 'Command menu',
  description = 'Search commands and navigate quickly',
  ...props
}: CommandMenuContentProps): ReactElement => {
  return (
    <DialogContent
      size="lg"
      showCloseButton={false}
      className={cn(
        'top-[20%] z-[var(--z-command)] max-w-[640px] translate-y-0 gap-0 overflow-hidden p-0',
        'shadow-floating',
        className,
      )}
      {...props}
    >
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <DialogDescription className="sr-only">{description}</DialogDescription>
      {children}
    </DialogContent>
  );
};

type CommandMenuInputProps = ComponentPropsWithoutRef<'input'>;

const CommandMenuInput = ({ className, ...props }: CommandMenuInputProps): ReactElement => {
  return (
    <div className="flex items-center gap-2 border-b border-border-subtle px-4">
      <Search className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
      <input
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="true"
        autoComplete="off"
        spellCheck={false}
        className={cn(
          'h-12 w-full bg-transparent text-sm text-text-primary outline-none',
          'placeholder:text-text-placeholder',
          className,
        )}
        {...props}
      />
    </div>
  );
};

type CommandMenuListProps = HTMLAttributes<HTMLDivElement>;

const CommandMenuList = ({ className, ...props }: CommandMenuListProps): ReactElement => {
  return (
    <div
      role="listbox"
      className={cn('max-h-[min(70vh,420px)] overflow-y-auto p-2', className)}
      {...props}
    />
  );
};

type CommandMenuGroupProps = HTMLAttributes<HTMLDivElement> & {
  readonly heading?: ReactNode;
};

const CommandMenuGroup = ({
  className,
  heading,
  children,
  ...props
}: CommandMenuGroupProps): ReactElement => {
  return (
    <div className={cn('py-1', className)} role="group" {...props}>
      {heading ? (
        <div className="px-2 py-1.5 text-xs font-medium text-text-muted">{heading}</div>
      ) : null}
      {children}
    </div>
  );
};

type CommandMenuItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly selected?: boolean;
  readonly shortcut?: ReactNode;
};

const CommandMenuItem = ({
  className,
  selected = false,
  disabled = false,
  shortcut,
  children,
  type = 'button',
  ...props
}: CommandMenuItemProps): ReactElement => {
  return (
    <button
      type={type}
      role="option"
      aria-selected={selected}
      disabled={disabled}
      className={cn(
        'flex h-11 w-full items-center gap-3 rounded-md px-2 text-left text-sm text-text-primary',
        'outline-none ds-transition-fast',
        'hover:bg-state-hover focus-visible:bg-state-hover focus-visible:ds-focus-ring',
        'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
        selected && 'bg-state-selected',
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut ? (
        <kbd className="ml-auto shrink-0 text-xs tracking-wide text-text-muted">{shortcut}</kbd>
      ) : null}
    </button>
  );
};

type CommandMenuEmptyProps = HTMLAttributes<HTMLDivElement>;

const CommandMenuEmpty = ({
  className,
  children = 'No results found',
  ...props
}: CommandMenuEmptyProps): ReactElement => {
  return (
    <div
      role="status"
      className={cn('px-4 py-8 text-center text-sm text-text-muted', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  CommandMenu,
  CommandMenuContent,
  CommandMenuInput,
  CommandMenuList,
  CommandMenuItem,
  CommandMenuEmpty,
  CommandMenuGroup,
};

export type {
  CommandMenuProps,
  CommandMenuContentProps,
  CommandMenuInputProps,
  CommandMenuListProps,
  CommandMenuItemProps,
  CommandMenuEmptyProps,
  CommandMenuGroupProps,
};
