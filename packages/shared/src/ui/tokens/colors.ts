export const grayScale = {
  0: '#FFFFFF',
  50: '#F5F5F5',
  100: '#E6E6E6',
  200: '#CFCFCF',
  300: '#A8A8A8',
  400: '#858585',
  500: '#666666',
  600: '#4A4A4A',
  700: '#333333',
  800: '#242424',
  850: '#1C1C1C',
  900: '#141414',
  950: '#0B0B0B',
  black: '#000000',
} as const;

export const semanticColors = {
  bgApp: '#0B0B0B',
  bgWorkspace: '#141414',
  bgSecondary: '#1C1C1C',
  surfaceBase: '#1C1C1C',
  surfaceElevated: '#242424',
  surfaceSidebar: '#111111',
  surfaceNav: '#171717',
  surfaceCard: '#1F1F1F',
  surfaceInput: '#181818',
  borderDefault: '#333333',
  borderSubtle: '#262626',
  borderStrong: '#4A4A4A',
  divider: '#2A2A2A',
  overlayScrim: 'rgba(0, 0, 0, 0.64)',
  textPrimary: '#E6E6E6',
  textSecondary: '#A8A8A8',
  textMuted: '#858585',
  textDisabled: '#666666',
  textPlaceholder: '#666666',
  stateHover: '#262626',
  statePressed: '#303030',
  stateSelected: '#2D2D2D',
  stateFocus: '#F5F5F5',
  stateSkeleton: '#262626',
  stateSkeletonHighlight: '#333333',
} as const;

export const statusColors = {
  success: '#4ADE80',
  successBg: 'rgba(74, 222, 128, 0.12)',
  warning: '#FACC15',
  warningBg: 'rgba(250, 204, 21, 0.12)',
  danger: '#F87171',
  dangerBg: 'rgba(248, 113, 113, 0.12)',
  info: '#60A5FA',
  infoBg: 'rgba(96, 165, 250, 0.12)',
} as const;

export type GrayScaleToken = keyof typeof grayScale;
export type SemanticColorToken = keyof typeof semanticColors;
export type StatusColorToken = keyof typeof statusColors;
