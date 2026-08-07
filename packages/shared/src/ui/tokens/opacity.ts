export const opacity = {
  disabled: 0.48,
  muted: 0.64,
  overlay: 0.64,
  hover: 0.08,
  pressed: 0.12,
  full: 1,
} as const;

export type OpacityToken = keyof typeof opacity;
