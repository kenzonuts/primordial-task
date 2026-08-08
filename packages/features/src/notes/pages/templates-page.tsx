import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NoteErrorState, NoteSkeleton, TemplateGallery } from '@features/notes/components';
import { useNotesContext } from '@features/notes/context/notes-context';
import { notesRepository, useNotesStore } from '@features/notes/store';
import type { NoteTemplate } from '@features/notes/types';
import { noteDetailPath, NOTES_ROUTES } from '@features/notes/types';
import { ContentLayout } from '@features/shell/layouts/content-layout';
import { toast } from '@shared/ui/feedback/toast';
import { Button } from '@shared/ui/primitives/button';

export const TemplatesPage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId } = useNotesContext();
  const createNote = useNotesStore((state) => state.createNote);
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    setStatus('loading');
    void notesRepository
      .listTemplates(workspaceId)
      .then((items) => {
        setTemplates(items);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [workspaceId]);

  if (!workspaceId) {
    return (
      <NoteErrorState title="No workspace" message="Select a workspace to browse templates." />
    );
  }

  if (status === 'loading') {
    return <NoteSkeleton withSidebar={false} />;
  }

  if (status === 'error') {
    return (
      <NoteErrorState
        message="Templates could not be loaded."
        onRetry={() => {
          setStatus('loading');
          void notesRepository
            .listTemplates(workspaceId)
            .then((items) => {
              setTemplates(items);
              setStatus('ready');
            })
            .catch(() => setStatus('error'));
        }}
      />
    );
  }

  return (
    <ContentLayout
      title="Templates"
      description="Start from a standardized note or documentation structure."
      actions={
        <Button type="button" variant="ghost" size="md" onClick={() => navigate(NOTES_ROUTES.list)}>
          Back to notes
        </Button>
      }
    >
      <div data-testid="templates-page">
        <TemplateGallery
          templates={templates}
          onUseTemplate={(template) => {
            void createNote({
              workspaceId,
              title: template.name,
              templateId: template.id,
              noteType: template.noteType,
            })
              .then((note) => navigate(noteDetailPath(note.id)))
              .catch((err: unknown) => {
                toast.error(err instanceof Error ? err.message : 'Could not create from template.');
              });
          }}
        />
      </div>
    </ContentLayout>
  );
};
