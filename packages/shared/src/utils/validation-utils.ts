export const isNonEmptyString = (value: string): boolean => {
  return value.trim().length > 0;
};

export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};
