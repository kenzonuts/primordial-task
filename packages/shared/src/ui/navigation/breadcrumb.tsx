import { ChevronRight } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';

type BreadcrumbProps = ComponentPropsWithoutRef<'nav'>;

const Breadcrumb = ({ className, children, ...props }: BreadcrumbProps): ReactElement => {
  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)} {...props}>
      <ol className="flex h-7 flex-wrap items-center gap-1.5 text-[13px] leading-5 text-text-secondary">
        {children}
      </ol>
    </nav>
  );
};

type BreadcrumbItemProps = ComponentPropsWithoutRef<'li'>;

const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps): ReactElement => {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
};

type BreadcrumbLinkProps = ComponentPropsWithoutRef<'a'>;

const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps): ReactElement => {
  return (
    <a
      className={cn(
        'rounded-sm text-text-secondary ds-transition-fast hover:text-text-primary',
        'focus-visible:outline-none focus-visible:ds-focus-ring',
        className,
      )}
      {...props}
    />
  );
};

type BreadcrumbPageProps = ComponentPropsWithoutRef<'span'>;

const BreadcrumbPage = ({ className, ...props }: BreadcrumbPageProps): ReactElement => {
  return (
    <span
      aria-current="page"
      className={cn('font-medium text-text-primary', className)}
      {...props}
    />
  );
};

type BreadcrumbSeparatorProps = ComponentPropsWithoutRef<'li'> & {
  readonly children?: ReactNode;
};

const BreadcrumbSeparator = ({
  className,
  children,
  ...props
}: BreadcrumbSeparatorProps): ReactElement => {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('inline-flex items-center text-text-muted', className)}
      {...props}
    >
      {children ?? <ChevronRight className="size-3.5" />}
    </li>
  );
};

const BreadcrumbEllipsis = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'span'>): ReactElement => {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-7 items-center justify-center text-text-muted', className)}
      {...props}
    >
      …<span className="sr-only">More</span>
    </span>
  );
};

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

export type {
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
};
