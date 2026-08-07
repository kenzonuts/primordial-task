import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { AuthRouter } from '@features/auth';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';
import { AuthenticatedLayout } from '@features/shell/layouts/authenticated-layout';
import { ModulePlaceholderPage } from '@features/shell/pages/placeholder-page';
import { APP_ROUTES } from '@features/shell/types';

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

  it('exposes select-workspace auth route separately from shell workspaces', () => {
    expect(AUTH_ROUTES.workspaces).toBe('/select-workspace');
  });
});
