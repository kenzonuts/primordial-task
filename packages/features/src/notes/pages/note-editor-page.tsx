import { ArrowLeft, History, MessageSquare, Sparkles } from 'lucide-react';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  CommentThread,
  NoteEditor,
  NoteErrorState,
  NoteSkeleton,
  VersionHistory,
} from '@features/notes/components';
import { useNotesContext } from '@features/notes/context/notes-context';
import {
  useCommentsStore,
  useEditorStore,
  useHistoryStore,
  useNotesStore,
} from '@features/notes/store';
import { noteHistoryPath, NOTES_ROUTES } from '@features/notes/types';
import { toast } from '@shared/ui/feedback/toast';
import { Inline } from '@shared/ui/layout/inline';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const NoteEditorPage = (): ReactElement => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workspaceId } = useNotesContext();

  const loadNote = useEditorStore((state) => state.loadNote);
  const clearEditor = useEditorStore((state) => state.clear);
  const activeNote = useEditorStore((state) => state.activeNote);
  const saveState = useEditorStore((state) => state.saveState);
  const editorError = useEditorStore((state) => state.error);

  const loadNotes = useNotesStore((state) => state.loadNotes);

  const versions = useHistoryStore((state) => state.versions);
  const selectedVersionId = useHistoryStore((state) => state.selectedVersionId);
  const historyStatus = useHistoryStore((state) => state.status);
  const loadHistory = useHistoryStore((state) => state.loadHistory);
  const createSnapshot = useHistoryStore((state) => state.createSnapshot);
  const restoreVersion = useHistoryStore((state) => state.restoreVersion);
  const selectVersion = useHistoryStore((state) => state.selectVersion);
  const clearHistory = useHistoryStore((state) => state.clear);

  const comments = useCommentsStore((state) => state.comments);
  const commentsStatus = useCommentsStore((state) => state.status);
  const loadComments = useCommentsStore((state) => state.loadComments);
  const addComment = useCommentsStore((state) => state.addComment);
  const resolveComment = useCommentsStore((state) => state.resolveComment);
  const deleteComment = useCommentsStore((state) => state.deleteComment);
  const clearComments = useCommentsStore((state) => state.clear);

  const [showHistory, setShowHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!workspaceId || !id) {
      return;
    }
    void loadNote(workspaceId, id);
    return () => {
      clearEditor();
      clearHistory();
      clearComments();
    };
  }, [workspaceId, id, loadNote, clearEditor, clearHistory, clearComments]);

  useEffect(() => {
    if (!workspaceId || !id || !showHistory) {
      return;
    }
    void loadHistory(workspaceId, id);
  }, [workspaceId, id, showHistory, loadHistory]);

  useEffect(() => {
    if (!workspaceId || !id || !showComments) {
      return;
    }
    void loadComments(workspaceId, id);
  }, [workspaceId, id, showComments, loadComments]);

  if (!workspaceId) {
    return <NoteErrorState title="No workspace" message="Select a workspace to edit notes." />;
  }

  if (saveState === 'syncing' && !activeNote) {
    return <NoteSkeleton withSidebar={false} />;
  }

  if (saveState === 'error' && !activeNote) {
    return (
      <NoteErrorState
        title="Note not found"
        message={editorError ?? 'This note could not be loaded.'}
        onRetry={() => void loadNote(workspaceId, id)}
        action={
          <Button type="button" variant="ghost" onClick={() => navigate(NOTES_ROUTES.list)}>
            Back to notes
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col" data-testid="note-editor-page">
      <div className="flex shrink-0 items-center gap-2 border-b border-border-default px-4 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Back to notes"
          onClick={() => navigate(NOTES_ROUTES.list)}
        >
          <ArrowLeft className="size-4" aria-hidden />
        </Button>
        <Text as="span" variant="body-sm" muted className="mr-auto truncate">
          {activeNote?.title || 'Untitled'}
        </Text>
        <Inline gap={4} align="center">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-pressed={showHistory}
            onClick={() => {
              setShowHistory((value) => !value);
              setShowComments(false);
            }}
          >
            <History className="size-3.5" aria-hidden />
            History
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-pressed={showComments}
            onClick={() => {
              setShowComments((value) => !value);
              setShowHistory(false);
            }}
          >
            <MessageSquare className="size-3.5" aria-hidden />
            Comments
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => toast.info('AI actions coming soon.')}
          >
            <Sparkles className="size-3.5" aria-hidden />
            AI
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => navigate(noteHistoryPath(id))}
          >
            Full history
          </Button>
        </Inline>
      </div>

      <div className="flex min-h-0 flex-1">
        <NoteEditor workspaceId={workspaceId} noteId={id} />
        {showHistory ? (
          <VersionHistory
            versions={versions}
            selectedVersionId={selectedVersionId}
            status={historyStatus}
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
            }}
          />
        ) : null}
        {showComments ? (
          <CommentThread
            comments={comments}
            status={commentsStatus}
            onAdd={async (body, parentId) => {
              await addComment(workspaceId, id, body, parentId);
            }}
            onResolve={async (commentId, resolved) => {
              await resolveComment(workspaceId, id, commentId, resolved);
            }}
            onDelete={async (commentId) => {
              await deleteComment(workspaceId, id, commentId);
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
