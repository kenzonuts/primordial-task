import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { ContentLayout } from '@features/shell/layouts/content-layout';
import { DeleteConfirmationDialog } from '@features/workspace/components/delete-confirmation-dialog';
import { WorkspaceFormFields } from '@features/workspace/components/workspace-form-fields';
import { WorkspaceMemberList } from '@features/workspace/components/workspace-member-list';
import { useWorkspaceContext } from '@features/workspace/context/workspace-context';
import { WORKSPACE_ROLE_LABELS, hasWorkspacePermission } from '@features/workspace/rbac';
import {
  createWorkspaceSchema,
  inviteMemberSchema,
  type CreateWorkspaceFormValues,
  type InviteMemberFormValues,
} from '@features/workspace/schemas/workspace-schemas';
import { useWorkspaceStore } from '@features/workspace/store/workspace-store';
import type { Workspace, WorkspaceSettingsSection } from '@features/workspace/types';
import { WORKSPACE_ROUTES, workspaceDetailPath } from '@features/workspace/types';
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
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

const SETTINGS_NAV: ReadonlyArray<{
  readonly id: WorkspaceSettingsSection;
  readonly label: string;
}> = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'members', label: 'Members' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'billing', label: 'Billing' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'danger', label: 'Danger Zone' },
];

const isSettingsSection = (value: string | null): value is WorkspaceSettingsSection => {
  return SETTINGS_NAV.some((item) => item.id === value);
};

export const WorkspaceSettingsPage = (): ReactElement => {
  const { id = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { can } = useWorkspaceContext();
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const status = useWorkspaceStore((state) => state.status);
  const initialize = useWorkspaceStore((state) => state.initialize);
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
  const members = useWorkspaceStore((state) => state.members);
  const membersStatus = useWorkspaceStore((state) => state.membersStatus);
  const loadMembers = useWorkspaceStore((state) => state.loadMembers);
  const inviteMember = useWorkspaceStore((state) => state.inviteMember);
  const removeMember = useWorkspaceStore((state) => state.removeMember);
  const updateMemberRole = useWorkspaceStore((state) => state.updateMemberRole);
  const archiveWorkspace = useWorkspaceStore((state) => state.archiveWorkspace);
  const restoreWorkspace = useWorkspaceStore((state) => state.restoreWorkspace);
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace);
  const preferences = useWorkspaceStore((state) => state.preferences);
  const updatePreferences = useWorkspaceStore((state) => state.updatePreferences);

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const sectionParam = searchParams.get('section');
  const section: WorkspaceSettingsSection = isSettingsSection(sectionParam)
    ? sectionParam
    : 'general';

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    setWorkspace(workspaces.find((item) => item.id === id) ?? null);
  }, [workspaces, id]);

  useEffect(() => {
    if (id && (section === 'members' || section === 'permissions')) {
      void loadMembers(id);
    }
  }, [id, section, loadMembers]);

  const generalForm = useForm<CreateWorkspaceFormValues>({
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

  const inviteForm = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (workspace) {
      generalForm.reset({
        name: workspace.name,
        slug: workspace.slug,
        description: workspace.description,
        color: workspace.color,
        logoUrl: workspace.logoUrl ?? '',
        visibility: workspace.visibility,
      });
    }
  }, [workspace, generalForm]);

  const setSection = (next: WorkspaceSettingsSection): void => {
    setSearchParams(next === 'general' ? {} : { section: next }, { replace: true });
  };

  const onSaveGeneral = generalForm.handleSubmit(async (values) => {
    if (!id) {
      return;
    }
    try {
      await updateWorkspace(id, {
        name: values.name,
        slug: values.slug,
        description: values.description || '',
        color: values.color,
        logoUrl: values.logoUrl || '',
        visibility: values.visibility,
      });
      toast.success('Workspace settings saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save settings.');
    }
  });

  const onInvite = inviteForm.handleSubmit(async (values) => {
    if (!id) {
      return;
    }
    try {
      await inviteMember(id, values);
      inviteForm.reset({ email: '', role: 'member' });
      toast.success('Invitation sent');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not invite member.');
    }
  });

  const navItems = useMemo(() => {
    return SETTINGS_NAV.filter((item) => {
      if (item.id === 'billing') {
        return can('billing.view') || can('settings.view');
      }
      if (item.id === 'danger') {
        return can('workspace.archive') || can('workspace.delete');
      }
      return can('settings.view');
    });
  }, [can]);

  if (status === 'loading' || status === 'idle') {
    return (
      <ContentLayout title="Workspace settings">
        <div className="mt-24 flex justify-center">
          <LoadingIndicator label="Loading settings" />
        </div>
      </ContentLayout>
    );
  }

  if (!workspace) {
    return (
      <ContentLayout title="Workspace settings">
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

  return (
    <div className="mx-auto w-full max-w-none p-24">
      <Inline gap={16} align="start" justify="between" className="w-full">
        <Stack gap={4} className="min-w-0">
          <Heading level={1}>Settings</Heading>
          <Text as="p" variant="body-md" muted>
            {workspace.name}
          </Text>
        </Stack>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => {
            navigate(workspaceDetailPath(workspace.id));
          }}
        >
          Back to overview
        </Button>
      </Inline>

      <div className="mt-24 grid grid-cols-[220px_minmax(0,1fr)] gap-24 max-md:grid-cols-1">
        <nav aria-label="Settings sections">
          <Stack gap={4}>
            {navItems.map((item) => (
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
                  <WorkspaceFormFields
                    disabled={generalForm.formState.isSubmitting || !can('settings.edit')}
                    autoSlugFromName={false}
                  />
                  {can('settings.edit') ? (
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={generalForm.formState.isSubmitting}
                    >
                      Save changes
                    </Button>
                  ) : null}
                </form>
              </Form>
            </Stack>
          ) : null}

          {section === 'appearance' ? (
            <Stack gap={16}>
              <Heading level={2}>Appearance</Heading>
              <Text as="p" variant="body-sm" muted>
                Preferences for how this workspace appears in the shell.
              </Text>
              <Inline
                gap={12}
                align="center"
                justify="between"
                className="rounded-lg border border-border-subtle px-4 py-3"
              >
                <Stack gap={2}>
                  <Text as="span" variant="body-sm" className="font-medium">
                    Show archived in switcher
                  </Text>
                  <Text as="span" variant="caption" muted>
                    Include archived workspaces in the sidebar switcher.
                  </Text>
                </Stack>
                <Switch
                  checked={preferences.showArchivedInSwitcher}
                  disabled={!can('settings.edit')}
                  onCheckedChange={(checked) => {
                    void updatePreferences({ showArchivedInSwitcher: checked }).then(() => {
                      toast.success('Preference updated');
                    });
                  }}
                  aria-label="Show archived in switcher"
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
                    Default density
                  </Text>
                  <Text as="span" variant="caption" muted>
                    Comfortable or compact chrome spacing.
                  </Text>
                </Stack>
                <Select
                  value={preferences.density}
                  disabled={!can('settings.edit')}
                  onValueChange={(value) => {
                    void updatePreferences({
                      density: value as 'comfortable' | 'compact',
                    }).then(() => {
                      toast.success('Preference updated');
                    });
                  }}
                >
                  <SelectTrigger size="md" className="w-[160px]" aria-label="Density">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </Inline>
            </Stack>
          ) : null}

          {section === 'members' ? (
            <Stack gap={16}>
              <Heading level={2}>Members</Heading>
              {can('members.invite') ? (
                <Form {...inviteForm}>
                  <form
                    onSubmit={onInvite}
                    noValidate
                    className="rounded-lg border border-border-subtle p-4"
                  >
                    <Text as="p" variant="body-sm" className="mb-12 font-medium">
                      Invite member
                    </Text>
                    <Inline gap={12} align="end" className="flex-wrap">
                      <FormField
                        control={inviteForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="min-w-[240px] flex-1">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                size="md"
                                type="email"
                                placeholder="teammate@company.com"
                                disabled={inviteForm.formState.isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={inviteForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="w-[180px]">
                            <FormLabel>Role</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={inviteForm.formState.isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger size="md" aria-label="Role">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="administrator">Administrator</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="guest">Guest</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={inviteForm.formState.isSubmitting}
                      >
                        Invite
                      </Button>
                    </Inline>
                  </form>
                </Form>
              ) : null}

              {membersStatus === 'loading' ? (
                <LoadingIndicator label="Loading members" size="button" />
              ) : (
                <WorkspaceMemberList
                  members={members}
                  renderActions={(member) => {
                    if (member.role === 'owner') {
                      return null;
                    }
                    return (
                      <Inline gap={4}>
                        {can('members.role.assign') ? (
                          <Select
                            value={member.role}
                            onValueChange={(value) => {
                              void updateMemberRole(
                                workspace.id,
                                member.id,
                                value as Exclude<typeof member.role, 'owner'>,
                              )
                                .then(() => {
                                  toast.success('Role updated');
                                })
                                .catch((error: unknown) => {
                                  toast.error(
                                    error instanceof Error
                                      ? error.message
                                      : 'Could not update role.',
                                  );
                                });
                            }}
                          >
                            <SelectTrigger size="sm" aria-label={`Role for ${member.fullName}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="administrator">Administrator</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                              <SelectItem value="guest">Guest</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : null}
                        {can('members.remove') ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              void removeMember(workspace.id, member.id)
                                .then(() => {
                                  toast.success('Member removed');
                                })
                                .catch((error: unknown) => {
                                  toast.error(
                                    error instanceof Error
                                      ? error.message
                                      : 'Could not remove member.',
                                  );
                                });
                            }}
                          >
                            Remove
                          </Button>
                        ) : null}
                      </Inline>
                    );
                  }}
                />
              )}
            </Stack>
          ) : null}

          {section === 'permissions' ? (
            <Stack gap={16}>
              <Heading level={2}>Permissions</Heading>
              <Text as="p" variant="body-sm" muted>
                Role capabilities for this workspace (read-only overview).
              </Text>
              <Stack gap={8}>
                {(
                  Object.keys(WORKSPACE_ROLE_LABELS) as Array<keyof typeof WORKSPACE_ROLE_LABELS>
                ).map((role) => (
                  <div key={role} className="rounded-lg border border-border-subtle px-4 py-3">
                    <Text as="p" variant="body-sm" className="font-medium">
                      {WORKSPACE_ROLE_LABELS[role]}
                    </Text>
                    <Text as="p" variant="caption" muted className="mt-1">
                      {[
                        hasWorkspacePermission(role, 'workspace.edit') ? 'Edit workspace' : null,
                        hasWorkspacePermission(role, 'members.invite') ? 'Invite members' : null,
                        hasWorkspacePermission(role, 'settings.edit') ? 'Edit settings' : null,
                        hasWorkspacePermission(role, 'workspace.delete') ? 'Delete' : null,
                      ]
                        .filter(Boolean)
                        .join(' · ') || 'View only'}
                    </Text>
                  </div>
                ))}
              </Stack>
            </Stack>
          ) : null}

          {section === 'billing' ? (
            <Stack gap={16}>
              <Heading level={2}>Billing</Heading>
              <EmptyState
                title="Billing coming soon"
                description="Plans and invoices will appear here in a later release."
              />
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
                Archive, restore, or permanently delete this workspace.
              </Alert>

              <div className="rounded-lg border border-border-subtle p-4">
                <Inline gap={12} align="center" justify="between" className="flex-wrap">
                  <Stack gap={2}>
                    <Text as="span" variant="body-sm" className="font-medium">
                      {workspace.archivedAt ? 'Restore workspace' : 'Archive workspace'}
                    </Text>
                    <Text as="span" variant="caption" muted>
                      {workspace.archivedAt
                        ? 'Make this workspace available again.'
                        : 'Hide this workspace from active lists.'}
                    </Text>
                  </Stack>
                  {workspace.archivedAt ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      loading={busy}
                      disabled={!can('workspace.archive')}
                      onClick={() => {
                        setBusy(true);
                        void restoreWorkspace(workspace.id)
                          .then(() => {
                            toast.success('Workspace restored');
                          })
                          .catch((error: unknown) => {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : 'Could not restore workspace.',
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
                      disabled={!can('workspace.archive')}
                      onClick={() => {
                        setBusy(true);
                        void archiveWorkspace(workspace.id)
                          .then(() => {
                            toast.success('Workspace archived');
                          })
                          .catch((error: unknown) => {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : 'Could not archive workspace.',
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
                      Delete workspace
                    </Text>
                    <Text as="span" variant="caption" muted>
                      Permanently remove this workspace and its local data.
                    </Text>
                  </Stack>
                  <Button
                    type="button"
                    variant="destructive"
                    size="md"
                    disabled={!can('workspace.delete')}
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

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        workspaceName={workspace.name}
        loading={busy}
        onConfirm={async () => {
          setBusy(true);
          try {
            await deleteWorkspace(workspace.id);
            toast.success('Workspace deleted');
            setDeleteOpen(false);
            navigate(WORKSPACE_ROUTES.list, { replace: true });
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not delete workspace.');
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
};
