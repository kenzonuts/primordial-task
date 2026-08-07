import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AuthRouter } from '@features/auth';
import { AUTH_ROUTES } from '@features/auth/types';

describe('authentication routing', () => {
  it('renders the splash screen at the root route', async () => {
    render(
      <MemoryRouter initialEntries={[AUTH_ROUTES.splash]}>
        <AuthRouter />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeTruthy();
    });
    expect(screen.getByText(/primordial task/i)).toBeTruthy();
  });

  it('renders the welcome screen for guests', async () => {
    render(
      <MemoryRouter initialEntries={[AUTH_ROUTES.welcome]}>
        <AuthRouter />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /primordial task/i })).toBeTruthy();
    });
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
  });
});
