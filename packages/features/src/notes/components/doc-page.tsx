import type { ReactElement, ReactNode } from 'react';

import { EDITOR_CONTENT_MAX_WIDTH } from '@features/notes/constants';
import { cn } from '@shared/ui/lib/cn';

type DocPageProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
};

/**
 * Readable documentation page shell — centered 720px content width.
 */
export const DocPage = ({ children, className, header, footer }: DocPageProps): ReactElement => {
  return (
    <article className={cn('flex min-h-0 flex-1 flex-col', className)}>
      {header}
      <div className="min-h-0 flex-1 overflow-auto px-6 py-8">
        <div className="mx-auto w-full" style={{ maxWidth: EDITOR_CONTENT_MAX_WIDTH }}>
          {children}
        </div>
      </div>
      {footer}
    </article>
  );
};

export type { DocPageProps };
