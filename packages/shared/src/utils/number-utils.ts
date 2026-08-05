export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const roundTo = (value: number, precision = 2): number => {
  return Number(value.toFixed(precision));
};
