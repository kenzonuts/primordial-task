export const fonts = {
  primary: 'Inter, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", "Cascadia Code", "Roboto Mono", monospace',
} as const;

export const fontWeights = {
  regular: 450,
  medium: 560,
  semibold: 600,
  bold: 650,
} as const;

export const typography = {
  display: {
    family: 'primary',
    weight: fontWeights.bold,
    size: 32,
    lineHeight: 40,
    letterSpacing: 0,
  },
  h1: {
    family: 'primary',
    weight: fontWeights.bold,
    size: 26,
    lineHeight: 34,
    letterSpacing: 0,
  },
  h2: {
    family: 'primary',
    weight: fontWeights.semibold,
    size: 22,
    lineHeight: 30,
    letterSpacing: 0,
  },
  h3: {
    family: 'primary',
    weight: fontWeights.semibold,
    size: 18,
    lineHeight: 26,
    letterSpacing: 0,
  },
  h4: {
    family: 'primary',
    weight: fontWeights.semibold,
    size: 15,
    lineHeight: 22,
    letterSpacing: 0,
  },
  'body-large': {
    family: 'primary',
    weight: fontWeights.regular,
    size: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  'body-medium': {
    family: 'primary',
    weight: fontWeights.regular,
    size: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  'body-small': {
    family: 'primary',
    weight: fontWeights.regular,
    size: 13,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    family: 'primary',
    weight: fontWeights.regular,
    size: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  label: {
    family: 'primary',
    weight: fontWeights.medium,
    size: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  button: {
    family: 'primary',
    weight: fontWeights.medium,
    size: 13,
    lineHeight: 16,
    letterSpacing: 0,
  },
  mono: {
    family: 'mono',
    weight: fontWeights.regular,
    size: 13,
    lineHeight: 20,
    letterSpacing: 0,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
