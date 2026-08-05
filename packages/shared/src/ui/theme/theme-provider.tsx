import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const resolveInitialMode = (): ThemeMode => {
  return 'dark';
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export const ThemeProvider = ({
  children,
  defaultMode = 'dark',
}: ThemeProviderProps): ReactNode => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode ?? resolveInitialMode());

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', mode);

    return () => {
      root.removeAttribute('data-theme');
    };
  }, [mode]);

  const value: ThemeContextValue = {
    mode,
    setMode,
    toggle: () => {
      setMode((current) => (current === 'dark' ? 'light' : 'dark'));
    },
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
