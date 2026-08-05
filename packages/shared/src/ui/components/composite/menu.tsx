import type { ReactNode } from 'react';

import { cn } from '@ui/lib/cn';

interface MenuItem {
  readonly id: string;
  readonly label: string;
  readonly shortcut?: string;
  readonly danger?: boolean;
  readonly disabled?: boolean;
  readonly checked?: boolean;
  readonly onSelect?: () => void;
}

interface MenuProps {
  readonly items: MenuItem[];
  readonly role?: 'menu' | 'listbox';
  readonly className?: string;
}

export const Menu = ({ items, role = 'menu', className }: MenuProps): ReactNode => {
  return (
    <div
      role={role}
      className={cn(
        'min-w-[200px] rounded-lg border border-border-default bg-elevated p-1 shadow-popover',
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          role={role === 'menu' ? 'menuitem' : 'option'}
          aria-selected={role === 'listbox' ? item.checked : undefined}
          type="button"
          disabled={item.disabled}
          className={cn(
            'flex h-[30px] w-full items-center justify-between rounded-sm px-2 text-left text-xs transition-colors',
            item.danger
              ? 'text-danger hover:bg-danger-bg'
              : 'text-text-secondary hover:bg-hover hover:text-text-primary',
            item.checked && 'bg-selected text-text-primary',
            item.disabled && 'cursor-not-allowed text-text-disabled',
          )}
          onClick={() => {
            item.onSelect?.();
          }}
        >
          <span>{item.label}</span>
          <span className="text-[11px] text-text-muted">{item.shortcut}</span>
        </button>
      ))}
    </div>
  );
};

export const DropdownMenu = Menu;
export const ContextMenu = Menu;

interface CommandItem {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly onSelect?: () => void;
}

interface CommandMenuProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
  readonly items: CommandItem[];
}

export const CommandMenu = ({ query, onQueryChange, items }: CommandMenuProps): ReactNode => {
  return (
    <div className="w-full max-w-[640px] rounded-xl border border-border-default bg-elevated shadow-floating">
      <div className="border-b border-border-subtle p-3">
        <input
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
          }}
          aria-label="Command search"
          role="combobox"
          className="h-9 w-full rounded-sm border border-border-default bg-input px-3 text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-focus"
          placeholder="Type a command..."
        />
      </div>
      <div role="listbox" className="max-h-[420px] overflow-auto p-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            className="flex h-11 w-full items-center justify-between rounded-md px-3 text-left text-sm text-text-secondary hover:bg-hover hover:text-text-primary"
            onClick={() => {
              item.onSelect?.();
            }}
          >
            <span>{item.label}</span>
            <span className="text-xs text-text-muted">{item.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
