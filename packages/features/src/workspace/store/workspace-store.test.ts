import { beforeEach, describe, expect, it } from 'vitest';

import { useWorkspaceStore } from '@features/workspace/store/workspace-store';

describe('workspace store smoke', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useWorkspaceStore.setState({
      workspaces: [],
      currentWorkspace: null,
      previousWorkspaceId: null,
      lastUsedWorkspaceId: null,
      members: [],
      preferences: {
        defaultView: 'dashboard',
        density: 'comfortable',
        showArchivedInSwitcher: false,
      },
      filters: {
        query: '',
        sort: 'recent',
        filter: 'all',
      },
      status: 'idle',
      membersStatus: 'idle',
      error: null,
      initialized: false,
    });
  });

  it('initializes seeded workspaces', async () => {
    await useWorkspaceStore.getState().initialize();
    const state = useWorkspaceStore.getState();

    expect(state.status).toBe('ready');
    expect(state.workspaces.length).toBeGreaterThan(0);
    expect(state.currentWorkspace).not.toBeNull();
  });
});
