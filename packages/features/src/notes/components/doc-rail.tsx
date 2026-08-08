import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NOTES_SIDEBAR_WIDTH } from '@features/notes/constants';
import type { Note } from '@features/notes/types';
import { docDetailPath } from '@features/notes/types';
import { ScrollArea } from '@shared/ui/layout/scroll-area';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type DocRailProps = {
  readonly docs: readonly Note[];
  readonly activeDocId?: string | null;
  readonly className?: string;
};

type DocNode = Note & { readonly children: DocNode[] };

const buildDocTree = (docs: readonly Note[]): DocNode[] => {
  const byParent = new Map<string | null, Note[]>();
  for (const doc of docs) {
    const parentId = doc.parentDocId;
    const bucket = byParent.get(parentId) ?? [];
    bucket.push(doc);
    byParent.set(parentId, bucket);
  }
  for (const bucket of byParent.values()) {
    bucket.sort((a, b) => a.orderIndex - b.orderIndex || a.title.localeCompare(b.title));
  }
  const visit = (parentId: string | null): DocNode[] => {
    const children = byParent.get(parentId) ?? [];
    return children.map((doc) => ({
      ...doc,
      children: visit(doc.id),
    }));
  };
  return visit(null);
};

export const DocRail = ({ docs, activeDocId = null, className }: DocRailProps): ReactElement => {
  const navigate = useNavigate();
  const tree = useMemo(() => buildDocTree(docs), [docs]);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    () => new Set(docs.map((d) => d.id)),
  );

  const toggle = (id: string): void => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderNodes = (nodes: readonly DocNode[], depth: number): ReactElement[] => {
    const elements: ReactElement[] = [];
    for (const node of nodes) {
      const hasChildren = node.children.length > 0;
      const isExpanded = expanded.has(node.id);
      const active = activeDocId === node.id;
      elements.push(
        <div
          key={node.id}
          className={cn(
            'flex h-8 items-center gap-1 rounded-md pr-1',
            'hover:bg-state-hover',
            active && 'bg-state-selected',
          )}
          style={{ paddingLeft: 4 + depth * 12 }}
        >
          {hasChildren ? (
            <button
              type="button"
              aria-label={isExpanded ? `Collapse ${node.title}` : `Expand ${node.title}`}
              className="flex size-5 shrink-0 items-center justify-center text-text-muted"
              onClick={() => toggle(node.id)}
            >
              {isExpanded ? (
                <ChevronDown className="size-3.5" aria-hidden />
              ) : (
                <ChevronRight className="size-3.5" aria-hidden />
              )}
            </button>
          ) : (
            <span className="size-5 shrink-0" aria-hidden />
          )}
          <button
            type="button"
            onClick={() => navigate(docDetailPath(node.id))}
            className={cn(
              'flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1 text-left',
              'focus-visible:outline-none focus-visible:ds-focus-ring',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <FileText className="size-3.5 shrink-0 text-text-muted" aria-hidden />
            <Text as="span" variant="body-sm" className="truncate">
              {node.title || 'Untitled'}
            </Text>
          </button>
        </div>,
      );
      if (hasChildren && isExpanded) {
        elements.push(...renderNodes(node.children, depth + 1));
      }
    }
    return elements;
  };

  return (
    <aside
      aria-label="Documentation navigation"
      className={cn(
        'flex h-full min-h-0 flex-col border-r border-border-default bg-surface-sidebar',
        className,
      )}
      style={{ width: NOTES_SIDEBAR_WIDTH }}
    >
      <div className="border-b border-border-subtle px-3 py-2.5">
        <Text variant="caption" muted className="uppercase tracking-wide font-medium">
          Documentation
        </Text>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div role="tree" aria-label="Doc pages" className="flex flex-col gap-0.5 p-2">
          {tree.length === 0 ? (
            <Text variant="caption" muted className="px-2 py-2">
              No pages yet
            </Text>
          ) : (
            renderNodes(tree, 0)
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export type { DocRailProps };
