import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { useNavigationStore } from '@features/shell/store/navigation-store';
import { cn } from '@shared/ui/lib/cn';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@shared/ui/navigation/breadcrumb';

export type ShellBreadcrumbItem = {
  readonly label: string;
  readonly path?: string;
};

type ShellBreadcrumbProps = {
  readonly items?: readonly ShellBreadcrumbItem[];
  readonly className?: string;
};

export const ShellBreadcrumb = ({
  items,
  className,
}: ShellBreadcrumbProps): ReactElement | null => {
  const storeItems = useNavigationStore((state) => state.breadcrumbs);
  const crumbs = items ?? storeItems;

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={cn(className)}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <BreadcrumbItem key={`${crumb.label}-${index}`}>
            {index > 0 ? <BreadcrumbSeparator /> : null}
            {isLast || !crumb.path ? (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            ) : (
              <Link
                to={crumb.path}
                className={cn(
                  'rounded-sm text-text-secondary ds-transition-fast hover:text-text-primary',
                  'focus-visible:outline-none focus-visible:ds-focus-ring',
                )}
              >
                {crumb.label}
              </Link>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export type { ShellBreadcrumbProps };
