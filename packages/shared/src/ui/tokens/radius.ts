export const radii = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '999px',
} as const;

export type RadiusToken = keyof typeof radii;
