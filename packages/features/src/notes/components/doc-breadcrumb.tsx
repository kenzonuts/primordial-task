import { ChevronRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { NOTES_ROUTES, docDetailPath } from '@features/notes/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

export type DocBreadcrumbItem = {
  readonly id: string;
  readonly title: string;
};

type DocBreadcrumbProps = {
  readonly items: readonly DocBreadcrumbItem[];
  readonly className?: string;
};

export const DocBreadcrumb = ({ items, className }: DocBreadcrumbProps): ReactElement => {
  return (
    <nav aria-label="Documentation breadcrumb" className={cn('px-6 py-3', className)}>
      <Inline gap={4} align="center" wrap className="text-text-muted">
        <Link
          to={NOTES_ROUTES.docs}
          className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ds-focus-ring"
        >
          <Text as="span" variant="caption">
            Docs
          </Text>
        </Link>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Inline key={item.id} gap={4} align="center">
              <ChevronRight className="size-3.5 shrink-0" aria-hidden />
              {isLast ? (
                <Text as="span" variant="caption" className="text-text-primary" aria-current="page">
                  {item.title}
                </Text>
              ) : (
                <Link
                  to={docDetailPath(item.id)}
                  className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ds-focus-ring"
                >
                  <Text as="span" variant="caption">
                    {item.title}
                  </Text>
                </Link>
              )}
            </Inline>
          );
        })}
      </Inline>
    </nav>
  );
};

export type { DocBreadcrumbProps };
