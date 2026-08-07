import { createContext } from 'react';

import type { ThemeMode } from '@shared/ui/theme/themes';

export interface ThemeContextValue {
  readonly theme: ThemeMode;
  readonly setTheme: (theme: ThemeMode) => void;
  readonly resolvedTheme: 'dark';
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
