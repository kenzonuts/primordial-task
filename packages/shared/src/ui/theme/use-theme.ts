import { useContext } from 'react';

import { ThemeContext } from '@shared/ui/theme/theme-context';
import type { ThemeContextValue } from '@shared/ui/theme/theme-context';

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
