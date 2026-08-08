import { BookOpen, Clock, FileText, FolderPlus, Pin, Star, Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { FolderTree } from '@features/notes/components/folder-tree';
import { NOTES_SIDEBAR_WIDTH } from '@features/notes/constants';
import type { NoteFilterPreset, NoteFolder } from '@features/notes/types';
import { NOTES_ROUTES } from '@features/notes/types';
import { ScrollArea } from '@shared/ui/layout/scroll-area';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type NotesSidebarProps = {
  readonly preset: NoteFilterPreset;
  readonly folders: readonly NoteFolder[];
  readonly expandedIds: ReadonlySet<string>;
  readonly selectedFolderId: string | null;
  readonly onPresetChange: (preset: NoteFilterPreset) => void;
  readonly onSelectFolder: (folder: NoteFolder | null) => void;
  readonly onToggleFolder: (folderId: string) => void;
  readonly onCreateFolder?: () => void;
  readonly onRenameFolder?: (folder: NoteFolder) => void;
  readonly onCreateChildFolder?: (folder: NoteFolder) => void;
  readonly onDeleteFolder?: (folder: NoteFolder) => void;
  readonly className?: string;
};

type NavButtonProps = {
  readonly label: string;
  readonly icon: typeof FileText;
  readonly active: boolean;
  readonly onClick: () => void;
};

const NavButton = ({ label, icon: Icon, active, onClick }: NavButtonProps): ReactElement => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-8 w-full items-center gap-2 rounded-md px-2 text-left',
        'text-text-secondary hover:bg-state-hover hover:text-text-primary',
        'focus-visible:outline-none focus-visible:ds-focus-ring',
        active && 'bg-state-selected text-text-primary',
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <Text as="span" variant="body-sm" className="truncate">
        {label}
      </Text>
    </button>
  );
};

export const NotesSidebar = ({
  preset,
  folders,
  expandedIds,
  selectedFolderId,
  onPresetChange,
  onSelectFolder,
  onToggleFolder,
  onCreateFolder,
  onRenameFolder,
  onCreateChildFolder,
  onDeleteFolder,
  className,
}: NotesSidebarProps): ReactElement => {
  const navigate = useNavigate();

  return (
    <aside
      aria-label="Notes sidebar"
      className={cn(
        'flex h-full min-h-0 flex-col border-r border-border-default bg-surface-sidebar',
        className,
      )}
      style={{ width: NOTES_SIDEBAR_WIDTH }}
    >
      <ScrollArea className="min-h-0 flex-1">
        <Stack gap={16} className="p-3">
          <section aria-label="Browse">
            <Text variant="caption" muted className="mb-1.5 uppercase tracking-wide font-medium">
              Browse
            </Text>
            <Stack gap={2}>
              <NavButton
                label="All notes"
                icon={FileText}
                active={preset === 'all' && selectedFolderId == null}
                onClick={() => {
                  onSelectFolder(null);
                  onPresetChange('all');
                }}
              />
              <NavButton
                label="Favorites"
                icon={Star}
                active={preset === 'favorites'}
                onClick={() => {
                  onSelectFolder(null);
                  onPresetChange('favorites');
                }}
              />
              <NavButton
                label="Pinned"
                icon={Pin}
                active={preset === 'pinned'}
                onClick={() => {
                  onSelectFolder(null);
                  onPresetChange('pinned');
                }}
              />
              <NavButton
                label="Recent"
                icon={Clock}
                active={preset === 'recent'}
                onClick={() => {
                  onSelectFolder(null);
                  onPresetChange('recent');
                }}
              />
              <NavButton
                label="Trash"
                icon={Trash2}
                active={preset === 'trash'}
                onClick={() => {
                  onSelectFolder(null);
                  onPresetChange('trash');
                  navigate(NOTES_ROUTES.trash);
                }}
              />
              <NavButton
                label="Documentation"
                icon={BookOpen}
                active={preset === 'documentation'}
                onClick={() => {
                  onSelectFolder(null);
                  onPresetChange('documentation');
                  navigate(NOTES_ROUTES.docs);
                }}
              />
            </Stack>
          </section>

          <section aria-label="Folders">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <Text variant="caption" muted className="uppercase tracking-wide font-medium">
                Folders
              </Text>
              {onCreateFolder ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Create folder"
                  className="size-6 p-0"
                  onClick={onCreateFolder}
                >
                  <FolderPlus className="size-3.5" aria-hidden />
                </Button>
              ) : null}
            </div>
            <FolderTree
              folders={folders}
              expandedIds={expandedIds}
              selectedFolderId={selectedFolderId}
              onSelect={(folder) => {
                onSelectFolder(folder);
                if (folder) {
                  onPresetChange('all');
                }
              }}
              onToggle={onToggleFolder}
              onRename={onRenameFolder}
              onCreateChild={onCreateChildFolder}
              onDelete={onDeleteFolder}
            />
          </section>
        </Stack>
      </ScrollArea>
    </aside>
  );
};

export type { NotesSidebarProps };
