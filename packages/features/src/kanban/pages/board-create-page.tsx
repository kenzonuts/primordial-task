import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { BOARD_TEMPLATE_LABELS } from '@features/kanban/constants';
import { useKanbanContext } from '@features/kanban/context/kanban-context';
import {
  createBoardSchema,
  type CreateBoardFormValues,
} from '@features/kanban/schemas/kanban-schemas';
import { useKanbanBoardStore } from '@features/kanban/store';
import { BOARD_TEMPLATES, KANBAN_ROUTES, kanbanBoardPath } from '@features/kanban/types';
import { ContentLayout } from '@features/shell/layouts/content-layout';
import { taskService } from '@features/task/store';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/forms';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';
import { Input } from '@shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';
import { Textarea } from '@shared/ui/primitives/textarea';

type ProjectOption = {
  readonly id: string;
  readonly name: string;
};

export const BoardCreatePage = (): ReactElement => {
  const navigate = useNavigate();
  const { workspaceId } = useKanbanContext();
  const createBoard = useKanbanBoardStore((state) => state.createBoard);
  const [projects, setProjects] = useState<readonly ProjectOption[]>([]);

  const form = useForm<CreateBoardFormValues>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      projectId: '',
      name: '',
      description: '',
      templateId: 'software_delivery',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    void (async () => {
      try {
        const projectList = await taskService.listProjects();
        setProjects(projectList);
        const preferred = projectList[0]?.id;
        if (preferred && !form.getValues('projectId')) {
          form.setValue('projectId', preferred);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Could not load projects.');
      }
    })();
  }, [form]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    if (!workspaceId) {
      toast.error('Select a workspace before creating a board.');
      return;
    }

    try {
      const board = await createBoard({
        workspaceId,
        projectId: values.projectId,
        name: values.name,
        description: values.description || undefined,
        templateId: values.templateId,
      });
      toast.success('Board created');
      navigate(kanbanBoardPath(board.id), { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create board.');
    }
  });

  return (
    <ContentLayout
      title="Create board"
      description="Set up a Kanban board for a project workflow."
      actions={
        <Inline gap={8}>
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={isSubmitting}
            onClick={() => {
              navigate(KANBAN_ROUTES.list);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="board-create-form"
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
          Select a workspace to create a board.
        </Alert>
      ) : null}

      <Form {...form}>
        <form id="board-create-form" className="mt-24" onSubmit={onSubmit} noValidate>
          <Stack gap={16} className="w-full max-w-[560px]">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || !workspaceId || projects.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger size="lg" aria-label="Select project">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Boards are scoped to a single project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      size="lg"
                      disabled={isSubmitting || !workspaceId}
                      placeholder="Delivery board"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting || !workspaceId}
                      placeholder="Optional board purpose"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || !workspaceId}
                  >
                    <FormControl>
                      <SelectTrigger size="lg" aria-label="Select template">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BOARD_TEMPLATES.map((templateId) => (
                        <SelectItem key={templateId} value={templateId}>
                          {BOARD_TEMPLATE_LABELS[templateId]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Templates seed default columns for the workflow.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Stack>
        </form>
      </Form>
    </ContentLayout>
  );
};
