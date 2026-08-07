import type { ReactElement, ReactNode } from 'react';

import { PageHeader } from '@features/shell/components/page-header';
import { cn } from '@shared/ui/lib/cn';

type ContentLayoutProps = {
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
  readonly children?: ReactNode;
  readonly className?: string;
};

/**
 * Standard module content wrapper: fluid max width, 24px padding, page header + body.
 */
export const ContentLayout = ({
  title,
  description,
  actions,
  children,
  className,
}: ContentLayoutProps): ReactElement => {
  return (
    <div className={cn('mx-auto w-full max-w-none p-24', className)}>
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </div>
  );
};
