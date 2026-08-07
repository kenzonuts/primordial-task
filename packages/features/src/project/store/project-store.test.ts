import { beforeEach, describe, expect, it } from 'vitest';

import { useProjectStore } from '@features/project/store/project-store';

describe('project store smoke', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProjectStore.setState({
      projects: [],
      currentProject: null,
      selectedProjectId: null,
      members: [],
      filters: {
        query: '',
        sort: 'updated',
        filter: 'all',
        view: 'grid',
      },
      preferences: {
        defaultView: 'grid',
        showArchivedByDefault: false,
        denseList: false,
      },
      status: 'idle',
      membersStatus: 'idle',
      error: null,
      workspaceId: null,
    });
  });

  it('loads seeded projects for a workspace', async () => {
    await useProjectStore.getState().loadProjects('ws-test');
    const state = useProjectStore.getState();

    expect(state.status).toBe('ready');
    expect(state.workspaceId).toBe('ws-test');
    expect(state.projects.length).toBeGreaterThan(0);
  });

  it('creates a project in the active workspace', async () => {
    await useProjectStore.getState().loadProjects('ws-test');
    const project = await useProjectStore.getState().createProject({
      workspaceId: 'ws-test',
      name: 'New Initiative',
      slug: 'new-initiative',
      color: '#60A5FA',
      status: 'planning',
      visibility: 'workspace',
    });

    expect(project.name).toBe('New Initiative');
    expect(useProjectStore.getState().projects.some((item) => item.id === project.id)).toBe(true);
  });
});
