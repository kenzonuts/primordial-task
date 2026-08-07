import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ProjectFormFields } from '@features/project/components/project-form-fields';
import { useProjectContext } from '@features/project/context/project-context';
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from '@features/project/schemas/project-schemas';
import { useProjectStore } from '@features/project/store/project-store';
import { PROJECT_ROUTES, projectDetailPath } from '@features/project/types';
import { ContentLayout } from '@features/shell/layouts/content-layout';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Form } from '@shared/ui/forms';
import { Inline } from '@shared/ui/layout/inline';
import { Button } from '@shared/ui/primitives/button';

export const ProjectCreatePage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId } = useProjectContext();
  const createProject = useProjectStore((state) => state.createProject);

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      icon: 'FolderKanban',
      coverUrl: '',
      color: '#E6E6E6',
      status: 'planning',
      visibility: 'workspace',
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    if (!workspaceId) {
      toast.error('Select a workspace before creating a project.');
      return;
    }

    try {
      const project = await createProject({
        workspaceId,
        name: values.name,
        slug: values.slug,
        description: values.description || undefined,
        icon: values.icon || undefined,
        coverUrl: values.coverUrl || undefined,
        color: values.color,
        status: values.status,
        visibility: values.visibility,
      });
      toast.success('Project created');
      navigate(projectDetailPath(project.id), { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create project.');
    }
  });

  return (
    <ContentLayout
      title="Create project"
      description="Set up a project inside the active workspace."
      actions={
        <Inline gap={8}>
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={isSubmitting}
            onClick={() => {
              navigate(PROJECT_ROUTES.list);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="project-create-form"
            variant="primary"
            size="md"
            loading={isSubmitting}
            disabled={!workspaceId}
          >
            Create
          </Button>
        </Inline>
      }
    >
      {!workspaceId ? (
        <Alert variant="warning" className="mt-16" title="No workspace selected">
          Select a workspace to create a project.
        </Alert>
      ) : null}

      <Form {...form}>
        <form id="project-create-form" className="mt-24" onSubmit={onSubmit} noValidate>
          <ProjectFormFields disabled={isSubmitting || !workspaceId} />
        </form>
      </Form>
    </ContentLayout>
  );
};
