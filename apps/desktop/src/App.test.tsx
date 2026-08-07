import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';

describe('design system shell smoke test', () => {
  it('renders the design system initialized shell', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /primordial task/i })).toBeTruthy();
    expect(screen.getByText(/design system initialized/i)).toBeTruthy();
  });
});
