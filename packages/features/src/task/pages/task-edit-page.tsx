import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { ContentLayout } from '@features/shell/layouts/content-layout';
import { TaskFormFields } from '@features/task/components/task-form-fields';
import { useTaskContext } from '@features/task/context/task-context';
import { createTaskSchema, type CreateTaskFormValues } from '@features/task/schemas/task-schemas';
import { taskService, useTaskDetailStore, useTaskStore } from '@features/task/store';
import type { Task } from '@features/task/types';
import { TASK_ROUTES, taskDetailPath } from '@features/task/types';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
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

const toFormValues = (task: Task): CreateTaskFormValues => ({
  projectId: task.projectId,
  parentTaskId: task.parentTaskId,
  title: task.title,
  description: task.description,
  status: task.status === 'archived' ? 'todo' : task.status,
  priority: task.priority,
  type: task.type,
  assigneeId: task.assignee?.id ?? null,
  startDate: task.startDate,
  dueDate: task.dueDate,
  estimatedMinutes: task.estimatedMinutes,
  labels: [...task.labels],
  tags: [...task.tags],
});

export const TaskEditPage = (): ReactElement => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { workspaceId } = useTaskContext();
  const currentTask = useTaskDetailStore((state) => state.currentTask);
  const detailStatus = useTaskDetailStore((state) => state.status);
  const loadTask = useTaskDetailStore((state) => state.loadTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [projects, setProjects] = useState<readonly ProjectOption[]>([]);
  const [assignees, setAssignees] = useState<readonly AssigneeOption[]>([]);

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId: 'proj-core',
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
    if (!workspaceId || !id) {
      return;
    }
    void loadTask(workspaceId, id);
  }, [workspaceId, id, loadTask]);

  useEffect(() => {
    void (async () => {
      try {
        const [projectList, people] = await Promise.all([
          taskService.listProjects(),
          taskService.listPeople(),
        ]);
        setProjects(projectList);
        setAssignees(people.map((person) => ({ id: person.id, fullName: person.fullName })));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Could not load form options.');
      }
    })();
  }, []);

  const task = currentTask?.id === id ? currentTask : null;

  useEffect(() => {
    if (task) {
      form.reset(toFormValues(task));
    }
  }, [task, form]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    if (!workspaceId || !id) {
      return;
    }
    try {
      const updated = await updateTask(workspaceId, id, {
        title: values.title,
        description: values.description || '',
        status: values.status,
        priority: values.priority,
        type: values.type,
        projectId: values.projectId,
        parentTaskId: values.parentTaskId ?? null,
        assigneeId: values.assigneeId ?? null,
        startDate: values.startDate ?? null,
        dueDate: values.dueDate ?? null,
        estimatedMinutes: values.estimatedMinutes ?? null,
        labels: values.labels,
        tags: values.tags,
      });
      toast.success('Task updated');
      navigate(taskDetailPath(updated.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update task.');
    }
  });

  if (!workspaceId) {
    return (
      <ContentLayout title="Edit task">
        <Alert variant="warning" className="mt-24" title="No workspace selected">
          Select a workspace to edit tasks.
        </Alert>
      </ContentLayout>
    );
  }

  if ((detailStatus === 'loading' || detailStatus === 'idle') && !task) {
    return (
      <ContentLayout title="Edit task">
        <div className="mt-24 flex justify-center">
          <LoadingIndicator label="Loading task" />
        </div>
      </ContentLayout>
    );
  }

  if (!task) {
    return (
      <ContentLayout title="Edit task">
        <EmptyState
          className="mt-24"
          title="Task not found"
          description="This task may have been deleted or you no longer have access."
          action={
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                navigate(TASK_ROUTES.list);
              }}
            >
              Back to tasks
            </Button>
          }
        />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={`Edit ${task.title}`}
      description="Update task details."
      actions={
        <Inline gap={8}>
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={isSubmitting}
            onClick={() => {
              navigate(taskDetailPath(task.id));
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="task-edit-form"
            variant="primary"
            size="md"
            loading={isSubmitting}
          >
            Save changes
          </Button>
        </Inline>
      }
    >
      {task.archivedAt ? (
        <Alert variant="warning" className="mt-16" title="Archived task">
          Changes are allowed, but this task is archived.
        </Alert>
      ) : null}

      <Form {...form}>
        <form id="task-edit-form" className="mt-24" onSubmit={onSubmit} noValidate>
          <TaskFormFields
            disabled={isSubmitting}
            projectOptions={projects}
            assigneeOptions={assignees}
          />
        </form>
      </Form>
    </ContentLayout>
  );
};
