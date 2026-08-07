import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { ProjectFormFields } from '@features/project/components/project-form-fields';
import { useProjectContext } from '@features/project/context/project-context';
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from '@features/project/schemas/project-schemas';
import { useProjectStore } from '@features/project/store/project-store';
import type { Project } from '@features/project/types';
import { PROJECT_ROUTES, projectDetailPath, projectSettingsPath } from '@features/project/types';
import { ContentLayout } from '@features/shell/layouts/content-layout';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Form } from '@shared/ui/forms';
import { Inline } from '@shared/ui/layout/inline';
import { Button } from '@shared/ui/primitives/button';

const toFormValues = (project: Project): CreateProjectFormValues => ({
  name: project.name,
  slug: project.slug,
  description: project.description,
  icon: project.icon ?? '',
  coverUrl: project.coverUrl ?? '',
  color: project.color,
  status: project.status === 'archived' ? 'planning' : project.status,
  visibility: project.visibility,
});

export const ProjectEditPage = (): ReactElement => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { workspaceId } = useProjectContext();
  const currentProject = useProjectStore((state) => state.currentProject);
  const status = useProjectStore((state) => state.status);
  const loadProject = useProjectStore((state) => state.loadProject);
  const updateProject = useProjectStore((state) => state.updateProject);

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

  useEffect(() => {
    if (!workspaceId || !id) {
      return;
    }
    void loadProject(workspaceId, id);
  }, [workspaceId, id, loadProject]);

  const project = currentProject?.id === id ? currentProject : null;

  useEffect(() => {
    if (project) {
      form.reset(toFormValues(project));
    }
  }, [project, form]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    if (!workspaceId || !id) {
      return;
    }
    try {
      const updated = await updateProject(workspaceId, id, {
        name: values.name,
        slug: values.slug,
        description: values.description || '',
        icon: values.icon || '',
        coverUrl: values.coverUrl || '',
        color: values.color,
        status: values.status,
        visibility: values.visibility,
      });
      toast.success('Project updated');
      navigate(projectDetailPath(updated.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update project.');
    }
  });

  if (!workspaceId) {
    return (
      <ContentLayout title="Edit project">
        <Alert variant="warning" className="mt-24" title="No workspace selected">
          Select a workspace to edit projects.
        </Alert>
      </ContentLayout>
    );
  }

  if ((status === 'loading' || status === 'idle') && !project) {
    return (
      <ContentLayout title="Edit project">
        <div className="mt-24 flex justify-center">
          <LoadingIndicator label="Loading project" />
        </div>
      </ContentLayout>
    );
  }

  if (!project) {
    return (
      <ContentLayout title="Edit project">
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

  return (
    <ContentLayout
      title={`Edit ${project.name}`}
      description="Update project details."
      actions={
        <Inline gap={8}>
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            onClick={() => {
              navigate(projectDetailPath(project.id));
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="project-edit-form"
            variant="primary"
            size="md"
            loading={isSubmitting}
          >
            Save changes
          </Button>
        </Inline>
      }
    >
      {project.archivedAt ? (
        <Alert variant="warning" className="mt-16" title="Archived project">
          Changes are allowed, but this project is archived.
        </Alert>
      ) : null}

      <Form {...form}>
        <form id="project-edit-form" className="mt-24" onSubmit={onSubmit} noValidate>
          <ProjectFormFields disabled={isSubmitting} autoSlugFromName={false} />
        </form>
      </Form>
    </ContentLayout>
  );
};
