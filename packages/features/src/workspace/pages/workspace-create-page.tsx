import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ContentLayout } from '@features/shell/layouts/content-layout';
import { WorkspaceFormFields } from '@features/workspace/components/workspace-form-fields';
import {
  createWorkspaceSchema,
  type CreateWorkspaceFormValues,
} from '@features/workspace/schemas/workspace-schemas';
import { useWorkspaceStore } from '@features/workspace/store/workspace-store';
import { workspaceDetailPath } from '@features/workspace/types';
import { toast } from '@shared/ui/feedback/toast';
import { Form } from '@shared/ui/forms';
import { Inline } from '@shared/ui/layout/inline';
import { Button } from '@shared/ui/primitives/button';

export const WorkspaceCreatePage = (): ReactElement => {
  const navigate = useNavigate();
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);

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

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const workspace = await createWorkspace({
        name: values.name,
        slug: values.slug,
        description: values.description || undefined,
        color: values.color,
        logoUrl: values.logoUrl || undefined,
        visibility: values.visibility,
      });
      toast.success('Workspace created');
      navigate(workspaceDetailPath(workspace.id), { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create workspace.');
    }
  });

  return (
    <ContentLayout
      title="Create workspace"
      description="Set up a new space for your team."
      actions={
        <Inline gap={8}>
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={isSubmitting}
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="workspace-create-form"
            variant="primary"
            size="md"
            loading={isSubmitting}
          >
            Create
          </Button>
        </Inline>
      }
    >
      <Form {...form}>
        <form id="workspace-create-form" className="mt-24" onSubmit={onSubmit} noValidate>
          <WorkspaceFormFields disabled={isSubmitting} />
        </form>
      </Form>
    </ContentLayout>
  );
};
