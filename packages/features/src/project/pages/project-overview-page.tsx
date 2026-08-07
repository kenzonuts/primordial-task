import { Pin, Star } from 'lucide-react';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ProjectHeader } from '@features/project/components/project-header';
import { ProjectOverview } from '@features/project/components/project-overview';
import { useProjectContext } from '@features/project/context/project-context';
import {
  PLACEHOLDER_PROJECT_ACTIVITY,
  PLACEHOLDER_PROJECT_DEADLINES,
  PLACEHOLDER_PROJECT_STATS,
} from '@features/project/services/project-service';
import { useProjectStore } from '@features/project/store/project-store';
import {
  PROJECT_ROUTES,
  projectDetailPath,
  projectEditPath,
  projectSettingsPath,
} from '@features/project/types';
import { ContentLayout } from '@features/shell/layouts/content-layout';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';

export const ProjectOverviewPage = (): ReactElement => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { workspaceId } = useProjectContext();
  const currentProject = useProjectStore((state) => state.currentProject);
  const status = useProjectStore((state) => state.status);
  const members = useProjectStore((state) => state.members);
  const loadProject = useProjectStore((state) => state.loadProject);
  const loadMembers = useProjectStore((state) => state.loadMembers);
  const toggleFavorite = useProjectStore((state) => state.toggleFavorite);
  const togglePinned = useProjectStore((state) => state.togglePinned);
  const duplicateProject = useProjectStore((state) => state.duplicateProject);
  const archiveProject = useProjectStore((state) => state.archiveProject);
  const restoreProject = useProjectStore((state) => state.restoreProject);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!workspaceId || !id) {
      return;
    }
    void loadProject(workspaceId, id);
    void loadMembers(workspaceId, id);
  }, [workspaceId, id, loadProject, loadMembers]);

  const project = currentProject?.id === id ? currentProject : null;
  const isLoading = status === 'idle' || status === 'loading';

  if (!workspaceId) {
    return (
      <ContentLayout title="Project">
        <Alert variant="warning" className="mt-24" title="No workspace selected">
          Select a workspace to open projects.
        </Alert>
      </ContentLayout>
    );
  }

  if (isLoading && !project) {
    return (
      <ContentLayout title="Project">
        <div className="mt-24 flex justify-center">
          <LoadingIndicator label="Loading project" />
        </div>
      </ContentLayout>
    );
  }

  if (!project) {
    return (
      <ContentLayout title="Project">
        <EmptyState
          className="mt-24"
          title="Project not found"
          description="This project may have been deleted or you no longer have access."
          action={
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                navigate(PROJECT_ROUTES.list);
              }}
            >
              Back to projects
            </Button>
          }
        />
      </ContentLayout>
    );
  }

  const runAction = async (action: () => Promise<unknown>, success: string): Promise<void> => {
    setBusy(true);
    try {
      await action();
      toast.success(success);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Action failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-none p-24">
      <ProjectHeader
        project={project}
        actions={
          <Inline gap={8} className="flex-wrap">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                navigate(projectEditPath(project.id));
              }}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                navigate(projectSettingsPath(project.id));
              }}
            >
              Settings
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              loading={busy}
              aria-pressed={project.isFavorite}
              onClick={() => {
                void runAction(
                  () => toggleFavorite(workspaceId, project.id),
                  project.isFavorite ? 'Removed from favorites' : 'Added to favorites',
                );
              }}
            >
              <Star
                aria-hidden="true"
                className={project.isFavorite ? 'fill-current' : undefined}
              />
              Favorite
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              loading={busy}
              aria-pressed={project.isPinned}
              onClick={() => {
                void runAction(
                  () => togglePinned(workspaceId, project.id),
                  project.isPinned ? 'Unpinned' : 'Pinned',
                );
              }}
            >
              <Pin aria-hidden="true" className={project.isPinned ? 'fill-current' : undefined} />
              Pin
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              loading={busy}
              onClick={() => {
                void (async () => {
                  setBusy(true);
                  try {
                    const duplicate = await duplicateProject(workspaceId, project.id);
                    toast.success('Project duplicated');
                    navigate(projectDetailPath(duplicate.id));
                  } catch (error) {
                    toast.error(
                      error instanceof Error ? error.message : 'Could not duplicate project.',
                    );
                  } finally {
                    setBusy(false);
                  }
                })();
              }}
            >
              Duplicate
            </Button>
            {project.archivedAt ? (
              <Button
                type="button"
                variant="secondary"
                size="md"
                loading={busy}
                onClick={() => {
                  void runAction(() => restoreProject(workspaceId, project.id), 'Project restored');
                }}
              >
                Restore
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="md"
                loading={busy}
                onClick={() => {
                  void runAction(() => archiveProject(workspaceId, project.id), 'Project archived');
                }}
              >
                Archive
              </Button>
            )}
          </Inline>
        }
      />

      {project.archivedAt ? (
        <Alert variant="warning" className="mt-16" title="Archived">
          This project is archived. Restore it to use it again.
        </Alert>
      ) : null}

      <Stack gap={24} className="mt-24">
        <ProjectOverview
          project={project}
          members={members}
          activity={PLACEHOLDER_PROJECT_ACTIVITY}
          deadlines={PLACEHOLDER_PROJECT_DEADLINES}
          stats={PLACEHOLDER_PROJECT_STATS}
          membersAction={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                navigate(`${projectSettingsPath(project.id)}?section=members`);
              }}
            >
              Manage
            </Button>
          }
        />
      </Stack>
    </div>
  );
};
