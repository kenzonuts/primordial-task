import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { AuthRouter } from '@features/auth';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';
import { CalendarPage } from '@features/calendar';
import { useCalendarStore } from '@features/calendar/store/calendar-store';
import { DashboardPage } from '@features/dashboard';
import { useDashboardStore } from '@features/dashboard/store/dashboard-store';
import { BoardListPage } from '@features/kanban';
import { useKanbanBoardStore } from '@features/kanban/store/board-store';
import { ProjectListPage } from '@features/project';
import { useProjectStore } from '@features/project/store/project-store';
import { AuthenticatedLayout } from '@features/shell/layouts/authenticated-layout';
import { ModulePlaceholderPage } from '@features/shell/pages/placeholder-page';
import { APP_ROUTES } from '@features/shell/types';
import { TaskListPage } from '@features/task';
import { useTaskStore } from '@features/task/store/task-store';
import { useWorkspaceStore } from '@features/workspace/store/workspace-store';

describe('authentication routing', () => {
  beforeEach(() => {
    useAuthStore.setState({
      status: 'unauthenticated',
      user: null,
      workspaces: [],
      selectedWorkspaceId: null,
      requiresEmailVerification: false,
      error: null,
      intentPath: null,
      pendingEmail: null,
    });
    window.localStorage.clear();
  });

  it('starts on splash with brand and loading status', async () => {
    render(
      <MemoryRouter initialEntries={[AUTH_ROUTES.splash]}>
        <AuthRouter />
      </MemoryRouter>,
    );

    expect(screen.getAllByText(/primordial task/i).length).toBeGreaterThan(0);

    await waitFor(
      () => {
        expect(
          screen.getAllByText(/opening primordial task|checking your session/i).length,
        ).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );
  });

  it('renders the welcome screen for guests', async () => {
    render(
      <MemoryRouter initialEntries={[AUTH_ROUTES.welcome]}>
        <AuthRouter />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
    });
    expect(screen.getByRole('button', { name: /create account/i })).toBeTruthy();
  });

  it('renders the login form', async () => {
    render(
      <MemoryRouter initialEntries={[AUTH_ROUTES.login]}>
        <AuthRouter />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeTruthy();
    });
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
  });
});

describe('application shell routing', () => {
  beforeEach(() => {
    useAuthStore.setState({
      status: 'authenticated',
      user: {
        id: 'user-1',
        email: 'demo@primordial.task',
        fullName: 'Demo User',
        emailVerified: true,
      },
      workspaces: [
        {
          id: 'ws-1',
          name: 'Primordial Studio',
          role: 'Owner',
          memberCount: 1,
          lastActivityAt: Date.now(),
          initials: 'PS',
        },
      ],
      selectedWorkspaceId: 'ws-1',
      requiresEmailVerification: false,
      error: null,
      intentPath: null,
      pendingEmail: null,
    });
    useDashboardStore.setState({
      summary: null,
      status: 'idle',
      error: null,
      todaysTasks: [],
    });
    window.localStorage.clear();
  });

  it('renders authenticated shell at dashboard', async () => {
    render(
      <MemoryRouter initialEntries={[APP_ROUTES.dashboard]}>
        <Routes>
          <Route element={<AuthenticatedLayout />}>
            <Route path={APP_ROUTES.dashboard} element={<ModulePlaceholderPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('main')).toBeTruthy();
    });
    expect(screen.getAllByText(/dashboard/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/coming soon/i).length).toBeGreaterThan(0);
  });

  it('renders dashboard greeting for authenticated users', async () => {
    render(
      <MemoryRouter initialEntries={[APP_ROUTES.dashboard]}>
        <Routes>
          <Route element={<AuthenticatedLayout />}>
            <Route path={APP_ROUTES.dashboard} element={<DashboardPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
        expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Demo/i);
      },
      { timeout: 5000 },
    );
  });

  it('exposes select-workspace auth route separately from shell workspaces', () => {
    expect(AUTH_ROUTES.workspaces).toBe('/select-workspace');
  });

  it('renders projects list for authenticated users', async () => {
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: 'ws-1',
          name: 'Primordial Studio',
          slug: 'primordial-studio',
          description: '',
          color: '#E6E6E6',
          visibility: 'private',
          role: 'owner',
          owner: {
            id: 'user-1',
            fullName: 'Demo User',
            email: 'demo@primordial.task',
          },
          memberCount: 1,
          isFavorite: false,
          lastUsedAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          archivedAt: null,
        },
      ],
      currentWorkspace: {
        id: 'ws-1',
        name: 'Primordial Studio',
        slug: 'primordial-studio',
        description: '',
        color: '#E6E6E6',
        visibility: 'private',
        role: 'owner',
        owner: {
          id: 'user-1',
          fullName: 'Demo User',
          email: 'demo@primordial.task',
        },
        memberCount: 1,
        isFavorite: false,
        lastUsedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        archivedAt: null,
      },
      previousWorkspaceId: null,
      lastUsedWorkspaceId: 'ws-1',
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
      status: 'ready',
      membersStatus: 'idle',
      error: null,
      initialized: true,
    });
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

    render(
      <MemoryRouter initialEntries={[APP_ROUTES.projects]}>
        <Routes>
          <Route element={<AuthenticatedLayout />}>
            <Route path={APP_ROUTES.projects} element={<ProjectListPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: /projects/i })).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('renders tasks list for authenticated users', async () => {
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: 'ws-1',
          name: 'Primordial Studio',
          slug: 'primordial-studio',
          description: '',
          color: '#E6E6E6',
          visibility: 'private',
          role: 'owner',
          owner: {
            id: 'user-1',
            fullName: 'Demo User',
            email: 'demo@primordial.task',
          },
          memberCount: 1,
          isFavorite: false,
          lastUsedAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          archivedAt: null,
        },
      ],
      currentWorkspace: {
        id: 'ws-1',
        name: 'Primordial Studio',
        slug: 'primordial-studio',
        description: '',
        color: '#E6E6E6',
        visibility: 'private',
        role: 'owner',
        owner: {
          id: 'user-1',
          fullName: 'Demo User',
          email: 'demo@primordial.task',
        },
        memberCount: 1,
        isFavorite: false,
        lastUsedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        archivedAt: null,
      },
      previousWorkspaceId: null,
      lastUsedWorkspaceId: 'ws-1',
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
      status: 'ready',
      membersStatus: 'idle',
      error: null,
      initialized: true,
    });
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
    useTaskStore.setState({
      tasks: [],
      status: 'idle',
      error: null,
      workspaceId: null,
    });

    render(
      <MemoryRouter initialEntries={[APP_ROUTES.tasks]}>
        <Routes>
          <Route element={<AuthenticatedLayout />}>
            <Route path={APP_ROUTES.tasks} element={<TaskListPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: /tasks/i })).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('renders kanban board list for authenticated users', async () => {
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: 'ws-1',
          name: 'Primordial Studio',
          slug: 'primordial-studio',
          description: '',
          color: '#E6E6E6',
          visibility: 'private',
          role: 'owner',
          owner: {
            id: 'user-1',
            fullName: 'Demo User',
            email: 'demo@primordial.task',
          },
          memberCount: 1,
          isFavorite: false,
          lastUsedAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          archivedAt: null,
        },
      ],
      currentWorkspace: {
        id: 'ws-1',
        name: 'Primordial Studio',
        slug: 'primordial-studio',
        description: '',
        color: '#E6E6E6',
        visibility: 'private',
        role: 'owner',
        owner: {
          id: 'user-1',
          fullName: 'Demo User',
          email: 'demo@primordial.task',
        },
        memberCount: 1,
        isFavorite: false,
        lastUsedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        archivedAt: null,
      },
      previousWorkspaceId: null,
      lastUsedWorkspaceId: 'ws-1',
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
      status: 'ready',
      membersStatus: 'idle',
      error: null,
      initialized: true,
    });
    useKanbanBoardStore.setState({
      boards: [],
      currentBoard: null,
      placements: [],
      statistics: null,
      status: 'idle',
      error: null,
      workspaceId: null,
    });

    render(
      <MemoryRouter initialEntries={[APP_ROUTES.kanban]}>
        <Routes>
          <Route element={<AuthenticatedLayout />}>
            <Route path={APP_ROUTES.kanban} element={<BoardListPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: /kanban/i })).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('renders calendar for authenticated users', async () => {
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: 'ws-1',
          name: 'Primordial Studio',
          slug: 'primordial-studio',
          description: '',
          color: '#E6E6E6',
          visibility: 'private',
          role: 'owner',
          owner: {
            id: 'user-1',
            fullName: 'Demo User',
            email: 'demo@primordial.task',
          },
          memberCount: 1,
          isFavorite: false,
          lastUsedAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          archivedAt: null,
        },
      ],
      currentWorkspace: {
        id: 'ws-1',
        name: 'Primordial Studio',
        slug: 'primordial-studio',
        description: '',
        color: '#E6E6E6',
        visibility: 'private',
        role: 'owner',
        owner: {
          id: 'user-1',
          fullName: 'Demo User',
          email: 'demo@primordial.task',
        },
        memberCount: 1,
        isFavorite: false,
        lastUsedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        archivedAt: null,
      },
      previousWorkspaceId: null,
      lastUsedWorkspaceId: 'ws-1',
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
      status: 'ready',
      membersStatus: 'idle',
      error: null,
      initialized: true,
    });
    useCalendarStore.setState({
      events: [],
      milestones: [],
      status: 'idle',
      error: null,
      workspaceId: null,
    });
    useTaskStore.setState({
      tasks: [],
      status: 'idle',
      error: null,
      workspaceId: null,
    });

    render(
      <MemoryRouter initialEntries={[APP_ROUTES.calendar]}>
        <Routes>
          <Route element={<AuthenticatedLayout />}>
            <Route path={APP_ROUTES.calendar} element={<CalendarPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('calendar-page')).toBeTruthy();
        expect(screen.getByRole('heading', { name: /calendar/i })).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });
});
