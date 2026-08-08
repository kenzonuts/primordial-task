import type { ReactElement, ReactNode } from 'react';

import { DocRail } from '@features/notes/components/doc-rail';
import { NoteEmptyState } from '@features/notes/components/note-empty-state';
import type { Note } from '@features/notes/types';
import { cn } from '@shared/ui/lib/cn';

type DocumentExplorerProps = {
  readonly docs: readonly Note[];
  readonly activeDocId?: string | null;
  readonly children?: ReactNode;
  readonly emptyAction?: ReactNode;
  readonly className?: string;
};

export const DocumentExplorer = ({
  docs,
  activeDocId = null,
  children,
  emptyAction,
  className,
}: DocumentExplorerProps): ReactElement => {
  return (
    <div className={cn('flex h-full min-h-0', className)} data-testid="document-explorer">
      <DocRail docs={docs} activeDocId={activeDocId} />
      <div className="min-w-0 flex-1">
        {docs.length === 0 ? <NoteEmptyState variant="docs" action={emptyAction} /> : children}
      </div>
    </div>
  );
};

export type { DocumentExplorerProps };
