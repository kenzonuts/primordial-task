export const iconSizes = {
  dense: 14,
  default: 16,
  navigation: 20,
  empty: 32,
} as const;

export const iconStrokeWidths = {
  default: 1.75,
  large: 1.5,
} as const;

export type IconSizeToken = keyof typeof iconSizes;
