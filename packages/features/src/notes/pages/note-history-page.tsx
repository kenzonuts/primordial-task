import { ArrowLeft } from 'lucide-react';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { NoteErrorState, NoteSkeleton, VersionHistory } from '@features/notes/components';
import { useNotesContext } from '@features/notes/context/notes-context';
import { useEditorStore, useHistoryStore, useNotesStore } from '@features/notes/store';
import { noteDetailPath, NOTES_ROUTES } from '@features/notes/types';
import { toast } from '@shared/ui/feedback/toast';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const NoteHistoryPage = (): ReactElement => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workspaceId } = useNotesContext();

  const versions = useHistoryStore((state) => state.versions);
  const selectedVersionId = useHistoryStore((state) => state.selectedVersionId);
  const status = useHistoryStore((state) => state.status);
  const loadHistory = useHistoryStore((state) => state.loadHistory);
  const createSnapshot = useHistoryStore((state) => state.createSnapshot);
  const restoreVersion = useHistoryStore((state) => state.restoreVersion);
  const selectVersion = useHistoryStore((state) => state.selectVersion);

  const loadNote = useEditorStore((state) => state.loadNote);
  const activeNote = useEditorStore((state) => state.activeNote);
  const loadNotes = useNotesStore((state) => state.loadNotes);

  useEffect(() => {
    if (!workspaceId || !id) {
      return;
    }
    void loadHistory(workspaceId, id);
    void loadNote(workspaceId, id);
  }, [workspaceId, id, loadHistory, loadNote]);

  if (!workspaceId) {
    return <NoteErrorState title="No workspace" message="Select a workspace to view history." />;
  }

  if (status === 'loading' && versions.length === 0) {
    return <NoteSkeleton withSidebar={false} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col" data-testid="note-history-page">
      <div className="flex items-center gap-2 border-b border-border-default px-4 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Back to note"
          onClick={() => navigate(noteDetailPath(id))}
        >
          <ArrowLeft className="size-4" aria-hidden />
        </Button>
        <Text as="h1" variant="h3" className="truncate">
          History · {activeNote?.title || 'Note'}
        </Text>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="ml-auto"
          onClick={() => navigate(NOTES_ROUTES.list)}
        >
          All notes
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 justify-center bg-surface-base p-4">
        <VersionHistory
          className="w-full max-w-md border border-border-subtle"
          versions={versions}
          selectedVersionId={selectedVersionId}
          status={status}
          onSelect={(version) => selectVersion(version.id)}
          onCreateSnapshot={async () => {
            await createSnapshot(workspaceId, id);
            toast.success('Snapshot created.');
          }}
          onRestore={async (version) => {
            await restoreVersion(workspaceId, id, version.id);
            await loadNote(workspaceId, id);
            await loadNotes(workspaceId);
            toast.success('Version restored.');
            navigate(noteDetailPath(id));
          }}
        />
      </div>
    </div>
  );
};
