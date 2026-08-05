export const colors = {
  gray: {
    '0': '#FFFFFF',
    '50': '#F5F5F5',
    '100': '#E6E6E6',
    '200': '#CFCFCF',
    '300': '#A8A8A8',
    '400': '#858585',
    '500': '#666666',
    '600': '#4A4A4A',
    '700': '#333333',
    '800': '#242424',
    '850': '#1C1C1C',
    '900': '#141414',
    '950': '#0B0B0B',
  },
  black: '#000000',
} as const;

export const semanticColors = {
  bg: {
    app: '#0B0B0B',
    workspace: '#141414',
    secondary: '#1C1C1C',
  },
  surface: {
    base: '#1C1C1C',
    elevated: '#242424',
    sidebar: '#111111',
    nav: '#171717',
    card: '#1F1F1F',
    input: '#181818',
  },
  border: {
    default: '#333333',
    subtle: '#262626',
    strong: '#4A4A4A',
  },
  divider: '#2A2A2A',
  overlay: {
    scrim: 'rgba(0, 0, 0, 0.64)',
  },
  text: {
    primary: '#E6E6E6',
    secondary: '#A8A8A8',
    muted: '#858585',
    disabled: '#666666',
    placeholder: '#666666',
  },
  state: {
    hover: '#262626',
    pressed: '#303030',
    selected: '#2D2D2D',
    focus: '#F5F5F5',
    skeleton: '#262626',
    'skeleton-highlight': '#333333',
  },
} as const;

export const statusColors = {
  success: {
    base: '#4ADE80',
    bg: 'rgba(74, 222, 128, 0.12)',
  },
  warning: {
    base: '#FACC15',
    bg: 'rgba(250, 204, 21, 0.12)',
  },
  danger: {
    base: '#F87171',
    bg: 'rgba(248, 113, 113, 0.12)',
  },
  info: {
    base: '#60A5FA',
    bg: 'rgba(96, 165, 250, 0.12)',
  },
} as const;

export type ColorScale = typeof colors.gray;
export type SemanticColor = typeof semanticColors;
export type StatusColor = typeof statusColors;
