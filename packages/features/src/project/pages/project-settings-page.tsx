import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { DeleteDialog } from '@features/project/components/delete-dialog';
import { ProjectFormFields } from '@features/project/components/project-form-fields';
import { useProjectContext } from '@features/project/context/project-context';
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from '@features/project/schemas/project-schemas';
import { useProjectStore } from '@features/project/store/project-store';
import type { Project, ProjectSettingsSection } from '@features/project/types';
import { PROJECT_ROUTES, projectDetailPath } from '@features/project/types';
import { ContentLayout } from '@features/shell/layouts/content-layout';
import { EmptyState } from '@shared/ui/composites/empty-state';
import { LoadingIndicator } from '@shared/ui/composites/loading-indicator';
import { Alert } from '@shared/ui/feedback/alert';
import { toast } from '@shared/ui/feedback/toast';
import { Form } from '@shared/ui/forms';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
import { Button } from '@shared/ui/primitives/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';
import { Separator } from '@shared/ui/primitives/separator';
import { Switch } from '@shared/ui/primitives/switch';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

const SETTINGS_NAV: ReadonlyArray<{
  readonly id: ProjectSettingsSection;
  readonly label: string;
}> = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'members', label: 'Members' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'danger', label: 'Danger Zone' },
];

const isSettingsSection = (value: string | null): value is ProjectSettingsSection => {
  return SETTINGS_NAV.some((item) => item.id === value);
};

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

export const ProjectSettingsPage = (): ReactElement => {
  const { id = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { workspaceId } = useProjectContext();
  const currentProject = useProjectStore((state) => state.currentProject);
  const status = useProjectStore((state) => state.status);
  const loadProject = useProjectStore((state) => state.loadProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const members = useProjectStore((state) => state.members);
  const membersStatus = useProjectStore((state) => state.membersStatus);
  const loadMembers = useProjectStore((state) => state.loadMembers);
  const archiveProject = useProjectStore((state) => state.archiveProject);
  const restoreProject = useProjectStore((state) => state.restoreProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const preferences = useProjectStore((state) => state.preferences);
  const updatePreferences = useProjectStore((state) => state.updatePreferences);

  const [busy, setBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const sectionParam = searchParams.get('section');
  const section: ProjectSettingsSection = isSettingsSection(sectionParam)
    ? sectionParam
    : 'general';

  useEffect(() => {
    if (!workspaceId || !id) {
      return;
    }
    void loadProject(workspaceId, id);
  }, [workspaceId, id, loadProject]);

  useEffect(() => {
    if (workspaceId && id && (section === 'members' || section === 'permissions')) {
      void loadMembers(workspaceId, id);
    }
  }, [workspaceId, id, section, loadMembers]);

  const project = currentProject?.id === id ? currentProject : null;

  const generalForm = useForm<CreateProjectFormValues>({
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
    if (project) {
      generalForm.reset(toFormValues(project));
    }
  }, [project, generalForm]);

  const setSection = (next: ProjectSettingsSection): void => {
    setSearchParams(next === 'general' ? {} : { section: next }, { replace: true });
  };

  const onSaveGeneral = generalForm.handleSubmit(async (values) => {
    if (!workspaceId || !id) {
      return;
    }
    try {
      await updateProject(workspaceId, id, {
        name: values.name,
        slug: values.slug,
        description: values.description || '',
        icon: values.icon || '',
        coverUrl: values.coverUrl || '',
        color: values.color,
        status: values.status,
        visibility: values.visibility,
      });
      toast.success('Project settings saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save settings.');
    }
  });

  if (!workspaceId) {
    return (
      <ContentLayout title="Project settings">
        <Alert variant="warning" className="mt-24" title="No workspace selected">
          Select a workspace to manage project settings.
        </Alert>
      </ContentLayout>
    );
  }

  if ((status === 'loading' || status === 'idle') && !project) {
    return (
      <ContentLayout title="Project settings">
        <div className="mt-24 flex justify-center">
          <LoadingIndicator label="Loading settings" />
        </div>
      </ContentLayout>
    );
  }

  if (!project) {
    return (
      <ContentLayout title="Project settings">
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
    <div className="mx-auto w-full max-w-none p-24">
      <Inline gap={16} align="start" justify="between" className="w-full">
        <Stack gap={4} className="min-w-0">
          <Heading level={1}>Settings</Heading>
          <Text as="p" variant="body-md" muted>
            {project.name}
          </Text>
        </Stack>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => {
            navigate(projectDetailPath(project.id));
          }}
        >
          Back to overview
        </Button>
      </Inline>

      <div className="mt-24 grid grid-cols-[220px_minmax(0,1fr)] gap-24 max-md:grid-cols-1">
        <nav aria-label="Settings sections">
          <Stack gap={4}>
            {SETTINGS_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  'rounded-md px-3 py-2 text-left text-sm ds-transition-fast',
                  'focus-visible:outline-none focus-visible:ds-focus-ring',
                  section === item.id
                    ? 'bg-state-selected text-text-primary'
                    : 'text-text-secondary hover:bg-state-hover hover:text-text-primary',
                  item.id === 'danger' && 'text-danger hover:text-danger',
                )}
                onClick={() => {
                  setSection(item.id);
                }}
              >
                {item.label}
              </button>
            ))}
          </Stack>
        </nav>

        <div className="min-w-0">
          {section === 'general' ? (
            <Stack gap={16}>
              <Heading level={2}>General</Heading>
              <Form {...generalForm}>
                <form onSubmit={onSaveGeneral} noValidate className="space-y-16">
                  <ProjectFormFields
                    disabled={generalForm.formState.isSubmitting}
                    autoSlugFromName={false}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={generalForm.formState.isSubmitting}
                  >
                    Save changes
                  </Button>
                </form>
              </Form>
            </Stack>
          ) : null}

          {section === 'appearance' ? (
            <Stack gap={16}>
              <Heading level={2}>Appearance</Heading>
              <Text as="p" variant="body-sm" muted>
                Preferences for how projects appear in this workspace.
              </Text>
              <Inline
                gap={12}
                align="center"
                justify="between"
                className="rounded-lg border border-border-subtle px-4 py-3"
              >
                <Stack gap={2}>
                  <Text as="span" variant="body-sm" className="font-medium">
                    Default view
                  </Text>
                  <Text as="span" variant="caption" muted>
                    Grid or list when opening the project explorer.
                  </Text>
                </Stack>
                <Select
                  value={preferences.defaultView}
                  onValueChange={(value) => {
                    void updatePreferences({
                      defaultView: value as 'grid' | 'list',
                    }).then(() => {
                      toast.success('Preference updated');
                    });
                  }}
                >
                  <SelectTrigger size="md" className="w-[160px]" aria-label="Default view">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
              </Inline>
              <Inline
                gap={12}
                align="center"
                justify="between"
                className="rounded-lg border border-border-subtle px-4 py-3"
              >
                <Stack gap={2}>
                  <Text as="span" variant="body-sm" className="font-medium">
                    Show archived by default
                  </Text>
                  <Text as="span" variant="caption" muted>
                    Open the explorer on the archived filter.
                  </Text>
                </Stack>
                <Switch
                  checked={preferences.showArchivedByDefault}
                  onCheckedChange={(checked) => {
                    void updatePreferences({ showArchivedByDefault: checked }).then(() => {
                      toast.success('Preference updated');
                    });
                  }}
                  aria-label="Show archived by default"
                />
              </Inline>
              <Inline
                gap={12}
                align="center"
                justify="between"
                className="rounded-lg border border-border-subtle px-4 py-3"
              >
                <Stack gap={2}>
                  <Text as="span" variant="body-sm" className="font-medium">
                    Dense list
                  </Text>
                  <Text as="span" variant="caption" muted>
                    Compact row spacing in list view.
                  </Text>
                </Stack>
                <Switch
                  checked={preferences.denseList}
                  onCheckedChange={(checked) => {
                    void updatePreferences({ denseList: checked }).then(() => {
                      toast.success('Preference updated');
                    });
                  }}
                  aria-label="Dense list"
                />
              </Inline>
            </Stack>
          ) : null}

          {section === 'members' ? (
            <Stack gap={16}>
              <Heading level={2}>Members</Heading>
              <Text as="p" variant="body-sm" muted>
                Project members (placeholder list from local store).
              </Text>
              {membersStatus === 'loading' ? (
                <LoadingIndicator label="Loading members" size="button" />
              ) : members.length === 0 ? (
                <EmptyState
                  title="No members yet"
                  description="Member invitations will appear here in a later release."
                />
              ) : (
                <Stack gap={8} role="list" aria-label="Project members">
                  {members.map((member) => (
                    <Inline
                      key={member.id}
                      gap={12}
                      align="center"
                      justify="between"
                      role="listitem"
                      className="rounded-lg border border-border-subtle px-4 py-3"
                    >
                      <Stack gap={2} className="min-w-0">
                        <Text as="span" variant="body-sm" className="font-medium" truncate>
                          {member.fullName}
                        </Text>
                        <Text as="span" variant="caption" muted truncate>
                          {member.email}
                        </Text>
                      </Stack>
                      <Inline gap={8} align="center">
                        <Badge variant="neutral" size="sm" className="capitalize">
                          {member.role}
                        </Badge>
                        <Badge
                          variant={member.status === 'active' ? 'success' : 'warning'}
                          size="sm"
                          className="capitalize"
                        >
                          {member.status}
                        </Badge>
                      </Inline>
                    </Inline>
                  ))}
                </Stack>
              )}
            </Stack>
          ) : null}

          {section === 'permissions' ? (
            <Stack gap={16}>
              <Heading level={2}>Permissions</Heading>
              <Text as="p" variant="body-sm" muted>
                Role capabilities for this project (read-only overview).
              </Text>
              <Stack gap={8}>
                {(
                  [
                    { role: 'Owner', caps: 'Full control · Delete · Manage members' },
                    { role: 'Admin', caps: 'Edit project · Manage members · Archive' },
                    { role: 'Member', caps: 'Contribute · Comment · Update tasks' },
                    { role: 'Viewer', caps: 'View only' },
                  ] as const
                ).map((item) => (
                  <div key={item.role} className="rounded-lg border border-border-subtle px-4 py-3">
                    <Text as="p" variant="body-sm" className="font-medium">
                      {item.role}
                    </Text>
                    <Text as="p" variant="caption" muted className="mt-1">
                      {item.caps}
                    </Text>
                  </div>
                ))}
              </Stack>
            </Stack>
          ) : null}

          {section === 'integrations' ? (
            <Stack gap={16}>
              <Heading level={2}>Integrations</Heading>
              <EmptyState
                title="Integrations coming soon"
                description="Connect GitHub, Slack, and other tools from this panel later."
              />
            </Stack>
          ) : null}

          {section === 'danger' ? (
            <Stack gap={16}>
              <Heading level={2}>Danger Zone</Heading>
              <Alert variant="warning" title="Irreversible actions">
                Archive, restore, or permanently delete this project.
              </Alert>

              <div className="rounded-lg border border-border-subtle p-4">
                <Inline gap={12} align="center" justify="between" className="flex-wrap">
                  <Stack gap={2}>
                    <Text as="span" variant="body-sm" className="font-medium">
                      {project.archivedAt ? 'Restore project' : 'Archive project'}
                    </Text>
                    <Text as="span" variant="caption" muted>
                      {project.archivedAt
                        ? 'Make this project available again.'
                        : 'Hide this project from active lists.'}
                    </Text>
                  </Stack>
                  {project.archivedAt ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      loading={busy}
                      onClick={() => {
                        setBusy(true);
                        void restoreProject(workspaceId, project.id)
                          .then(() => {
                            toast.success('Project restored');
                          })
                          .catch((error: unknown) => {
                            toast.error(
                              error instanceof Error ? error.message : 'Could not restore project.',
                            );
                          })
                          .finally(() => {
                            setBusy(false);
                          });
                      }}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      loading={busy}
                      onClick={() => {
                        setBusy(true);
                        void archiveProject(workspaceId, project.id)
                          .then(() => {
                            toast.success('Project archived');
                          })
                          .catch((error: unknown) => {
                            toast.error(
                              error instanceof Error ? error.message : 'Could not archive project.',
                            );
                          })
                          .finally(() => {
                            setBusy(false);
                          });
                      }}
                    >
                      Archive
                    </Button>
                  )}
                </Inline>
              </div>

              <Separator />

              <div className="rounded-lg border border-danger/40 p-4">
                <Inline gap={12} align="center" justify="between" className="flex-wrap">
                  <Stack gap={2}>
                    <Text as="span" variant="body-sm" className="font-medium text-danger">
                      Delete project
                    </Text>
                    <Text as="span" variant="caption" muted>
                      Permanently remove this project and its local data.
                    </Text>
                  </Stack>
                  <Button
                    type="button"
                    variant="destructive"
                    size="md"
                    onClick={() => {
                      setDeleteOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </Inline>
              </div>
            </Stack>
          ) : null}
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        projectName={project.name}
        loading={busy}
        onConfirm={async () => {
          setBusy(true);
          try {
            await deleteProject(workspaceId, project.id);
            toast.success('Project deleted');
            setDeleteOpen(false);
            navigate(PROJECT_ROUTES.list, { replace: true });
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not delete project.');
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
};
