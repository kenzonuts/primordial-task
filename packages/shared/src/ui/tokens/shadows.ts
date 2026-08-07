export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.32)',
  md: '0 8px 24px rgba(0, 0, 0, 0.28)',
  lg: '0 16px 48px rgba(0, 0, 0, 0.36)',
  floating: '0 20px 64px rgba(0, 0, 0, 0.42)',
  modal: '0 24px 80px rgba(0, 0, 0, 0.50)',
  popover: '0 10px 32px rgba(0, 0, 0, 0.34)',
} as const;

export type ShadowToken = keyof typeof shadows;
