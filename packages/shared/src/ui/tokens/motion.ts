export const motionDurations = {
  instant: '80ms',
  fast: '120ms',
  base: '180ms',
  slow: '240ms',
  page: '320ms',
} as const;

export const motionEasings = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export type MotionDurationToken = keyof typeof motionDurations;
export type MotionEasingToken = keyof typeof motionEasings;
