export type ClassValue = string | number | null | undefined | false | ClassValue[];

const isClassValue = (value: ClassValue): value is string | number => {
  return typeof value === 'string' || typeof value === 'number';
};

export const cn = (...values: ClassValue[]): string => {
  const parts: string[] = [];

  for (const value of values) {
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) {
        parts.push(nested);
      }
      continue;
    }

    if (isClassValue(value)) {
      parts.push(String(value));
    }
  }

  return parts.join(' ').trim();
};
