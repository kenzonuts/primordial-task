export type ThemeMode = 'dark' | 'light';

export interface ThemeDefinition {
  readonly mode: ThemeMode;
  readonly label: string;
}

/** Dark is the only implemented theme. Light is reserved for a future phase. */
export const themes = {
  dark: {
    mode: 'dark',
    label: 'Dark',
  },
  light: {
    mode: 'light',
    label: 'Light',
  },
} as const satisfies Record<ThemeMode, ThemeDefinition>;

export const DEFAULT_THEME: ThemeMode = 'dark';
