import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";

export const formatDashboardNumber = (value: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);

export const formatDashboardCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const formatDashboardPercent = (value: number) =>
  `${formatDashboardNumber(value)}%`;

export const formatDashboardHours = (value?: number | null) =>
  value === null || value === undefined
    ? "Chưa có dữ liệu"
    : `${formatDashboardNumber(value)} giờ`;

export const formatDashboardDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDashboardDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
};

export const formatDashboardPeriod = (value: string) => {
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");
    return `T${Number(month)}/${year}`;
  }

  try {
    return format(parseISO(value), "dd/MM");
  } catch {
    return value;
  }
};

export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    fromDate: format(startOfMonth(now), "yyyy-MM-dd"),
    toDate: format(endOfMonth(now), "yyyy-MM-dd"),
  };
};

export const getToday = () => format(new Date(), "yyyy-MM-dd");

export const getDashboardErrorMessage = (error: unknown) => {
  const candidate = error as {
    response?: { data?: { message?: string; Message?: string } };
    message?: string;
  };
  return (
    candidate.response?.data?.message ??
    candidate.response?.data?.Message ??
    candidate.message ??
    "Vui lòng thử tải lại dữ liệu."
  );
};
