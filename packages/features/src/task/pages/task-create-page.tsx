import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ContentLayout } from '@features/shell/layouts/content-layout';
import { TaskFormFields } from '@features/task/components/task-form-fields';
import { useTaskContext } from '@features/task/context/task-context';
import { createTaskSchema, type CreateTaskFormValues } from '@features/task/schemas/task-schemas';
import { taskService, useTaskStore } from '@features/task/store';
import { TASK_ROUTES, taskDetailPath } from '@features/task/types';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Form } from '@shared/ui/forms';
import { Inline } from '@shared/ui/layout/inline';
import { Button } from '@shared/ui/primitives/button';

type ProjectOption = {
  readonly id: string;
  readonly name: string;
};

type AssigneeOption = {
  readonly id: string;
  readonly fullName: string;
};

export const TaskCreatePage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId, projectId } = useTaskContext();
  const createTask = useTaskStore((state) => state.createTask);
  const [projects, setProjects] = useState<readonly ProjectOption[]>([]);
  const [assignees, setAssignees] = useState<readonly AssigneeOption[]>([]);

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId: projectId ?? 'proj-core',
      parentTaskId: null,
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      type: 'task',
      assigneeId: null,
      startDate: null,
      dueDate: null,
      estimatedMinutes: null,
      labels: [],
      tags: [],
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    void (async () => {
      try {
        const [projectList, people] = await Promise.all([
          taskService.listProjects(),
          taskService.listPeople(),
        ]);
        setProjects(projectList);
        setAssignees(people.map((person) => ({ id: person.id, fullName: person.fullName })));
        const preferred =
          projectList.find((item) => item.id === projectId)?.id ?? projectList[0]?.id;
        if (preferred && !form.getValues('projectId')) {
          form.setValue('projectId', preferred);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Could not load form options.');
      }
    })();
  }, [projectId, form]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    if (!workspaceId) {
      toast.error('Select a workspace before creating a task.');
      return;
    }

    try {
      const task = await createTask({
        workspaceId,
        projectId: values.projectId,
        parentTaskId: values.parentTaskId ?? null,
        title: values.title,
        description: values.description || undefined,
        status: values.status,
        priority: values.priority,
        type: values.type,
        assigneeId: values.assigneeId ?? null,
        startDate: values.startDate ?? null,
        dueDate: values.dueDate ?? null,
        estimatedMinutes: values.estimatedMinutes ?? null,
        labels: values.labels,
        tags: values.tags,
      });
      toast.success('Task created');
      navigate(taskDetailPath(task.id), { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create task.');
    }
  });

  return (
    <ContentLayout
      title="Create task"
      description="Add a task inside the active workspace."
      actions={
        <Inline gap={8}>
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={isSubmitting}
            onClick={() => {
              navigate(TASK_ROUTES.list);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="task-create-form"
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
          Select a workspace to create a task.
        </Alert>
      ) : null}

      <Form {...form}>
        <form id="task-create-form" className="mt-24" onSubmit={onSubmit} noValidate>
          <TaskFormFields
            disabled={isSubmitting || !workspaceId}
            projectOptions={projects}
            assigneeOptions={assignees}
          />
        </form>
      </Form>
    </ContentLayout>
  );
};
