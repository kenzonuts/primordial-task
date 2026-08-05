import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { cn } from '@ui/lib/cn';

interface TabsProps {
  readonly tabs: Array<{ id: string; label: string; content: ReactNode; disabled?: boolean }>;
  readonly defaultValue?: string;
}

export const Tabs = ({ tabs, defaultValue }: TabsProps): ReactNode => {
  const firstEnabled = useMemo(() => tabs.find((tab) => !tab.disabled)?.id ?? '', [tabs]);
  const [active, setActive] = useState(defaultValue ?? firstEnabled);
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" className="inline-flex items-center gap-1 rounded-md bg-surface p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            disabled={tab.disabled}
            className={cn(
              'h-8 rounded-md px-3 text-[13px] font-[560] text-text-secondary transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)]',
              active === tab.id && 'bg-selected text-text-primary',
              'hover:bg-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-app',
              tab.disabled && 'cursor-not-allowed text-text-disabled',
            )}
            onClick={() => {
              if (!tab.disabled) {
                setActive(tab.id);
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={`panel-${current.id}`}
        role="tabpanel"
        className="rounded-md border border-border-subtle p-3"
      >
        {current.content}
      </div>
    </div>
  );
};

interface AccordionItem {
  readonly id: string;
  readonly title: string;
  readonly content: ReactNode;
}

export const Accordion = ({ items }: { readonly items: AccordionItem[] }): ReactNode => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="rounded-lg border border-border-subtle">
      {items.map((item) => {
        const open = openId === item.id;

        return (
          <div key={item.id} className="border-b border-border-subtle last:border-b-0">
            <button
              type="button"
              aria-expanded={open}
              className="flex h-10 w-full items-center justify-between px-3 text-left text-sm font-[560] text-text-primary hover:bg-hover"
              onClick={() => {
                setOpenId((current) => (current === item.id ? null : item.id));
              }}
            >
              <span>{item.title}</span>
              <span>{open ? '-' : '+'}</span>
            </button>
            {open ? (
              <div className="px-3 pb-3 text-sm text-text-secondary">{item.content}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

interface BreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly onClick?: () => void;
}

export const Breadcrumb = ({ items }: { readonly items: BreadcrumbItem[] }): ReactNode => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex h-7 items-center gap-2 text-[13px] text-text-secondary">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.id} className="inline-flex items-center gap-2">
              {item.onClick && !isLast ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="rounded-sm px-1 py-0.5 hover:bg-hover hover:text-text-primary"
                >
                  {item.label}
                </button>
              ) : (
                <span className={isLast ? 'text-text-primary' : undefined}>{item.label}</span>
              )}
              {!isLast ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

interface PaginationProps {
  readonly page: number;
  readonly pageCount: number;
  readonly onChange: (page: number) => void;
}

export const Pagination = ({ page, pageCount, onChange }: PaginationProps): ReactNode => {
  return (
    <div className="inline-flex items-center gap-2 text-xs text-text-secondary">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => {
          onChange(page - 1);
        }}
        className="h-8 rounded-md border border-border-default px-3 hover:bg-hover disabled:text-text-disabled"
      >
        Previous
      </button>
      <span>
        {page} / {pageCount}
      </span>
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => {
          onChange(page + 1);
        }}
        className="h-8 rounded-md border border-border-default px-3 hover:bg-hover disabled:text-text-disabled"
      >
        Next
      </button>
    </div>
  );
};
