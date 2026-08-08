import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';

import {
  DocPagePage,
  DocsExplorerPage,
  NoteCreatePage,
  NoteEditorPage,
  NoteHistoryPage,
  NotesExplorerPage,
  TemplatesPage,
  TrashPage,
} from '@features/notes/pages';
import { NOTES_ROUTES } from '@features/notes/types';

/**
 * Nested notes & documentation routes for the authenticated shell.
 * Spread as children of AuthenticatedLayout Route alongside AppShellRoutes.
 */
export const NotesRoutes: ReactNode = (
  <>
    <Route path={NOTES_ROUTES.list} element={<NotesExplorerPage />} />
    <Route path={NOTES_ROUTES.create} element={<NoteCreatePage />} />
    <Route path={NOTES_ROUTES.templates} element={<TemplatesPage />} />
    <Route path={NOTES_ROUTES.trash} element={<TrashPage />} />
    <Route path={NOTES_ROUTES.history} element={<NoteHistoryPage />} />
    <Route path={NOTES_ROUTES.detail} element={<NoteEditorPage />} />
    <Route path={NOTES_ROUTES.docs} element={<DocsExplorerPage />} />
    <Route path={NOTES_ROUTES.docDetail} element={<DocPagePage />} />
  </>
);
