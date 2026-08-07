export const fontFamilies = {
  sans: 'Inter, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", "Cascadia Code", "Roboto Mono", monospace',
} as const;

export const fontWeights = {
  regular: 450,
  medium: 560,
  semibold: 600,
  bold: 620,
  display: 650,
} as const;

export const typeScale = {
  display: {
    family: 'sans',
    weight: fontWeights.display,
    size: '32px',
    lineHeight: '40px',
    letterSpacing: '0',
  },
  h1: {
    family: 'sans',
    weight: fontWeights.display,
    size: '26px',
    lineHeight: '34px',
    letterSpacing: '0',
  },
  h2: {
    family: 'sans',
    weight: fontWeights.bold,
    size: '22px',
    lineHeight: '30px',
    letterSpacing: '0',
  },
  h3: {
    family: 'sans',
    weight: fontWeights.semibold,
    size: '18px',
    lineHeight: '26px',
    letterSpacing: '0',
  },
  h4: {
    family: 'sans',
    weight: fontWeights.semibold,
    size: '15px',
    lineHeight: '22px',
    letterSpacing: '0',
  },
  bodyLg: {
    family: 'sans',
    weight: fontWeights.regular,
    size: '16px',
    lineHeight: '24px',
    letterSpacing: '0',
  },
  bodyMd: {
    family: 'sans',
    weight: fontWeights.regular,
    size: '14px',
    lineHeight: '22px',
    letterSpacing: '0',
  },
  bodySm: {
    family: 'sans',
    weight: fontWeights.regular,
    size: '13px',
    lineHeight: '20px',
    letterSpacing: '0',
  },
  caption: {
    family: 'sans',
    weight: fontWeights.regular,
    size: '12px',
    lineHeight: '18px',
    letterSpacing: '0',
  },
  label: {
    family: 'sans',
    weight: fontWeights.medium,
    size: '12px',
    lineHeight: '16px',
    letterSpacing: '0',
  },
  button: {
    family: 'sans',
    weight: fontWeights.medium,
    size: '13px',
    lineHeight: '16px',
    letterSpacing: '0',
  },
  mono: {
    family: 'mono',
    weight: fontWeights.regular,
    size: '13px',
    lineHeight: '20px',
    letterSpacing: '0',
  },
} as const;

export type TypeScaleToken = keyof typeof typeScale;
