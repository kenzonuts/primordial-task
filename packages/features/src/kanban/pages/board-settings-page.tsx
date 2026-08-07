import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  COLUMN_WIDTH_LABELS,
  DEFAULT_KANBAN_PREFERENCES,
  SWIMLANE_MODE_LABELS,
} from '@features/kanban/constants';
import { useKanbanContext } from '@features/kanban/context/kanban-context';
import {
  updateBoardSchema,
  type UpdateBoardFormValues,
} from '@features/kanban/schemas/kanban-schemas';
import {
  useKanbanBoardStore,
  useKanbanColumnStore,
  useKanbanPreferencesStore,
} from '@features/kanban/store';
import {
  COLUMN_WIDTH_PRESETS,
  KANBAN_ROUTES,
  SWIMLANE_MODES,
  kanbanBoardPath,
  type ColumnWidthPreset,
  type SwimlaneMode,
} from '@features/kanban/types';
import { ContentLayout } from '@features/shell/layouts/content-layout';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/forms';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Input } from '@shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';
import { Separator } from '@shared/ui/primitives/separator';
import { Switch } from '@shared/ui/primitives/switch';
import { Textarea } from '@shared/ui/primitives/textarea';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

type SettingsSection = 'general' | 'preferences' | 'columns' | 'danger';

const SETTINGS_NAV: ReadonlyArray<{ readonly id: SettingsSection; readonly label: string }> = [
  { id: 'general', label: 'General' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'columns', label: 'Columns' },
  { id: 'danger', label: 'Danger Zone' },
];

const isSettingsSection = (value: string | null): value is SettingsSection => {
  return SETTINGS_NAV.some((item) => item.id === value);
};

export const BoardSettingsPage = (): ReactElement => {
  const { boardId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { workspaceId } = useKanbanContext();

  const currentBoard = useKanbanBoardStore((state) => state.currentBoard);
  const status = useKanbanBoardStore((state) => state.status);
  const loadBoard = useKanbanBoardStore((state) => state.loadBoard);
  const updateBoard = useKanbanBoardStore((state) => state.updateBoard);
  const archiveBoard = useKanbanBoardStore((state) => state.archiveBoard);
  const restoreBoard = useKanbanBoardStore((state) => state.restoreBoard);
  const deleteBoard = useKanbanBoardStore((state) => state.deleteBoard);

  const columns = useKanbanColumnStore((state) => state.columns);
  const loadColumns = useKanbanColumnStore((state) => state.loadColumns);

  const preferences = useKanbanPreferencesStore((state) => state.preferences);
  const updatePreferences = useKanbanPreferencesStore((state) => state.updatePreferences);

  const [busy, setBusy] = useState(false);

  const sectionParam = searchParams.get('section');
  const section: SettingsSection = isSettingsSection(sectionParam) ? sectionParam : 'general';

  useEffect(() => {
    if (!workspaceId || !boardId) {
      return;
    }
    void loadBoard(workspaceId, boardId);
    void loadColumns(workspaceId, boardId);
  }, [workspaceId, boardId, loadBoard, loadColumns]);

  const board = currentBoard?.id === boardId ? currentBoard : null;

  const form = useForm<UpdateBoardFormValues>({
    resolver: zodResolver(updateBoardSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (board) {
      form.reset({
        name: board.name,
        description: board.description,
      });
    }
  }, [board, form]);

  const setSection = (next: SettingsSection): void => {
    setSearchParams(next === 'general' ? {} : { section: next }, { replace: true });
  };

  const onSaveGeneral = form.handleSubmit(async (values) => {
    if (!workspaceId || !boardId) {
      return;
    }
    try {
      await updateBoard(workspaceId, boardId, {
        name: values.name,
        description: values.description ?? '',
      });
      toast.success('Board settings saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save settings.');
    }
  });

  if (!workspaceId) {
    return (
      <ContentLayout title="Board settings">
        <Alert variant="warning" className="mt-24" title="No workspace selected">
          Select a workspace to manage board settings.
        </Alert>
      </ContentLayout>
    );
  }

  if ((status === 'loading' || status === 'idle') && !board) {
    return (
      <ContentLayout title="Board settings">
        <div className="mt-24 flex justify-center">
          <LoadingIndicator label="Loading settings" />
        </div>
      </ContentLayout>
    );
  }

  if (!board) {
    return (
      <ContentLayout title="Board settings">
        <EmptyState
          className="mt-24"
          title="Board not found"
          description="This board may have been deleted or you no longer have access."
          action={
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                navigate(KANBAN_ROUTES.list);
              }}
            >
              Back to boards
            </Button>
          }
        />
      </ContentLayout>
    );
  }

  return (
    <div className="mx-auto w-full max-w-none p-24">
      <Inline gap={16} align="start" justify="between" className="w-full">
        <Stack gap={4}>
          <Heading as="h1" level={2}>
            Board settings
          </Heading>
          <Text as="p" variant="body-sm" muted>
            {board.name} · {board.projectName}
          </Text>
        </Stack>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            navigate(kanbanBoardPath(board.id));
          }}
        >
          Open board
        </Button>
      </Inline>

      <div className="mt-24 grid grid-cols-1 gap-24 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Settings sections">
          <Stack gap={4}>
            {SETTINGS_NAV.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant={section === item.id ? 'secondary' : 'ghost'}
                size="sm"
                className={cn('justify-start', section === item.id && 'bg-state-selected')}
                onClick={() => {
                  setSection(item.id);
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </nav>

        <div>
          {section === 'general' ? (
            <Stack gap={16}>
              <Heading as="h2" level={3}>
                General
              </Heading>
              <Form {...form}>
                <form onSubmit={onSaveGeneral} noValidate>
                  <Stack gap={16} className="max-w-[560px]">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} size="lg" value={field.value ?? ''} />
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
                            <Textarea {...field} rows={3} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={form.formState.isSubmitting}
                    >
                      Save changes
                    </Button>
                  </Stack>
                </form>
              </Form>
            </Stack>
          ) : null}

          {section === 'preferences' ? (
            <Stack gap={16} className="max-w-[560px]">
              <Heading as="h2" level={3}>
                Preferences
              </Heading>
              <Inline gap={12} align="center" justify="between">
                <Text as="span" variant="body-sm">
                  Show statistics strip
                </Text>
                <Switch
                  checked={preferences.showStatistics}
                  onCheckedChange={(checked) => {
                    void updatePreferences({ showStatistics: checked });
                  }}
                />
              </Inline>
              <Inline gap={12} align="center" justify="between">
                <Text as="span" variant="body-sm">
                  Show archived column
                </Text>
                <Switch
                  checked={preferences.showArchivedColumn}
                  onCheckedChange={(checked) => {
                    void updatePreferences({ showArchivedColumn: checked });
                  }}
                />
              </Inline>
              <Inline gap={12} align="center" justify="between">
                <Text as="span" variant="body-sm">
                  Announce moves
                </Text>
                <Switch
                  checked={preferences.announceMoves}
                  onCheckedChange={(checked) => {
                    void updatePreferences({ announceMoves: checked });
                  }}
                />
              </Inline>
              <FormItem>
                <FormLabel>Column width</FormLabel>
                <Select
                  value={preferences.columnWidth}
                  onValueChange={(value) => {
                    void updatePreferences({ columnWidth: value as ColumnWidthPreset });
                  }}
                >
                  <SelectTrigger size="md" aria-label="Column width">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(COLUMN_WIDTH_PRESETS) as ColumnWidthPreset[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {COLUMN_WIDTH_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
              <FormItem>
                <FormLabel>Swimlanes</FormLabel>
                <Select
                  value={preferences.swimlaneMode}
                  onValueChange={(value) => {
                    void updatePreferences({ swimlaneMode: value as SwimlaneMode });
                  }}
                >
                  <SelectTrigger size="md" aria-label="Swimlane mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SWIMLANE_MODES.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {SWIMLANE_MODE_LABELS[mode]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="self-start"
                onClick={() => {
                  void updatePreferences({ ...DEFAULT_KANBAN_PREFERENCES });
                  toast.success('Preferences reset');
                }}
              >
                Reset to defaults
              </Button>
            </Stack>
          ) : null}

          {section === 'columns' ? (
            <Stack gap={16}>
              <Heading as="h2" level={3}>
                Columns
              </Heading>
              <Text as="p" variant="body-sm" muted>
                Column create/reorder controls are foundation for this phase. System columns cannot
                be deleted.
              </Text>
              <Stack gap={8} className="max-w-[640px]">
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-elevated px-3 py-2"
                  >
                    <Stack gap={2}>
                      <Text as="span" variant="body-sm" className="font-medium">
                        {column.name}
                      </Text>
                      <Text as="span" variant="caption" muted>
                        Maps to {column.mappedStatus}
                        {column.wipLimit != null ? ` · WIP ${column.wipLimit}` : ''}
                        {column.isSystem ? ' · System' : ''}
                      </Text>
                    </Stack>
                  </div>
                ))}
              </Stack>
            </Stack>
          ) : null}

          {section === 'danger' ? (
            <Stack gap={16} className="max-w-[560px]">
              <Heading as="h2" level={3}>
                Danger zone
              </Heading>
              <Alert variant="warning" title="Archive board">
                Archiving hides the board from the default list. Tasks remain in the Task Engine.
              </Alert>
              {board.archivedAt ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  loading={busy}
                  onClick={() => {
                    setBusy(true);
                    void restoreBoard(workspaceId, board.id)
                      .then(() => {
                        toast.success('Board restored');
                      })
                      .catch((error: unknown) => {
                        toast.error(error instanceof Error ? error.message : 'Could not restore.');
                      })
                      .finally(() => {
                        setBusy(false);
                      });
                  }}
                >
                  Restore board
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  loading={busy}
                  onClick={() => {
                    setBusy(true);
                    void archiveBoard(workspaceId, board.id)
                      .then(() => {
                        toast.success('Board archived');
                        navigate(KANBAN_ROUTES.list);
                      })
                      .catch((error: unknown) => {
                        toast.error(error instanceof Error ? error.message : 'Could not archive.');
                      })
                      .finally(() => {
                        setBusy(false);
                      });
                  }}
                >
                  Archive board
                </Button>
              )}
              <Separator />
              <Alert variant="danger" title="Delete board">
                Permanently removes board layout data. Task records are not deleted.
              </Alert>
              <Button
                type="button"
                variant="destructive"
                size="md"
                loading={busy}
                onClick={() => {
                  setBusy(true);
                  void deleteBoard(workspaceId, board.id)
                    .then(() => {
                      toast.success('Board deleted');
                      navigate(KANBAN_ROUTES.list, { replace: true });
                    })
                    .catch((error: unknown) => {
                      toast.error(error instanceof Error ? error.message : 'Could not delete.');
                    })
                    .finally(() => {
                      setBusy(false);
                    });
                }}
              >
                Delete board
              </Button>
            </Stack>
          ) : null}
        </div>
      </div>
    </div>
  );
};
