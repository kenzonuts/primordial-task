import type { ReactElement } from 'react';
import { useMemo } from 'react';

import { FolderItem } from '@features/notes/components/folder-item';
import type { NoteFolder } from '@features/notes/types';
import { ScrollArea } from '@shared/ui/layout/scroll-area';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type FolderTreeProps = {
  readonly folders: readonly NoteFolder[];
  readonly expandedIds: ReadonlySet<string>;
  readonly selectedFolderId?: string | null;
  readonly onSelect: (folder: NoteFolder | null) => void;
  readonly onToggle: (folderId: string) => void;
  readonly onRename?: (folder: NoteFolder) => void;
  readonly onCreateChild?: (folder: NoteFolder) => void;
  readonly onDelete?: (folder: NoteFolder) => void;
  readonly className?: string;
};

type FolderNode = NoteFolder & { readonly children: FolderNode[] };

const buildTree = (folders: readonly NoteFolder[]): FolderNode[] => {
  const byParent = new Map<string | null, NoteFolder[]>();
  for (const folder of folders) {
    const bucket = byParent.get(folder.parentId) ?? [];
    bucket.push(folder);
    byParent.set(folder.parentId, bucket);
  }
  for (const bucket of byParent.values()) {
    bucket.sort((a, b) => a.orderIndex - b.orderIndex || a.name.localeCompare(b.name));
  }
  const visit = (parentId: string | null): FolderNode[] => {
    const children = byParent.get(parentId) ?? [];
    return children.map((folder) => ({
      ...folder,
      children: visit(folder.id),
    }));
  };
  return visit(null);
};

export const FolderTree = ({
  folders,
  expandedIds,
  selectedFolderId = null,
  onSelect,
  onToggle,
  onRename,
  onCreateChild,
  onDelete,
  className,
}: FolderTreeProps): ReactElement => {
  const tree = useMemo(() => buildTree(folders), [folders]);

  const renderNodes = (nodes: readonly FolderNode[], depth: number): ReactElement[] => {
    const elements: ReactElement[] = [];
    for (const node of nodes) {
      const hasChildren = node.children.length > 0;
      const expanded = expandedIds.has(node.id);
      elements.push(
        <FolderItem
          key={node.id}
          folder={node}
          depth={depth}
          expanded={expanded}
          selected={selectedFolderId === node.id}
          hasChildren={hasChildren}
          onSelect={onSelect}
          onToggle={(folder) => onToggle(folder.id)}
          onRename={onRename}
          onCreateChild={onCreateChild}
          onDelete={onDelete}
        />,
      );
      if (hasChildren && expanded) {
        elements.push(...renderNodes(node.children, depth + 1));
      }
    }
    return elements;
  };

  return (
    <div className={cn('min-h-0', className)}>
      <ScrollArea className="max-h-[320px]">
        <div role="tree" aria-label="Folders" className="flex flex-col gap-0.5 pr-1">
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={cn(
              'flex h-8 items-center rounded-md px-2 text-left',
              'hover:bg-state-hover focus-visible:outline-none focus-visible:ds-focus-ring',
              selectedFolderId == null && 'bg-state-selected',
            )}
          >
            <Text as="span" variant="body-sm">
              All folders
            </Text>
          </button>
          {tree.length === 0 ? (
            <Text variant="caption" muted className="px-2 py-1">
              No folders yet
            </Text>
          ) : (
            renderNodes(tree, 0)
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export type { FolderTreeProps };
