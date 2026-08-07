import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { AuthRouter } from '@features/auth';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';

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
