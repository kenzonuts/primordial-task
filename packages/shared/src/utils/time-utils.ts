export const formatTime = (value: Date, locale = 'id-ID'): string => {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
};
