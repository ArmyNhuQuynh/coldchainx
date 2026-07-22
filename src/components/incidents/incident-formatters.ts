const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const MONEY_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export const formatIncidentDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : DATE_TIME_FORMATTER.format(date);
};

export const formatIncidentMoney = (value?: number | null) =>
  MONEY_FORMATTER.format(Number(value ?? 0));

export const formatIncidentId = (value?: string | null) =>
  value ? value.slice(0, 8).toUpperCase() : "—";

type IncidentApiError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
      Message?: string;
      error?: string;
      Error?: string;
    };
  };
};

export const getIncidentErrorMessage = (
  error: unknown,
  fallback: string
) => {
  const apiError = error as IncidentApiError;
  return (
    apiError.response?.data?.message ||
    apiError.response?.data?.Message ||
    apiError.response?.data?.error ||
    apiError.response?.data?.Error ||
    apiError.message ||
    fallback
  );
};
