import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ContentLayout } from '@features/shell/layouts/content-layout';
import { WorkspaceHeader } from '@features/workspace/components/workspace-header';
import { WorkspaceMemberList } from '@features/workspace/components/workspace-member-list';
import { useWorkspaceContext } from '@features/workspace/context/workspace-context';
import { useWorkspaceStore } from '@features/workspace/store/workspace-store';
import type { Workspace } from '@features/workspace/types';
import {
  WORKSPACE_ROUTES,
  workspaceEditPath,
  workspaceSettingsPath,
} from '@features/workspace/types';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/composites/card';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Grid } from '@shared/ui/layout/grid';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

export const WorkspaceOverviewPage = (): ReactElement => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { can, switchWorkspace } = useWorkspaceContext();
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const status = useWorkspaceStore((state) => state.status);
  const initialize = useWorkspaceStore((state) => state.initialize);
  const members = useWorkspaceStore((state) => state.members);
  const membersStatus = useWorkspaceStore((state) => state.membersStatus);
  const loadMembers = useWorkspaceStore((state) => state.loadMembers);
  const archiveWorkspace = useWorkspaceStore((state) => state.archiveWorkspace);
  const restoreWorkspace = useWorkspaceStore((state) => state.restoreWorkspace);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    setWorkspace(workspaces.find((item) => item.id === id) ?? null);
  }, [workspaces, id]);

  useEffect(() => {
    if (id) {
      void loadMembers(id);
    }
  }, [id, loadMembers]);

  const handleSwitch = async (): Promise<void> => {
    if (!workspace) {
      return;
    }
    setBusy(true);
    try {
      await switchWorkspace(workspace.id);
      toast.success(`Switched to ${workspace.name}`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not switch workspace.');
    } finally {
      setBusy(false);
    }
  };

  const handleArchive = async (): Promise<void> => {
    if (!workspace) {
      return;
    }
    setBusy(true);
    try {
      await archiveWorkspace(workspace.id);
      toast.success('Workspace archived');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not archive workspace.');
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async (): Promise<void> => {
    if (!workspace) {
      return;
    }
    setBusy(true);
    try {
      await restoreWorkspace(workspace.id);
      toast.success('Workspace restored');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not restore workspace.');
    } finally {
      setBusy(false);
    }
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <ContentLayout title="Workspace">
        <div className="mt-24 flex justify-center">
          <LoadingIndicator label="Loading workspace" />
        </div>
      </ContentLayout>
    );
  }

  if (!workspace) {
    return (
      <ContentLayout title="Workspace">
        <EmptyState
          className="mt-24"
          title="Workspace not found"
          description="This workspace may have been deleted or you no longer have access."
          action={
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                navigate(WORKSPACE_ROUTES.list);
              }}
            >
              Back to workspaces
            </Button>
          }
        />
      </ContentLayout>
    );
  }

  const isCurrent = currentWorkspace?.id === workspace.id;
  const previewMembers = members.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-none p-24">
      <WorkspaceHeader
        workspace={workspace}
        actions={
          <Inline gap={8} className="flex-wrap">
            {can('workspace.edit') ? (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => {
                  navigate(workspaceEditPath(workspace.id));
                }}
              >
                Edit
              </Button>
            ) : null}
            {can('settings.view') ? (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => {
                  navigate(workspaceSettingsPath(workspace.id));
                }}
              >
                Settings
              </Button>
            ) : null}
            {!workspace.archivedAt && !isCurrent ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                loading={busy}
                onClick={() => {
                  void handleSwitch();
                }}
              >
                Switch to this workspace
              </Button>
            ) : null}
            {workspace.archivedAt && can('workspace.archive') ? (
              <Button
                type="button"
                variant="secondary"
                size="md"
                loading={busy}
                onClick={() => {
                  void handleRestore();
                }}
              >
                Restore
              </Button>
            ) : null}
            {!workspace.archivedAt && can('workspace.archive') ? (
              <Button
                type="button"
                variant="ghost"
                size="md"
                loading={busy}
                onClick={() => {
                  void handleArchive();
                }}
              >
                Archive
              </Button>
            ) : null}
          </Inline>
        }
      />

      {workspace.archivedAt ? (
        <Alert variant="warning" className="mt-16" title="Archived">
          This workspace is archived. Restore it to use it again.
        </Alert>
      ) : null}

      <Grid cols={3} gap={16} className="mt-24 max-md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Text as="p" variant="h2">
              {workspace.memberCount}
            </Text>
            <Text as="p" variant="caption" muted>
              People with access
            </Text>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <Text as="p" variant="h2" className="capitalize">
              {workspace.visibility}
            </Text>
            <Text as="p" variant="caption" muted>
              Access model
            </Text>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Text as="p" variant="h2">
              —
            </Text>
            <Text as="p" variant="caption" muted>
              Coming soon
            </Text>
          </CardContent>
        </Card>
      </Grid>

      <Stack gap={12} className="mt-24">
        <Inline gap={8} align="center" justify="between">
          <Text as="h2" variant="h3">
            Members
          </Text>
          {can('settings.view') ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                navigate(`${workspaceSettingsPath(workspace.id)}?section=members`);
              }}
            >
              Manage members
            </Button>
          ) : null}
        </Inline>
        {membersStatus === 'loading' ? (
          <LoadingIndicator label="Loading members" size="button" />
        ) : (
          <WorkspaceMemberList members={previewMembers} emptyMessage="No members to preview." />
        )}
      </Stack>
    </div>
  );
};
