export const formatDate = (value: Date, locale = 'id-ID'): string => {
  return new Intl.DateTimeFormat(locale).format(value);
};

export const isSameDay = (left: Date, right: Date): boolean => {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
};
