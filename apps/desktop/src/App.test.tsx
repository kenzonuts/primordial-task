import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';

describe('foundation smoke test', () => {
  it('renders the starter shell', () => {
    render(<App />);

    expect(screen.getByText(/primordial task foundation initialized/i)).toBeTruthy();
  });
});
