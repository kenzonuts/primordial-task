export const spacing = {
  2: '2px',
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  56: '56px',
  64: '64px',
  80: '80px',
  96: '96px',
} as const;

export const radius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.32)',
  md: '0 8px 24px rgba(0, 0, 0, 0.28)',
  lg: '0 16px 48px rgba(0, 0, 0, 0.36)',
  floating: '0 20px 64px rgba(0, 0, 0, 0.42)',
  modal: '0 24px 80px rgba(0, 0, 0, 0.50)',
  popover: '0 10px 32px rgba(0, 0, 0, 0.34)',
} as const;

export const borderWidths = {
  hairline: '1px',
  default: '1px',
  strong: '2px',
} as const;

export const opacity = {
  disabled: '0.5',
  muted: '0.6',
  subtle: '0.12',
} as const as Record<string, string>;

export const zIndex = {
  base: 0,
  sticky: 10,
  dropdown: 20,
  popover: 30,
  tooltip: 40,
  modal: 50,
  drawer: 60,
  toast: 70,
  command: 80,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const motionDuration = {
  instant: '80ms',
  fast: '120ms',
  base: '180ms',
  slow: '240ms',
  page: '320ms',
} as const;

export const motionCurves = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const iconSizes = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 32,
} as const;

export const layout = {
  windowMinWidth: '1024px',
  container: '1280px',
  maxWidth: '1600px',
  sidebarWidth: '264px',
  sidebarCompact: '72px',
  inspectorWidth: '360px',
  contentPadding: '24px',
  contentPaddingDense: '16px',
} as const;
