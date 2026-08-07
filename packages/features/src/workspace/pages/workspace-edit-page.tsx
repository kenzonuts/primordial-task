import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { ContentLayout } from '@features/shell/layouts/content-layout';
import { WorkspaceFormFields } from '@features/workspace/components/workspace-form-fields';
import {
  createWorkspaceSchema,
  type CreateWorkspaceFormValues,
} from '@features/workspace/schemas/workspace-schemas';
import { useWorkspaceStore } from '@features/workspace/store/workspace-store';
import type { Workspace } from '@features/workspace/types';
import { workspaceDetailPath, workspaceSettingsPath } from '@features/workspace/types';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Form } from '@shared/ui/forms';
import { Inline } from '@shared/ui/layout/inline';
import { Button } from '@shared/ui/primitives/button';

const toFormValues = (workspace: Workspace): CreateWorkspaceFormValues => ({
  name: workspace.name,
  slug: workspace.slug,
  description: workspace.description,
  color: workspace.color,
  logoUrl: workspace.logoUrl ?? '',
  visibility: workspace.visibility,
});

export const WorkspaceEditPage = (): ReactElement => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const status = useWorkspaceStore((state) => state.status);
  const initialize = useWorkspaceStore((state) => state.initialize);
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  const form = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      color: '#E6E6E6',
      logoUrl: '',
      visibility: 'private',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    const found = workspaces.find((item) => item.id === id) ?? null;
    setWorkspace(found);
    if (found) {
      form.reset(toFormValues(found));
    }
  }, [workspaces, id, form]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    if (!id) {
      return;
    }
    try {
      const updated = await updateWorkspace(id, {
        name: values.name,
        slug: values.slug,
        description: values.description || '',
        color: values.color,
        logoUrl: values.logoUrl || '',
        visibility: values.visibility,
      });
      toast.success('Workspace updated');
      navigate(workspaceDetailPath(updated.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update workspace.');
    }
  });

  if (status === 'loading' || status === 'idle') {
    return (
      <ContentLayout title="Edit workspace">
        <div className="mt-24 flex justify-center">
          <LoadingIndicator label="Loading workspace" />
        </div>
      </ContentLayout>
    );
  }

  if (!workspace) {
    return (
      <ContentLayout title="Edit workspace">
        <EmptyState
          className="mt-24"
          title="Workspace not found"
          description="This workspace may have been deleted or you no longer have access."
          action={
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate('/workspaces')}
            >
              Back to workspaces
            </Button>
          }
        />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={`Edit ${workspace.name}`}
      description="Update workspace details."
      actions={
        <Inline gap={8}>
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={isSubmitting}
            onClick={() => {
              navigate(workspaceSettingsPath(workspace.id));
            }}
          >
            Settings
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={isSubmitting}
            onClick={() => {
              navigate(workspaceDetailPath(workspace.id));
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="workspace-edit-form"
            variant="primary"
            size="md"
            loading={isSubmitting}
          >
            Save changes
          </Button>
        </Inline>
      }
    >
      {workspace.archivedAt ? (
        <Alert variant="warning" className="mt-16" title="Archived workspace">
          Changes are allowed, but this workspace is archived.
        </Alert>
      ) : null}

      <Form {...form}>
        <form id="workspace-edit-form" className="mt-24" onSubmit={onSubmit} noValidate>
          <WorkspaceFormFields disabled={isSubmitting} autoSlugFromName={false} />
        </form>
      </Form>
    </ContentLayout>
  );
};
