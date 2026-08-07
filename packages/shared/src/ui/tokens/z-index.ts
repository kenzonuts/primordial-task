export const zIndex = {
  base: 0,
  sticky: 10,
  dropdown: 40,
  popover: 50,
  tooltip: 60,
  drawer: 70,
  modal: 80,
  toast: 90,
  command: 100,
} as const;

export type ZIndexToken = keyof typeof zIndex;
