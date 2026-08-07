import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

type PaginationProps = ComponentPropsWithoutRef<'nav'>;

const Pagination = ({ className, ...props }: PaginationProps): ReactElement => {
  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
};

const PaginationContent = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'ul'>): ReactElement => {
  return <ul className={cn('flex flex-row items-center gap-1', className)} {...props} />;
};

const PaginationItem = ({ className, ...props }: ComponentPropsWithoutRef<'li'>): ReactElement => {
  return <li className={cn('', className)} {...props} />;
};

type PaginationLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly isActive?: boolean;
};

const PaginationLink = ({
  className,
  isActive = false,
  type = 'button',
  ...props
}: PaginationLinkProps): ReactElement => {
  return (
    <button
      type={type}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md text-sm',
        'ds-transition-fast outline-none focus-visible:ds-focus-ring',
        'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
        isActive
          ? 'bg-state-selected text-text-primary'
          : 'text-text-secondary hover:bg-state-hover hover:text-text-primary',
        className,
      )}
      {...props}
    />
  );
};

const PaginationPrevious = ({
  className,
  children,
  ...props
}: PaginationLinkProps): ReactElement => {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn('h-8 w-auto gap-1 px-2.5', className)}
      {...props}
    >
      <ChevronLeft className="size-4" aria-hidden="true" />
      <span>{children ?? 'Previous'}</span>
    </PaginationLink>
  );
};

const PaginationNext = ({ className, children, ...props }: PaginationLinkProps): ReactElement => {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn('h-8 w-auto gap-1 px-2.5', className)}
      {...props}
    >
      <span>{children ?? 'Next'}</span>
      <ChevronRight className="size-4" aria-hidden="true" />
    </PaginationLink>
  );
};

const PaginationEllipsis = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'span'>): ReactElement => {
  return (
    <span
      aria-hidden="true"
      className={cn('flex size-8 items-center justify-center text-text-muted', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};

export type { PaginationProps, PaginationLinkProps };
