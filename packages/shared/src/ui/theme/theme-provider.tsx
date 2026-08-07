import type { PropsWithChildren, ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ThemeContext } from '@shared/ui/theme/theme-context';
import type { ThemeMode } from '@shared/ui/theme/themes';
import { DEFAULT_THEME } from '@shared/ui/theme/themes';

interface ThemeProviderProps extends PropsWithChildren {
  readonly defaultTheme?: ThemeMode;
  readonly storageKey?: string;
}

export const ThemeProvider = ({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = 'primordial-theme',
}: ThemeProviderProps): ReactElement => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }

    const stored = window.localStorage.getItem(storageKey);
    return stored === 'dark' || stored === 'light' ? stored : defaultTheme;
  });

  const setTheme = useCallback(
    (next: ThemeMode) => {
      // Light theme is prepared in the contract but not implemented yet.
      const resolved = next === 'light' ? 'dark' : next;
      setThemeState(resolved);
      window.localStorage.setItem(storageKey, resolved);
    },
    [storageKey],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = 'dark';
    root.classList.add('dark');
    root.classList.remove('light');
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme: 'dark' as const,
    }),
    [setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
