export const formatCurrency = (value: number, currency = 'IDR', locale = 'id-ID'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};
