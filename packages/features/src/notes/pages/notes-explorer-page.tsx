import { Plus } from 'lucide-react';
import type { FormEvent, ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CreateNoteDialog,
  type CreateNoteSubmitValues,
  NoteErrorState,
  NotesExplorer,
  NoteSkeleton,
  NotesSidebar,
  NoteToolbar,
} from '@features/notes/components';
import { useNotesContext } from '@features/notes/context/notes-context';
import { createFolderSchema, renameFolderSchema } from '@features/notes/schemas/note-schemas';
import {
  filterNotes,
  notesRepository,
  useFoldersStore,
  useNotesFilterStore,
  useNotesSearchStore,
  useNotesStore,
} from '@features/notes/store';
import type { Note, NoteFolder, NoteTemplate } from '@features/notes/types';
import { noteDetailPath, NOTES_ROUTES } from '@features/notes/types';
import { toast } from '@shared/ui/feedback/toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/overlays/dialog';
import { Button } from '@shared/ui/primitives/button';
import { Input } from '@shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';

export const NotesExplorerPage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId, status, loadNotes } = useNotesContext();

  const notes = useNotesStore((state) => state.notes);
  const error = useNotesStore((state) => state.error);
  const clearError = useNotesStore((state) => state.clearError);
  const createNote = useNotesStore((state) => state.createNote);
  const toggleFavorite = useNotesStore((state) => state.toggleFavorite);
  const togglePinned = useNotesStore((state) => state.togglePinned);
  const duplicateNote = useNotesStore((state) => state.duplicateNote);
  const archiveNote = useNotesStore((state) => state.archiveNote);
  const softDeleteNote = useNotesStore((state) => state.softDeleteNote);
  const moveNote = useNotesStore((state) => state.moveNote);
  const restoreNote = useNotesStore((state) => state.restoreNote);

  const folders = useFoldersStore((state) => state.folders);
  const expandedIds = useFoldersStore((state) => state.expandedIds);
  const toggleExpanded = useFoldersStore((state) => state.toggleExpanded);
  const createFolder = useFoldersStore((state) => state.createFolder);
  const renameFolder = useFoldersStore((state) => state.renameFolder);
  const deleteFolder = useFoldersStore((state) => state.deleteFolder);
  const loadFolders = useFoldersStore((state) => state.loadFolders);

  const filters = useNotesFilterStore((state) => state.filters);
  const setFilters = useNotesFilterStore((state) => state.setFilters);
  const resetFilters = useNotesFilterStore((state) => state.resetFilters);

  const searchValue = useNotesSearchStore((state) => state.query);
  const setSearch = useNotesSearchStore((state) => state.setQuery);

  const [createOpen, setCreateOpen] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);
  const [folderDialog, setFolderDialog] = useState<{
    mode: 'create' | 'rename';
    parentId: string | null;
    folderId: string | null;
    name: string;
  } | null>(null);
  const [moveTarget, setMoveTarget] = useState<Note | null>(null);
  const [moveFolderId, setMoveFolderId] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    void notesRepository
      .listTemplates(workspaceId)
      .then(setTemplates)
      .catch(() => {
        setTemplates([]);
      });
  }, [workspaceId]);

  const filtered = useMemo(() => filterNotes(notes, filters), [notes, filters]);

  const isLoading = status === 'idle' || status === 'loading';
  const hasActiveFilters =
    filters.query.trim().length > 0 ||
    filters.preset !== 'all' ||
    filters.folderId != null ||
    filters.tags.length > 0;

  let emptyVariant: 'none' | 'no-results' | 'trash' = 'none';
  if (filters.preset === 'trash') {
    emptyVariant = 'trash';
  } else if (
    hasActiveFilters ||
    notes.some((note) => note.deletedAt == null && !note.isDocumentation)
  ) {
    emptyVariant = 'no-results';
  }

  const handleCreate = async (values: CreateNoteSubmitValues): Promise<void> => {
    if (!workspaceId) {
      toast.error('Select a workspace before creating a note.');
      return;
    }
    setCreateBusy(true);
    try {
      const note = await createNote({
        workspaceId,
        title: values.title,
        folderId: values.folderId,
        templateId: values.templateId,
      });
      setCreateOpen(false);
      navigate(noteDetailPath(note.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create note.');
    } finally {
      setCreateBusy(false);
    }
  };

  const withWorkspace = (fn: (ws: string) => Promise<void>): void => {
    if (!workspaceId) {
      toast.error('Select a workspace first.');
      return;
    }
    void fn(workspaceId).catch((err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Action failed.');
    });
  };

  const handleFolderSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!workspaceId || !folderDialog) {
      return;
    }
    const schema = folderDialog.mode === 'rename' ? renameFolderSchema : createFolderSchema;
    const parsed = schema.safeParse({
      name: folderDialog.name,
      parentId: folderDialog.parentId,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Invalid folder name.');
      return;
    }
    try {
      if (folderDialog.mode === 'create') {
        await createFolder({
          workspaceId,
          name: parsed.data.name,
          parentId: folderDialog.parentId,
        });
      } else if (folderDialog.folderId) {
        await renameFolder(workspaceId, folderDialog.folderId, parsed.data.name);
      }
      setFolderDialog(null);
      toast.success(folderDialog.mode === 'create' ? 'Folder created.' : 'Folder renamed.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Folder action failed.');
    }
  };

  const handleMoveSubmit = async (): Promise<void> => {
    if (!workspaceId || !moveTarget) {
      return;
    }
    try {
      await moveNote(workspaceId, moveTarget.id, moveFolderId);
      setMoveTarget(null);
      toast.success('Note moved.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not move note.');
    }
  };

  if (status === 'error') {
    return (
      <NoteErrorState
        message={error ?? undefined}
        onRetry={() => {
          clearError();
          void loadNotes();
        }}
      />
    );
  }

  if (isLoading) {
    return <NoteSkeleton />;
  }

  return (
    <div className="flex h-full min-h-0" data-testid="notes-explorer-page">
      <NotesSidebar
        preset={filters.preset}
        folders={folders}
        expandedIds={expandedIds}
        selectedFolderId={filters.folderId}
        onPresetChange={(preset) => {
          if (preset === 'trash') {
            navigate(NOTES_ROUTES.trash);
            return;
          }
          if (preset === 'documentation') {
            navigate(NOTES_ROUTES.docs);
            return;
          }
          setFilters({ preset, folderId: null });
        }}
        onSelectFolder={(folder) => setFilters({ folderId: folder?.id ?? null, preset: 'all' })}
        onToggleFolder={toggleExpanded}
        onCreateFolder={() =>
          setFolderDialog({ mode: 'create', parentId: null, folderId: null, name: '' })
        }
        onCreateChildFolder={(folder) =>
          setFolderDialog({ mode: 'create', parentId: folder.id, folderId: null, name: '' })
        }
        onRenameFolder={(folder) =>
          setFolderDialog({
            mode: 'rename',
            parentId: folder.parentId,
            folderId: folder.id,
            name: folder.name,
          })
        }
        onDeleteFolder={(folder: NoteFolder) => {
          withWorkspace(async (ws) => {
            await deleteFolder(ws, folder.id);
            if (filters.folderId === folder.id) {
              setFilters({ folderId: null });
            }
            await loadFolders(ws);
            toast.success('Folder deleted.');
          });
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <NoteToolbar
          filters={filters}
          searchValue={searchValue}
          onSearchChange={setSearch}
          onFiltersChange={setFilters}
          onResetFilters={resetFilters}
          onCreate={() => setCreateOpen(true)}
          trailing={
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => navigate(NOTES_ROUTES.templates)}
            >
              Templates
            </Button>
          }
        />
        <div className="min-h-0 flex-1 overflow-auto">
          <NotesExplorer
            notes={filtered}
            folders={folders}
            view={filters.view}
            emptyVariant={emptyVariant}
            emptyAction={
              <Button type="button" variant="primary" size="md" onClick={() => setCreateOpen(true)}>
                <Plus aria-hidden />
                New note
              </Button>
            }
            onOpen={(note) => navigate(noteDetailPath(note.id))}
            onToggleFavorite={(note) =>
              withWorkspace(async (ws) => {
                await toggleFavorite(ws, note.id);
              })
            }
            onTogglePinned={(note) =>
              withWorkspace(async (ws) => {
                await togglePinned(ws, note.id);
              })
            }
            onDuplicate={(note) =>
              withWorkspace(async (ws) => {
                const copy = await duplicateNote(ws, note.id);
                navigate(noteDetailPath(copy.id));
              })
            }
            onArchive={(note) =>
              withWorkspace(async (ws) => {
                await archiveNote(ws, note.id);
                toast.success('Note archived.');
              })
            }
            onDelete={(note) =>
              withWorkspace(async (ws) => {
                await softDeleteNote(ws, note.id);
                toast.success('Moved to trash.');
              })
            }
            onMove={(note) => {
              setMoveTarget(note);
              setMoveFolderId(note.folderId);
            }}
            onRestore={(note) =>
              withWorkspace(async (ws) => {
                await restoreNote(ws, note.id);
                toast.success('Note restored.');
              })
            }
          />
        </div>
      </div>

      <CreateNoteDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        folders={folders}
        templates={templates}
        defaultFolderId={filters.folderId}
        loading={createBusy}
        onSubmit={handleCreate}
      />

      <Dialog
        open={folderDialog != null}
        onOpenChange={(open) => {
          if (!open) {
            setFolderDialog(null);
          }
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>
              {folderDialog?.mode === 'rename' ? 'Rename folder' : 'Create folder'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(event) => void handleFolderSubmit(event)}>
            <Input
              value={folderDialog?.name ?? ''}
              placeholder="Folder name"
              aria-label="Folder name"
              autoFocus
              onChange={(event) =>
                setFolderDialog((prev) => (prev ? { ...prev, name: event.target.value } : prev))
              }
            />
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setFolderDialog(null)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={moveTarget != null}
        onOpenChange={(open) => {
          if (!open) {
            setMoveTarget(null);
          }
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Move note</DialogTitle>
          </DialogHeader>
          <Select
            value={moveFolderId ?? 'none'}
            onValueChange={(value) => setMoveFolderId(value === 'none' ? null : value)}
          >
            <SelectTrigger aria-label="Destination folder">
              <SelectValue placeholder="No folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No folder</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter className="mt-4">
            <Button type="button" variant="ghost" onClick={() => setMoveTarget(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void handleMoveSubmit()}>
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
