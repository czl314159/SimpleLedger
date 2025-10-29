export const formatCurrency = (value: number): string => {
  const formatter = new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return formatter.format(value);
};

export const parseNumber = (input: string): number | null => {
  if (!input.trim()) {
    return null;
  }
  const sanitized = input.replace(/,/g, "");
  const parsed = Number(sanitized);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
};
